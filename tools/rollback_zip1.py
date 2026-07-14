#!/usr/bin/env python3
from pathlib import Path
import shutil, sys

ROOT = Path(__file__).resolve().parents[1]
BACKUPS = ROOT / ".zip1-backups"
if not BACKUPS.exists():
    print("No ZIP 1 backups found.")
    sys.exit(1)

count = 0
for backup in sorted(BACKUPS.rglob("*.html")):
    relative = backup.relative_to(BACKUPS)
    destination = ROOT / relative
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(backup, destination)
    count += 1

print(f"Restored {count} HTML page(s) from .zip1-backups.")
