#!/usr/bin/env python3
from pathlib import Path
import shutil, sys, re

HERE=Path(__file__).resolve().parent
TARGET=HERE
if not (TARGET/'index.html').exists():
    print('\nZIP 1 patcher must be placed in the ROOT of the downloaded 3dudes1lifecreative repository.')
    print('Expected to find index.html beside this file.\n')
    sys.exit(1)

asset_src=HERE/'assets'/'app-shell'
asset_dst=TARGET/'assets'/'app-shell'
asset_dst.mkdir(parents=True,exist_ok=True)
for name in ('app-shell.css','app-shell.js'):
    src=asset_src/name
    dst=asset_dst/name
    if src.resolve()!=dst.resolve():
        shutil.copy2(src,dst)

html_files=[p for p in TARGET.rglob('*.html') if '.zip1-backup' not in p.parts]
changed=[]
for path in html_files:
    text=path.read_text(encoding='utf-8')
    if 'assets/app-shell/app-shell.css' in text:
        continue
    rel='assets/app-shell/' if path.parent==TARGET else '../assets/app-shell/'
    backup=path.with_suffix(path.suffix+'.zip1-backup')
    if not backup.exists(): shutil.copy2(path,backup)
    css=f'  <link rel="stylesheet" href="{rel}app-shell.css?v=20260714-zip1">\n'
    js=f'  <script defer src="{rel}app-shell.js?v=20260714-zip1"></script>\n'
    if '</head>' not in text or '</body>' not in text:
        print(f'SKIPPED (missing head/body): {path.relative_to(TARGET)}')
        continue
    text=text.replace('</head>',css+'</head>',1)
    text=text.replace('</body>',js+'</body>',1)
    path.write_text(text,encoding='utf-8')
    changed.append(str(path.relative_to(TARGET)))

print('\nZIP 1 installed successfully.')
print(f'Updated {len(changed)} HTML pages and created .zip1-backup copies.')
for item in changed: print('  • '+item)
print('\nOpen index.html locally or upload the changed HTML files plus assets/app-shell to GitHub.')
