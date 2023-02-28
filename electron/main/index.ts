import { app, BrowserWindow, BrowserView, shell, ipcMain } from "electron";
import { release } from "node:os";
import { join } from "node:path";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
let browserViews: BrowserView[] = [];
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");
const tabsHtml = join(process.env.DIST, "tabsView.html");

async function createTabs(win: BrowserWindow, url: string) {
  const tabsView = new BrowserView({
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: false,
    },
  });
  tabsView.setBackgroundColor("#0A95FF");

  console.log("Tabs link to load ", tabsHtml);
  tabsView.webContents.loadFile(tabsHtml);
  tabsView.webContents.openDevTools();
  win.addBrowserView(tabsView);

  tabsView.webContents.on("did-finish-load", () => {
    console.log("Tabs Finished load");

    tabsView.setBounds({
      x: 0,
      y: 0,
      width: win.getBounds().width - 200,
      height: 100,
    });
    return Promise.resolve();
  });
}
async function createBrowserViews(win: BrowserWindow, url: string) {
  const views: BrowserView[] = [];

  const promises = Array.from({ length: 4 }).map((_, i) => {
    console.log("Creating browserViews");
    const view = new BrowserView({
      webPreferences: {
        preload,
        // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
        // Consider using contextBridge.exposeInMainWorld
        // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
        nodeIntegration: true,
        contextIsolation: false,
        webviewTag: false,
      },
    });
    view.setBackgroundColor("#275D2B");
    win.addBrowserView(view);
    views.push(view);

    const promise = new Promise<void>((resolve) => {
      view.webContents.on("did-finish-load", () => {
        console.log("browserViews ", i, " finsihed load");
        const bounds = {
          x: i % 2 === 0 ? 0 : 520,
          y: i < 2 ? 200 : 570,
          width: 500,
          height: 350,
        };
        view.setBounds(bounds);
        resolve();
      });

      if (process.env.VITE_DEV_SERVER_URL) {
        // electron-vite-vue#298
        console.log("Dev browserViews", process.env.VITE_DEV_SERVER_URL);
        view.webContents.loadURL(url);
        // Open devTool if the app is not packaged
        view.webContents.openDevTools();
      } else {
        console.log("Dist browserViews");
        view.webContents.loadFile(indexHtml);
      }
    });
    
    return promise;
  });
  promises.push(createTabs(win, tabsHtml))

  await Promise.all(promises);

  console.log("All views loaded", url);
  win.show();

  browserViews = views;
}

async function createWindow() {
  win = new BrowserWindow({
    width: 1100,
    height: 800,
    title: "Main window",
    icon: join(process.env.PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: false,
    },
    show: false,
  });

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
  // win.webContents.on('will-navigate', (event, url) => { }) #344

  createBrowserViews(win, url);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
