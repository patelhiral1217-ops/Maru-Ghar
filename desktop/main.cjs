const path = require('node:path');
const { app, BrowserWindow, shell } = require('electron');

const SITE_URL = 'https://maru-ghar-gandhinagar-8dbe4.web.app/';
const isHttpUrl = url => url.startsWith('https://') || url.startsWith('http://');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 360,
    minHeight: 620,
    show: false,
    autoHideMenuBar: true,
    icon: path.join(app.getAppPath(), 'icon.ico'),
    backgroundColor: '#12382f',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isHttpUrl(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(SITE_URL)) {
      event.preventDefault();
      if (isHttpUrl(url)) shell.openExternal(url);
    }
  });
  win.once('ready-to-show', () => win.show());
  win.loadURL(SITE_URL);
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
