3DUDES1LIFE CREATIVE — ZIP 1
APP HEADER + MOBILE NAVIGATION SHELL

WHAT THIS PACKAGE DOES
• Replaces the crowded legacy navigation visually with a premium sticky app header.
• Layout: logo | Latest Episode action | hamburger.
• Gives every existing HTML page the same navigation shell.
• Adds iPhone safe-area/status-bar support.
• Adds a polished slide-down menu, background scrim, Escape-key support, focus handling, and 44px+ touch targets.
• Shortens the HOME PAGE hero without deleting any content.
• Keeps all current sections, links, travel pages, RSS episode logic, install modal, newsletter, manifest, service worker, images, and analytics intact.
• Includes automatic backups and rollback.

THIS IS DELIBERATELY NOT ZIP 2 OR ZIP 3
• It does not rearrange the homepage dashboard/content yet.
• It does not install bottom navigation yet.
• It does not perform the full SEO/schema/PWA overhaul yet.
• Existing SEO is preserved while this shell is tested.

FASTEST MAC INSTALL
1. Download your 3dudes1lifecreative repository from GitHub as a ZIP and unzip it.
2. Copy EVERYTHING from this ZIP 1 folder into the root of that downloaded repository.
3. Double-click APPLY-ZIP1.command.
4. macOS may ask permission to run it. If blocked: right-click it, choose Open, then Open again.
5. Test index.html and several files inside /connections/.
6. Upload all changed HTML files and the new /assets/app-shell/ folder to GitHub.

MANUAL INSTALL
Run this from Terminal while inside the repository root:
  python3 APPLY-ZIP1.py

TEST CHECKLIST
□ Desktop Safari/Chrome: header stays fixed, logo is clear, menu opens and closes.
□ iPhone Safari: no wrapped nav links; header respects the top safe area.
□ Home Screen/PWA: header reaches the status-bar region and does not cover content.
□ Hamburger links reach Podcast, Latest Episode, Books, Adventures, Blog, and Contact.
□ Alaska, Maui, Big Island, Costa Rica, California, and Road Trip pages use the same shell.
□ Escape closes the menu on desktop.
□ Tapping outside the menu closes it.
□ Existing latest-episode feed still loads.
□ Existing newsletter and app-install modals still work.

ROLLBACK
Run:
  python3 ROLLBACK-ZIP1.py
The installer creates a .zip1-backup copy beside every changed HTML file.

FILES ADDED
/assets/app-shell/app-shell.css
/assets/app-shell/app-shell.js
APPLY-ZIP1.py
APPLY-ZIP1.command
ROLLBACK-ZIP1.py
README-FIRST.txt

VERSION
ZIP 1 — 2026-07-14
