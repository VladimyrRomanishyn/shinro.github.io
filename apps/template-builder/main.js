const { app, BrowserWindow, dialog } = require('electron');

function createWindow() {
    const win = new BrowserWindow({width: 1400, height: 800});
    win.loadFile('dist/apps/template-builder/index.html');
    
    win.webContents.session.on('will-download', async(_, item) => {
      if (item.getFilename() === 'dumb.txt') {
        item.cancel();
        const { filePaths } = await dialog.showOpenDialog({properties: ['openDirectory']})
        const setPathLocalStorage = 'localStorage.setItem("downloadPath","' + filePaths[0] + '")'
        await win.webContents.executeJavaScript(setPathLocalStorage);
        return;
      }
      
      const downloadPath = await win.webContents.executeJavaScript('localStorage.getItem("downloadPath")');
      
      if (!downloadPath) {
        item.cancel();
        return;
      }
      
      item.setSavePath(downloadPath + '/' + item.getFilename());
    })
}

app.whenReady().then(() => {
    createWindow()
})