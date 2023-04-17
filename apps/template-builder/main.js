const { app, BrowserWindow, dialog } = require('electron');

function createWindow() {
    const win = new BrowserWindow({width: 1400, height: 800});
    win.loadFile('dist/apps/template-builder/index.html');
    let path;
    
    win.webContents.session.on('will-download', async(_, item) => {
      if (item.getFilename() === 'dumb.txt') {
        item.cancel();
        const { filePaths } = await dialog.showOpenDialog({properties: ['openDirectory']})
        const setPathLocalStorage = 'localStorage.setItem("downloadPath","' + filePaths[0] + '")'
        path = filePaths[0] ? filePaths[0]: '';
        await win.webContents.executeJavaScript(setPathLocalStorage);
        return;
      }
            
      if (!path) {
        item.cancel();
        return;
      }
      
      item.setSavePath(path + '/' + item.getFilename());
    })
  }

app.whenReady().then(() => {
    createWindow()
})