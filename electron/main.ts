import { app, BrowserWindow, Menu, Tray } from "electron";
import path from "node:path";

process.env.DIST = path.join(__dirname, "../dist");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");
const iconPath = path.join(process.env.PUBLIC, "electron-original.png");
console.log(iconPath);

let win: BrowserWindow | null;
let tray: Tray | null;

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

function createWindow() {
  win = new BrowserWindow({
    width: 300,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      backgroundThrottling: false,
    },
  });

  tray = new Tray(iconPath);

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }

  tray.on("click", function () {
    toggleWindow();
  });
}

app.on("window-all-closed", () => {
  win = null;
});

app.whenReady().then(createWindow);

const toggleWindow = () => {
  if (win?.isVisible()) {
    win.hide();
  } else {
    showWindow();
  }
};

const showWindow = () => {
  const position = getWindowPosition();
  win?.setPosition(position.x, position.y, false);
  win?.show();
  win?.focus();
};

const getWindowPosition = () => {
  const windowBounds = win?.getBounds();
  const trayBounds = tray?.getBounds();

  if (!trayBounds || !windowBounds) {
    return { x: 0, y: 0 };
  }

  // 中央に配置
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );
  const y = Math.round(trayBounds.y + trayBounds.height);

  return { x: x, y: y };
};
