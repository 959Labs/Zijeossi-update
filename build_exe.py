import os
import subprocess
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, 'dist')
DIST_EXE = os.path.join(DIST_DIR, 'Zijeossi.exe')

print('=== Starting Zijeossi Executable Build ===')
cmd = [
    'python', '-m', 'PyInstaller',
    '--onefile',
    '--windowed',
    '--icon=icon.ico',
    '--name=Zijeossi',
    '--add-data=index.html;.',
    '--add-data=style.css;.',
    '--add-data=i18n.js;.',
    '--add-data=data;data',
    '--add-data=renderers;renderers',
    '--add-data=systems;systems',
    '--add-data=entities;entities',
    '--add-data=game.js;.',
    '--add-data=engine.js;.',
    '--add-data=audio.js;.',
    '--add-data=version.json;.',
    '--add-data=icon.ico;.',
    '--add-data=logo_959.png;.',
    '--noconfirm',
    'launcher.py'
]

subprocess.run(cmd, cwd=BASE_DIR, check=True)

if os.path.exists(DIST_EXE):
    for name in ['Zijeossi.exe', '지저씨.exe']:
        target = os.path.join(BASE_DIR, name)
        try:
            shutil.copyfile(DIST_EXE, target)
            print(f'Updated {name} successfully!')
        except Exception as e:
            print(f'Warning: Could not update {name} ({e})')

# Clean any stale patch cache in AppData
try:
    storage_dir = os.path.join(os.environ.get('LOCALAPPDATA', os.path.expanduser('~')), 'ZijeossiGame')
    stale_patch = os.path.join(storage_dir, 'patch', 'game.js')
    if os.path.exists(stale_patch):
        os.remove(stale_patch)
        print('Cleaned stale patch cache in LocalAppData.')
except Exception:
    pass

print('=== Build & Synchronization Complete ===')
