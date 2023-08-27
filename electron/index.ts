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
    createWindow() {
        const win = this.win = new BrowserWindow({
            // titleBarStyle: 'hidden',
            // titleBarOverlay: {
            //     color: '#222225',
            //     symbolColor: '#ADAFB2FF'
            // },
            minHeight: 750,
            minWidth: 1150,
            height: 750,
            width: 1150,
            webPreferences: {
                nodeIntegration: true, // 为了解决required识别问题
                // // 需要设置contextIsolation属性为false。
                // // 但是使用某些api，比如拖拽开发功能的contextBridge需要contextIsolation为true。
                contextIsolation: false,
                enableRemoteModule: true,
                preload: path.join(__dirname, './preload.js'),
            },
            frame: false,
            icon: path.join(__dirname, '../src/assets/logo.ico'),
        });
        if (app.isPackaged) {
            win.loadFile(path.join(__dirname, '../index.html'));
            // win.loadURL(`file://${__dirname}/index.html`);
        } else {
            // Use ['ENV_NAME'] avoid vite:define plugin
            const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`;
            win.loadURL(url);
        }
        this.ipcWindowEvent()
        // win.webContents.openDevTools()
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
        ipcMain.on('reset', (event: any) => {
            app.exit();//退出当前程序
            app.relaunch();//重新启动
        })
    }
}

const main = new Main();


