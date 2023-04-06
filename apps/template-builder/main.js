const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({width: 1200, height: 800});
    win.loadFile('dist/apps/template-builder/index.html');
}

app.whenReady().then(() => {
    createWindow()
})