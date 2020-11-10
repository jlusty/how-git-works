const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  const mode = process.env.NODE_ENV;
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(`file://${path.join(__dirname, "../public/index.html")}`);
  mainWindow.on("closed", () => {
    mainWindow = null;
    if (watcher) {
      watcher.close();
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

let watcher;
if (process.env.NODE_ENV === "development") {
  watcher = require("chokidar").watch(path.join(__dirname, "../public/build"), {
    ignoreInitial: true,
  });
  watcher.on("change", () => {
    mainWindow.reload();
  });
}

// Open a file with dialog
ipcMain.on("open-file", (event, arg) => {
  const { dialog } = require("electron");
  dialog.showOpenDialog({ properties: ["openFile"] }).then(
    (dialogFinished) => event.reply("file-opened", dialogFinished.filePaths[0]) // TODO: Only getting first item from array of paths here
  );
});

// Open a folder with dialog
ipcMain.on("open-folder", (event, arg) => {
  const { dialog } = require("electron");
  dialog.showOpenDialog({ properties: ["openDirectory"] }).then(
    (dialogFinished) =>
      event.reply("folder-opened", dialogFinished.filePaths[0]) // TODO: Only getting first item from array of paths here
  );
});
