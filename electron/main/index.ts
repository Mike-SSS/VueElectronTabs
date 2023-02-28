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
let tabsView: BrowserView | null = null;
let mainView: BrowserView | null = null;
let browserViews: BrowserView[] = [];
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");
const tabsHtml = join(process.env.DIST, "tabsView.html");

async function createTabs(win: BrowserWindow, url: string) {
  tabsView = new BrowserView({
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
  win.setTopBrowserView(tabsView);

  tabsView.webContents.send("add-tab", {
    title: "+",
    url: "add",
    id: tabsView.webContents.id,
  });

  tabsView.webContents.on("did-finish-load", () => {
    console.log("Tabs Finished load");

    tabsView.setBounds({
      x: 0,
      y: 0,
      width: win.getBounds().width,
      height: 50,
    });
    return Promise.resolve();
  });
}
async function createSingleBrowserView(win: BrowserWindow, url: string) {
  const newView = new BrowserView({
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
  browserViews.push(newView);
  win.addBrowserView(newView);
  newView.setBackgroundColor("#000");
  console.log("Single view", url);

  // win.setTopBrowserView(view);
  // win.setBr
  // views.push(view);
  // await new Promise(resolve => {
  newView.webContents.on("did-finish-load", () => {
    console.log("single window finsihed load", url);
    const bounds = {
      x: 0,
      y: 50, //tabs offset
      width: win.getBounds().width,
      height: win.getBounds().height - 50,
    };
    newView.setBounds(bounds);
    win.show();
    // resolve(0);
  });
  // });
  console.log("After did finish promise");

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    console.log("Single Dev browserViews", process.env.VITE_DEV_SERVER_URL);
    newView.webContents.loadURL(url);
    // Open devTool if the app is not packaged
    newView.webContents.openDevTools();
  } else {
    console.log("Single Dist browserViews");
    newView.webContents.loadFile(indexHtml);
    // tabsView.webContents.openDevTools();
  }
  // Send message to tabs view window to add a new tab
  const title = `Tabs`;
  if (tabsView) {
    tabsView.webContents.send("add-tab", {
      title,
      url: url,
      id: newView.webContents.id,
    });
  } else console.log("No tabs view to send new tab too");

  // win.setBrowserView(newView);
  if (mainView != null) {
    win.removeBrowserView(mainView);
  }

  if (mainView != null) {
    win.removeBrowserView(mainView);
  }

  mainView = newView;
  win.addBrowserView(mainView);
  mainView.webContents.reload();
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
  await createTabs(win, tabsHtml);

  // tabsView.
  // await createBrowserViews(win, url);

  await createSingleBrowserView(win, process.env.VITE_DEV_SERVER_URL);
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
ipcMain.on("switch-tab", (event, { title, id, url }) => {
  // console.log("switch tab", title, url);
  // Get the current active browser view
  // const activeView = browserViews[];
  const newView = browserViews.find((e) => e.webContents.id == id);
  console.log(
    "switch tab id: ",
    id,
    " title: ",
    title,
    " newView: ",
    newView,
    browserViews.map((e) => e.webContents.id)
  );
  // console.log("switch tab]==", win.getBrowserViews().);
  // Set the selected view as the active view
  if (undefined !== newView) {
    console.log(
      "Assign new view ",
      mainView.webContents.id,
      newView.webContents.id,
      url
    );
    if (mainView != null) {
      win.removeBrowserView(mainView);
    }
    mainView = newView;
    win.addBrowserView(mainView);
    mainView.setAutoResize({ width: true, height: true });
    mainView.setBounds({
      x: 0,
      y: 50,
      width: win.getBounds().width,
      height: win.getBounds().height - 50,
    });
    // mainView.webContents.reload();
    mainView.webContents.openDevTools();
    win.show();
    // mainView.webContents.deb();
    // win?.setBrowserView(mainView);
  }

  // }
});
// Add a listener to create a new browser view when a 'create-tab' message is received
ipcMain.on("create-tab", (event, { title, url }) => {
  if (url == "add") {
    url = process.env.VITE_DEV_SERVER_URL;
  }
  console.log("Create tab", url);
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
  view.webContents.loadURL(url);
  // win?.addBrowserView(view);
  browserViews.push(view);
  // win?.setBrowserView(view);
  view.setAutoResize({ width: true, height: true });
  view.setBounds({
    x: 0,
    y: 50,
    width: win.getBounds().width,
    height: win.getBounds().height - 50,
  });
  console.log("Create tab evetn ", title, url, view.webContents.id);
  // Send a message to the renderer process to add a new tab
  tabsView.webContents.send("add-tab", { title, url, id: view.webContents.id });
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
