#!/usr/bin/env python3
from pathlib import Path
import shutil, sys, re

ROOT = Path(__file__).resolve().parents[1]
BACKUPS = ROOT / ".zip1-backups"
VERSION = "20260714-zip1-fixed"

SKIP_DIRS = {".git", ".zip1-backups", "node_modules", "vendor"}

def rel_asset_prefix(path: Path) -> str:
    depth = len(path.relative_to(ROOT).parents) - 1
    return "../" * depth

def should_skip(path: Path) -> bool:
    return any(part in SKIP_DIRS for part in path.parts)

html_files = sorted(p for p in ROOT.rglob("*.html") if not should_skip(p))
if not html_files:
    print("No HTML files found.")
    sys.exit(1)

changed, already, skipped = [], [], []
for path in html_files:
    text = path.read_text(encoding="utf-8")
    if "app-shell.css" in text and "app-shell.js" in text:
        already.append(str(path.relative_to(ROOT)))
        continue
    if "</head>" not in text.lower() or "</body>" not in text.lower():
        skipped.append(str(path.relative_to(ROOT)))
        continue

    relative = path.relative_to(ROOT)
    backup = BACKUPS / relative
    backup.parent.mkdir(parents=True, exist_ok=True)
    if not backup.exists():
        shutil.copy2(path, backup)

    prefix = rel_asset_prefix(path)
    css = f'  <link rel="stylesheet" href="{prefix}assets/app-shell/app-shell.css?v={VERSION}">\n'
    js = f'  <script defer src="{prefix}assets/app-shell/app-shell.js?v={VERSION}"></script>\n'

    text = re.sub(r"</head>", css + "</head>", text, count=1, flags=re.I)
    text = re.sub(r"</body>", js + "</body>", text, count=1, flags=re.I)
    path.write_text(text, encoding="utf-8")
    changed.append(str(relative))

print(f"ZIP 1: {len(changed)} page(s) patched; {len(already)} already active; {len(skipped)} skipped.")
for item in changed: print("PATCHED:", item)
for item in already: print("ACTIVE:", item)
for item in skipped: print("SKIPPED:", item)

if skipped:
    sys.exit(2)
