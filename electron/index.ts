// electron-main/index.ts
import { app, BrowserWindow } from 'electron';
import path from 'path';

const createWindow = () => {
    const win = new BrowserWindow({
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#222225',
            symbolColor: '#ADAFB2FF'
        },
        height: 690,
        width: 1041,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, './preload.js'),
        },
    });

    if (app.isPackaged) {
        win.loadFile(path.join(__dirname, '../index.html'));
    } else {
        // Use ['ENV_NAME'] avoid vite:define plugin
        const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`;

        win.loadURL(url);
    }
    win.webContents.openDevTools()
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    // 如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()。
    if (process.platform !== 'darwin') {
        app.quit();
    }
});