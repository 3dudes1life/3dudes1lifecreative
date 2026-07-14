#!/usr/bin/env python3
from pathlib import Path
import shutil
ROOT=Path(__file__).resolve().parent
count=0
for backup in ROOT.rglob('*.html.zip1-backup'):
    original=Path(str(backup).replace('.zip1-backup',''))
    shutil.copy2(backup,original)
    backup.unlink()
    count+=1
shell=ROOT/'assets'/'app-shell'
if shell.exists(): shutil.rmtree(shell)
print(f'ZIP 1 rolled back. Restored {count} HTML pages.')
