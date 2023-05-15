const os = require('os')
const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    platform: os.platform(),
    electron: () => process,
    maximize: () => ipcRenderer.send('maximize'),
    unmaximize: () => ipcRenderer.send('unmaximize'),
    minimize: () => ipcRenderer.send('minimize'),
    restore: () => ipcRenderer.send('restore'),
    close: () => ipcRenderer.send('close'),
    reset: () => ipcRenderer.send('reset'),
});

// 这里导出是为了解决这个ts错误
// 'preload.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file. Add an import, export, or an empty 'export {}' statement to make it a module.
export {}
