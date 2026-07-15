(() => {
  "use strict";

  let deferredInstallPrompt = null;
  let refreshing = false;

  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  const isIOS = /iPad|iPhone|iPod/.test(ua) ||
    (platform === "MacIntel" && maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isMac = /Macintosh|Mac OS X/i.test(ua) && !isIOS;
  const isWindows = /Windows/i.test(ua);
  const isChromeOS = /CrOS/i.test(ua);
  const isEdge = /Edg\//i.test(ua);
  const isChrome = /Chrome|CriOS/i.test(ua) && !isEdge;
  const isFirefox = /Firefox|FxiOS/i.test(ua);
  const isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|Edg|OPR|Firefox|FxiOS/i.test(ua);
  const isSamsungInternet = /SamsungBrowser/i.test(ua);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  function createUI() {
    if (document.querySelector(".pwa-install-sheet")) return;

    document.body.insertAdjacentHTML("beforeend", `
      <div class="pwa-offline-pill" role="status">Offline mode</div>

      <div class="pwa-toast" id="pwaUpdateToast" role="status" aria-live="polite">
        <div class="pwa-toast__icon">✨</div>
        <div class="pwa-toast__copy">
          <strong>A fresh version is ready</strong>
          <span>Update now to load the newest 3Dudes1Life experience.</span>
        </div>
        <div class="pwa-toast__actions">
          <button class="pwa-toast__secondary" type="button" data-pwa-dismiss>Later</button>
          <button class="pwa-toast__primary" type="button" data-pwa-update>Update</button>
        </div>
      </div>

      <div class="pwa-install-sheet" id="pwaInstallSheet" aria-hidden="true">
        <div class="pwa-install-sheet__panel" role="dialog" aria-modal="true" aria-labelledby="pwaInstallTitle">
          <div class="pwa-install-sheet__top">
            <h2 id="pwaInstallTitle">📲 Add 3Dudes1Life</h2>
            <button class="pwa-install-sheet__close" type="button" data-pwa-close aria-label="Close">×</button>
          </div>
          <p class="pwa-install-sheet__lead" data-pwa-lead></p>
          <ol class="pwa-install-sheet__steps" data-pwa-steps></ol>
          <button class="pwa-install-sheet__install" type="button" data-pwa-native-install hidden>Add App</button>
          <p class="pwa-install-sheet__status" data-pwa-status></p>
        </div>
      </div>
    `);

    document.querySelector("[data-pwa-close]")?.addEventListener("click", closeInstallSheet);
    document.querySelector("#pwaInstallSheet")?.addEventListener("click", event => {
      if (event.target.id === "pwaInstallSheet") closeInstallSheet();
    });
    document.querySelector("[data-pwa-native-install]")?.addEventListener("click", runNativeInstall);
    document.querySelector("[data-pwa-dismiss]")?.addEventListener("click", hideUpdateToast);
    document.querySelector("[data-pwa-update]")?.addEventListener("click", applyUpdate);

    document.querySelectorAll(".install-btn").forEach(button => {
      button.removeAttribute("onclick");
      button.addEventListener("click", openInstallSheet);
    });
  }

  function setSteps(items) {
    const steps = document.querySelector("[data-pwa-steps]");
    if (!steps) return;
    steps.innerHTML = items.map(item => `<li>${item}</li>`).join("");
  }

  function setInstallContent() {
    const title = document.querySelector("#pwaInstallTitle");
    const lead = document.querySelector("[data-pwa-lead]");
    const status = document.querySelector("[data-pwa-status]");
    const nativeButton = document.querySelector("[data-pwa-native-install]");
    if (!title || !lead || !status || !nativeButton) return;

    title.textContent = "📲 Add 3Dudes1Life";
    nativeButton.hidden = true;
    nativeButton.textContent = "Add App";
    status.textContent = "";

    if (isStandalone) {
      title.textContent = "✅ 3Dudes1Life Is Already Added";
      lead.textContent = "You’re already using the standalone app experience.";
      setSteps([
        isIOS
          ? "Keep the 3Dudes1Life icon on your Home Screen for one-tap access."
          : "Keep 3Dudes1Life in your Dock, taskbar, launcher, or app list for one-tap access."
      ]);
      status.textContent = "Nothing else is required.";
      return;
    }

    if (deferredInstallPrompt) {
      lead.textContent = "Your browser can add 3Dudes1Life as an app right now.";
      setSteps([
        "Choose Add App below.",
        "Approve the browser’s confirmation message."
      ]);
      status.textContent = "It will open in its own app-style window and retain essential offline access.";
      nativeButton.hidden = false;
      return;
    }

    if (isIOS) {
      title.textContent = "📲 Add to Your Home Screen";
      lead.textContent = "On iPhone or iPad, add 3Dudes1Life from the browser’s Share menu.";
      setSteps([
        "Open this page in Safari.",
        "Tap the Share button — the square with the upward arrow.",
        "Scroll down and choose <strong>Add to Home Screen</strong>.",
        "Tap <strong>Add</strong>."
      ]);
      status.textContent = "The 3Dudes1Life icon will appear on your iPhone or iPad Home Screen.";
      return;
    }

    if (isMac && isSafari) {
      title.textContent = "💻 Add 3Dudes1Life on Your Mac";
      lead.textContent = "Safari adds websites like this to your Mac as web apps.";
      setSteps([
        "In Safari’s menu bar, choose <strong>File</strong>.",
        "Choose <strong>Add to Dock</strong>.",
        "Confirm the name, then choose <strong>Add</strong>."
      ]);
      status.textContent = "3Dudes1Life will be added to your Dock and Applications folder. On Mac, Apple calls this “Add to Dock,” not “Install App.”";
      return;
    }

    if (isMac && isEdge) {
      title.textContent = "💻 Add 3Dudes1Life on Your Mac";
      lead.textContent = "Microsoft Edge can add this site as an app-style shortcut.";
      setSteps([
        "Open the Edge menu (•••).",
        "Choose <strong>Apps</strong>.",
        "Choose <strong>Install this site as an app</strong>, then confirm."
      ]);
      status.textContent = "The exact Edge wording may vary slightly by version.";
      return;
    }

    if (isMac && isChrome) {
      title.textContent = "💻 Add 3Dudes1Life on Your Mac";
      lead.textContent = "Chrome can add 3Dudes1Life as an app-style shortcut.";
      setSteps([
        "Look for the Add or Install icon at the right side of Chrome’s address bar.",
        "If it is not shown, open Chrome’s menu (⋮).",
        "Choose <strong>Cast, save, and share</strong>, then choose the available app or shortcut option."
      ]);
      status.textContent = "Chrome’s menu wording can vary by version. Safari’s Mac option is File → Add to Dock.";
      return;
    }

    if (isAndroid && isSamsungInternet) {
      title.textContent = "📲 Add to Your Android Home Screen";
      lead.textContent = "Samsung Internet can place 3Dudes1Life directly on your Home screen.";
      setSteps([
        "Open the Samsung Internet menu (☰).",
        "Choose <strong>Add page to</strong>.",
        "Choose <strong>Home screen</strong>, then confirm."
      ]);
      status.textContent = "The icon will appear with your other Android apps and shortcuts.";
      return;
    }

    if (isAndroid) {
      title.textContent = "📲 Add to Your Android Home Screen";
      lead.textContent = "Add 3Dudes1Life from your Android browser menu.";
      setSteps([
        "Open the browser menu (⋮).",
        "Choose <strong>Add to Home screen</strong> or <strong>Install app</strong>.",
        "Confirm the name and placement."
      ]);
      status.textContent = "Android wording varies by browser: Chrome may say “Install app” while others say “Add to Home screen.”";
      return;
    }

    if (isWindows && isEdge) {
      title.textContent = "🖥️ Add 3Dudes1Life on Windows";
      lead.textContent = "Microsoft Edge can add this site as an app.";
      setSteps([
        "Open the Edge menu (•••).",
        "Choose <strong>Apps</strong>.",
        "Choose <strong>Install this site as an app</strong>, then confirm."
      ]);
      status.textContent = "You can pin it to the taskbar or Start menu after it is added.";
      return;
    }

    if ((isWindows || isChromeOS) && isChrome) {
      title.textContent = isChromeOS
        ? "💻 Add 3Dudes1Life on Your Chromebook"
        : "🖥️ Add 3Dudes1Life on Windows";
      lead.textContent = "Chrome can add 3Dudes1Life as an app.";
      setSteps([
        "Look for the Add or Install icon at the right side of the address bar.",
        "If it is not shown, open Chrome’s menu (⋮).",
        "Choose <strong>Cast, save, and share</strong>, then choose the available app or shortcut option."
      ]);
      status.textContent = "Afterward, open it from your Start menu, taskbar, or Chromebook launcher.";
      return;
    }

    if (isFirefox) {
      title.textContent = "🔖 Save 3Dudes1Life";
      lead.textContent = "Firefox desktop does not currently offer the same full web-app installation flow.";
      setSteps([
        "Bookmark this page in Firefox for quick access.",
        "For a standalone app-style window, open this site in Safari, Chrome, or Edge.",
        isMac
          ? "On Mac Safari, choose <strong>File → Add to Dock</strong>."
          : "Follow that browser’s Add or Install option."
      ]);
      status.textContent = "You can continue using every website feature normally in Firefox.";
      return;
    }

    title.textContent = "🔖 Save 3Dudes1Life for Quick Access";
    lead.textContent = "Your browser did not expose an automatic app-add option.";
    setSteps([
      "Open your browser’s main menu.",
      "Look for <strong>Add to Home Screen</strong>, <strong>Add to Dock</strong>, <strong>Install</strong>, or <strong>Create shortcut</strong>.",
      "If no app option appears, bookmark this page."
    ]);
    status.textContent = "The exact wording depends on your operating system and browser version.";
  }

  function openInstallSheet() {
    createUI();
    setInstallContent();
    const sheet = document.querySelector("#pwaInstallSheet");
    if (!sheet) return;
    sheet.classList.add("is-visible");
    sheet.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeInstallSheet() {
    const sheet = document.querySelector("#pwaInstallSheet");
    if (!sheet) return;
    sheet.classList.remove("is-visible");
    sheet.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  async function runNativeInstall() {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    setInstallContent();
  }

  function showUpdateToast(registration) {
    const toast = document.querySelector("#pwaUpdateToast");
    if (!toast) return;
    toast._registration = registration;
    toast.classList.add("is-visible");
  }

  function hideUpdateToast() {
    document.querySelector("#pwaUpdateToast")?.classList.remove("is-visible");
  }

  function applyUpdate() {
    const toast = document.querySelector("#pwaUpdateToast");
    const registration = toast?._registration;
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    } else {
      window.location.reload();
    }
  }

  function updateNetworkState() {
    document.body.classList.toggle("is-offline", !navigator.onLine);
  }

  async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    try {
      const registration = await navigator.serviceWorker.register("/service-worker.js", {
        updateViaCache: "none"
      });

      if (registration.waiting && navigator.serviceWorker.controller) {
        showUpdateToast(registration);
      }

      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            showUpdateToast(registration);
          }
        });
      });

      setInterval(() => registration.update(), 60 * 60 * 1000);
    } catch (error) {
      console.warn("PWA registration failed:", error);
    }
  }

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    setInstallContent();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    closeInstallSheet();
  });

  navigator.serviceWorker?.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  window.addEventListener("online", updateNetworkState);
  window.addEventListener("offline", updateNetworkState);
  window.openInstallModal = openInstallSheet;
  window.closeInstallModal = closeInstallSheet;

  document.addEventListener("DOMContentLoaded", () => {
    createUI();
    updateNetworkState();
    setInstallContent();
    registerServiceWorker();
  });
})();
