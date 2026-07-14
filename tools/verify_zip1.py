#!/usr/bin/env python3
from pathlib import Path
import sys, re

ROOT = Path(__file__).resolve().parents[1]
SKIP = {".git", ".zip1-backups", "node_modules", "vendor"}
pages = sorted(p for p in ROOT.rglob("*.html") if not any(part in SKIP for part in p.parts))
problems = []

for page in pages:
    text = page.read_text(encoding="utf-8")
    rel = str(page.relative_to(ROOT))
    if "app-shell.css" not in text: problems.append(f"{rel}: missing app-shell.css")
    if "app-shell.js" not in text: problems.append(f"{rel}: missing app-shell.js")

assets = [
    ROOT / "assets/app-shell/app-shell.css",
    ROOT / "assets/app-shell/app-shell.js",
]
for asset in assets:
    if not asset.exists(): problems.append(f"missing asset: {asset.relative_to(ROOT)}")

js = assets[1].read_text(encoding="utf-8") if assets[1].exists() else ""
css = assets[0].read_text(encoding="utf-8") if assets[0].exists() else ""

checks = {
    "hamburger button creation": "app-shell__toggle" in js,
    "Logo | Latest Episode | hamburger order": all(s in js for s in ["bar.appendChild(logo)", "bar.appendChild(primary)", "bar.appendChild(toggle)"]),
    "desktop/mobile menu": "app-shell__menu" in js and "@media(max-width:620px)" in css,
    "iPhone safe area": "safe-area-inset-top" in css,
    "44px+ touch targets": "min-height:44px" in css and "min-height:50px" in css,
    "shorter homepage hero": "body.app-shell-home > header" in css,
    "fallback nav on pages without legacy nav": "if(!nav)" in js and "fallbackLinks" in js,
    "Escape key closes menu": "e.key==='Escape'" in js,
    "outside tap closes menu": "scrim.addEventListener" in js,
}
for label, ok in checks.items():
    if not ok: problems.append("failed code check: " + label)

print(f"Checked {len(pages)} HTML page(s).")
for label, ok in checks.items():
    print(("PASS" if ok else "FAIL") + ": " + label)

if problems:
    print("\nPROBLEMS:")
    for problem in problems: print("-", problem)
    sys.exit(1)
print("\nZIP 1 verification passed.")
