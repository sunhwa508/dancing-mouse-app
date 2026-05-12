const { app, BrowserWindow, screen, Menu, Tray, nativeImage } = require('electron');
const path = require('node:path');

let mainWindow = null;
let tray = null;
let keyListener = null;

const isDev = !app.isPackaged;
const DEV_URL = 'http://localhost:5173/?overlay=1';

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const { width: sw, height: sh } = display.workAreaSize;
  const w = 300;
  const h = 400;

  mainWindow = new BrowserWindow({
    width: w,
    height: h,
    x: sw - w - 40,
    y: sh - h - 40,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    resizable: false,
    skipTaskbar: true,
    focusable: true,
    backgroundColor: '#00000000',
    title: 'Dancing Mouse',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  if (isDev) {
    mainWindow.loadURL(DEV_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'), {
      search: 'overlay=1',
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startGlobalKeyListener() {
  try {
    const { GlobalKeyboardListener } = require('node-global-key-listener');
    keyListener = new GlobalKeyboardListener();
    let keyCount = 0;
    keyListener.addListener((event) => {
      if (event.state !== 'DOWN') return;
      const name = event.name || '';
      if (name.startsWith('MOUSE')) return;
      keyCount += 1;
      if (keyCount <= 5 || keyCount % 25 === 0) {
        console.log(`[dancing-mouse] key #${keyCount}: ${name}`);
      }
      if (!mainWindow || mainWindow.isDestroyed()) return;
      mainWindow.webContents.send('global-keystroke', {
        name,
        vKey: event.vKey,
      });
    });
    console.log('[dancing-mouse] global key listener started — try typing now');
  } catch (err) {
    console.error('[dancing-mouse] global key listener failed:', err.message);
    console.error(
      '  on macOS you may need to grant Accessibility permission in System Settings → Privacy & Security → Accessibility.',
    );
  }
}

function createTray() {
  const iconPath = path.join(__dirname, 'tray-icon.png');
  let icon = nativeImage.createFromPath(iconPath);
  if (icon.isEmpty()) {
    icon = nativeImage.createEmpty();
  }
  tray = new Tray(icon);
  tray.setToolTip('Dancing Mouse');
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Show window',
        click: () => mainWindow && mainWindow.show(),
      },
      {
        label: 'Hide window',
        click: () => mainWindow && mainWindow.hide(),
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => app.quit(),
      },
    ]),
  );
}

app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    app.dock.hide();
  }
  createWindow();
  startGlobalKeyListener();
  try {
    createTray();
  } catch (err) {
    console.warn('[dancing-mouse] tray init skipped:', err.message);
  }
  app.on('activate', () => {
    if (!mainWindow) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (keyListener && typeof keyListener.kill === 'function') {
    try {
      keyListener.kill();
    } catch {
      // ignore
    }
  }
});
