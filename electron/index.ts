// electron-main/index.ts
const { app, BrowserWindow, ipcMain } = require('electron');
import path from 'path';

class Main {
    win: typeof BrowserWindow
    constructor() {
        this.init();
    }
    init() {
        this.onProcess()
    }
    createWindow() {
        const win = this.win = new BrowserWindow({
            // titleBarStyle: 'hidden',
            // titleBarOverlay: {
            //     color: '#222225',
            //     symbolColor: '#ADAFB2FF'
            // },
            minHeight: 690,
            minWidth: 1041,
            height: 750,
            width: 1100,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, './preload.js'),
            },
            frame: false,
        });
        if (app.isPackaged) {
            win.loadFile(path.join(__dirname, '../index.html'));
        } else {
            // Use ['ENV_NAME'] avoid vite:define plugin
            const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`;

            win.loadURL(url);
        }
        this.ipcWindowEvent()
        win.webContents.openDevTools()
    }
    onProcess() {
        app.whenReady().then(() => {
            this.createWindow();
            app.on('activate', () => {
                // On macOS it's common to re-create a window in the app when the
                // dock icon is clicked and there are no other windows open.
                if (BrowserWindow.getAllWindows().length === 0) {
                    this.createWindow()
                }
            });
        });
        app.on('window-all-closed', () => {
            // 如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()。
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });
    }
    ipcWindowEvent() {
        ipcMain.on('maximize', (event: any) => {
            this.win.maximize()
        })
        ipcMain.on('unmaximize', (event: any) => {
            this.win.unmaximize()
        })
        ipcMain.on('minimize', (event: any) => {
            this.win.minimize()
        })
        ipcMain.on('restore', (event: any) => {
            this.win.restore()
        })
        ipcMain.on('close', (event: any) => {
            this.win.close()
        })
    }
}

const main = new Main();

