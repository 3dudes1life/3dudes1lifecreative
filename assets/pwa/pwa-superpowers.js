
(() => {
  "use strict";

  let deferredInstallPrompt = null;
  let refreshing = false;

  const ua = navigator.userAgent || "";
  const isIOS = /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
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
          <button class="pwa-install-sheet__install" type="button" data-pwa-native-install hidden>Install App</button>
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

  function setInstallContent() {
    const lead = document.querySelector("[data-pwa-lead]");
    const steps = document.querySelector("[data-pwa-steps]");
    const status = document.querySelector("[data-pwa-status]");
    const nativeButton = document.querySelector("[data-pwa-native-install]");
    if (!lead || !steps || !status || !nativeButton) return;

    nativeButton.hidden = true;
    steps.innerHTML = "";

    if (isStandalone) {
      lead.textContent = "You already have the app experience open.";
      status.textContent = "You’re all set — this version runs full screen from your Home Screen.";
      steps.innerHTML = "<li>Keep this icon on your Home Screen for one-tap access.</li>";
      return;
    }

    if (deferredInstallPrompt) {
      lead.textContent = "Your browser can install 3Dudes1Life as an app right now.";
      status.textContent = "It opens in its own window and keeps essential pages available offline.";
      steps.innerHTML = "<li>Tap Install App below.</li><li>Confirm the browser prompt.</li>";
      nativeButton.hidden = false;
      return;
    }

    if (isIOS) {
      lead.textContent = "On iPhone or iPad, install directly from Safari.";
      status.innerHTML = "Look for the Share icon — the square with the upward arrow.";
      steps.innerHTML =
        "<li>Open this page in Safari.</li>" +
        "<li>Tap the Share button in the Safari toolbar.</li>" +
        "<li>Scroll and choose <strong>Add to Home Screen</strong>.</li>" +
        "<li>Tap <strong>Add</strong>.</li>";
      return;
    }

    if (isAndroid) {
      lead.textContent = "Add 3Dudes1Life from your browser menu.";
      status.textContent = "Chrome may also show an Install App button automatically.";
      steps.innerHTML =
        "<li>Tap the browser menu (⋮).</li>" +
        "<li>Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>" +
        "<li>Confirm the installation.</li>";
      return;
    }

    lead.textContent = "Install 3Dudes1Life from your desktop browser.";
    status.textContent = "Chrome and Edge usually show an install icon at the right side of the address bar.";
    steps.innerHTML =
      "<li>Look for the install icon in the address bar.</li>" +
      "<li>Or open the browser menu and choose <strong>Install 3Dudes1Life</strong>.</li>" +
      "<li>Confirm the installation.</li>";
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
