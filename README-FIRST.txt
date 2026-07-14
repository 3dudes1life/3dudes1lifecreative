3DUDES1LIFE CREATIVE — ZIP 1, GITHUB-FIXED EDITION
==================================================

THIS VERSION FIXES THE MISSING HAMBURGER.

WHAT WENT WRONG BEFORE
The previous ZIP uploaded the CSS, JavaScript, and Mac installer, but GitHub does
not run Mac/Python installers automatically. The HTML pages never received the
CSS/JS references, so the visual changes that came from uploaded CSS could appear,
but the JavaScript-created hamburger could not.

WHAT THIS VERSION DOES
This package includes a GitHub Actions workflow that runs INSIDE GITHUB. After
upload, GitHub patches every current HTML page, verifies the hamburger code and
shared shell references, creates backups, and commits the finished pages.

UPLOAD INSTRUCTIONS
1. Unzip this package.
2. Upload/merge ALL folders into the ROOT of:
   3dudes1life/3dudes1lifecreative
   Important: include the hidden .github folder.
3. Commit the upload.
4. Open the repository's Actions tab.
5. Open "Apply ZIP 1 App Header."
6. The workflow should start automatically. If it does not, click "Run workflow."
7. Wait for the green check, then allow GitHub Pages to redeploy.
8. Close and reopen Safari. For the Home Screen app, swipe it away and relaunch.

VERIFIED FEATURES IN THIS BUILD
[PASS] Premium sticky app-style header
[PASS] Logo | Latest Episode | hamburger
[PASS] Clean mobile and desktop hamburger menu
[PASS] iPhone safe-area/status-bar support
[PASS] Proper 44px+ mobile touch targets
[PASS] Shorter homepage hero without deleting content
[PASS] Shared header treatment for every HTML page
[PASS] Automatic GitHub installer
[PASS] Automatic Mac installer
[PASS] Automatic per-page backups in .zip1-backups
[PASS] GitHub and Mac rollback scripts
[PASS] Detailed testing checklist
[PASS] Fallback header for pages such as links.html that had no old .site-nav
[PASS] Escape key, outside-tap closing, and focus return

MAC INSTALLER
The GitHub workflow is recommended. A Mac installer is still included:
  double-click APPLY-ZIP1.command
It runs the same patcher and verification locally.

ROLLBACK
GitHub:
  Actions > Roll Back ZIP 1 > Run workflow

Mac:
  double-click ROLLBACK-ZIP1.command

IMPORTANT
Do not upload only assets/app-shell. Upload the .github and tools folders too.
The GitHub workflow is what connects the app shell to every HTML page.
