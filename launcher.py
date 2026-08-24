import os
import sys
import socket
import threading
import mimetypes
import time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import webbrowser

# Determine base path (for both standalone script and PyInstaller bundle)
if getattr(sys, 'frozen', False):
    BASE_DIR = getattr(sys, '_MEIPASS', os.path.dirname(sys.executable))
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Dedicated persistent user data directory
STORAGE_DIR = os.path.join(os.environ.get('LOCALAPPDATA', os.path.expanduser('~')), 'ZijeossiGame')
os.makedirs(STORAGE_DIR, exist_ok=True)
SAVE_FILE_PATH = os.path.join(STORAGE_DIR, 'savegame.json')
PATCH_DIR = os.path.join(STORAGE_DIR, 'patch')
os.makedirs(PATCH_DIR, exist_ok=True)
PATCHED_GAME_JS = os.path.join(PATCH_DIR, 'game.js')

# Ensure correct MIME types
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('text/html', '.html')
mimetypes.add_type('video/mp4', '.mp4')
mimetypes.add_type('image/x-icon', '.ico')
mimetypes.add_type('image/png', '.png')
mimetypes.add_type('image/svg+xml', '.svg')

import re

def get_js_version(filepath):
    try:
        if not os.path.exists(filepath):
            return None
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            head = f.read(1000)
            m = re.search(r'CURRENT_CLIENT_VERSION\s*=\s*[\'"]([^\'"]+)[\'"]', head)
            if m:
                return [int(x) for x in m.group(1).split('.') if x.isdigit()]
    except Exception:
        pass
    return None

def is_patch_newer(base_path, patch_path):
    if not os.path.exists(patch_path) or os.path.getsize(patch_path) < 1000:
        return False
    if not os.path.exists(base_path):
        return True
    base_ver = get_js_version(base_path) or [0, 0, 0]
    patch_ver = get_js_version(patch_path) or [0, 0, 0]
    for b, p in zip(base_ver, patch_ver):
        if p > b:
            return True
        if p < b:
            return False
    return len(patch_ver) > len(base_ver)

class GameHTTPRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def translate_path(self, path):
        # Override game.js with persistent patch ONLY if patch version is strictly newer than base game.js
        clean_path = path.split('?', 1)[0].split('#', 1)[0]
        if (clean_path == '/game.js' or clean_path.endswith('/game.js')) and os.path.exists(PATCHED_GAME_JS):
            base_game_js = os.path.join(BASE_DIR, 'game.js')
            if is_patch_newer(base_game_js, PATCHED_GAME_JS):
                return PATCHED_GAME_JS
            else:
                try: os.remove(PATCHED_GAME_JS)
                except Exception: pass
                if os.path.exists(base_game_js):
                    return base_game_js
        return super().translate_path(path)

    def log_message(self, format, *args):
        pass

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def get_server_port():
    for p in [28490, 28491, 28492, 28493, 28494]:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('127.0.0.1', p))
                return p
        except OSError:
            continue
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]

def start_server(port):
    server = ThreadingHTTPServer(('127.0.0.1', port), GameHTTPRequestHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server

class GameAPI:
    def __init__(self, save_path):
        self.save_path = save_path
        self._window = None
        self._is_fullscreen = False

    def sync_patch_file(self, patch_code):
        try:
            with open(PATCHED_GAME_JS, 'w', encoding='utf-8') as f:
                f.write(patch_code)
            return True
        except Exception as e:
            return False

    def save_file_data(self, data_str):
        try:
            with open(self.save_path, 'w', encoding='utf-8') as f:
                f.write(data_str)
            return True
        except Exception as e:
            return False

    def load_file_data(self):
        try:
            if os.path.exists(self.save_path):
                with open(self.save_path, 'r', encoding='utf-8') as f:
                    return f.read()
        except Exception:
            pass
        return None

    def quit_game(self):
        try:
            import webview
            for w in webview.windows:
                w.destroy()
        except Exception:
            pass
        return True

    def toggle_fullscreen(self):
        try:
            if self._window is not None:
                self._is_fullscreen = not self._is_fullscreen
                self._window.toggle_fullscreen()
                return self._is_fullscreen
        except Exception:
            pass
        return False

def main():
    port = get_server_port()
    server = start_server(port)
    game_url = f"http://127.0.0.1:{port}/index.html"

    api = GameAPI(SAVE_FILE_PATH)

    try:
        import webview
        icon_path = os.path.join(BASE_DIR, 'icon.ico')
        if not os.path.exists(icon_path):
            icon_path = None

        window = webview.create_window(
            title='지저씨 : 각성했지만 게으르고 싶어',
            url=game_url,
            js_api=api,
            width=1600,
            height=900,
            min_size=(1024, 576),
            resizable=True,
            fullscreen=False,
            background_color='#171717'
        )
        api._window = window

        def on_closed():
            try:
                server.shutdown()
                server.server_close()
            except Exception:
                pass

        window.events.closed += on_closed
        webview.start(storage_path=STORAGE_DIR, debug=False, private_mode=False)

    except Exception as e:
        print(f"WebView initialization fallback: {e}")
        webbrowser.open(game_url)
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            pass
    finally:
        try:
            server.shutdown()
            server.server_close()
        except Exception:
            pass
        # Brief pause to let WebView2 child processes release file handles in temp dir
        time.sleep(0.35)

if __name__ == '__main__':
    main()
