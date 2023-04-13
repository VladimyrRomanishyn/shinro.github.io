const { app, BrowserWindow, ipcMain, dialog } = require('electron');

function createWindow() {
    const win = new BrowserWindow({width: 1200, height: 800});
    win.loadFile('dist/apps/template-builder/index.html');
    let downloadPath;
    win.webContents.session.on('will-download', async(event, item, webContents) => {

        console.log('item', item);
        

        if (!downloadPath) {
            item.cancel();
            const {filePaths} = await dialog.showOpenDialog({properties: ['openDirectory']})
            downloadPath = filePaths[0];
            console.log('downloadPath', downloadPath);
            console.log(item.getURL());
            const options = {
                path: item.getURL(),
                urlChain: item.getURLChain(),
                mimeType: item.getMimeType(),
                offset: 0,
                length: item.getTotalBytes(),
                //eTag: item.getFilename()
              }
              console.log(options);
            //setTimeout(() => win.webContents.session.createInterruptedDownload(options));
        }
        
    
      item.setSavePath(downloadPath + '/' + item.getFilename());
    
      item.on('updated', async (event, state) => {
        if (state === 'interrupted') {
          console.log('Download is interrupted but can be resumed')
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            console.log('Download is paused')
          } else {
            console.log(`Received bytes: ${item.getReceivedBytes()}`)
            console.log(`FileName: ${item.getFilename()}`)
            console.log(`Mime Type: ${item.getMimeType()}`)
            console.log(`URL: ${item.getURL()}`)
            console.log(`Save Path: ${item.getSavePath()}`)
          }
        }
      })
      item.once('done', (event, state) => {
        if (state === 'completed') {
          console.log('Download successfully')
        } else {
          console.log(`Download failed: ${state}`)
        }
      })
    })
}

app.whenReady().then(() => {
    createWindow()
})