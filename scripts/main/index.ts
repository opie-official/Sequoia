import {BrowserWindow, IpcMainInvokeEvent, ipcMain, screen, app} from "electron"
import * as fs from "fs"
import * as path from "path"


let win: BrowserWindow;
let startWindow: BrowserWindow;


namespace GLOBAL {

    export function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}

namespace FABRICS {


    export async function createWindow() {
        const Screen = screen.getPrimaryDisplay();
        const {width, height} = Screen.workAreaSize;
        win = new BrowserWindow({
            width: width,
            height: height,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js'),
            }
        })
        console.log(path.join(__dirname, "../../index.html"))
        await win.loadFile("index.html");

    }

    export function createStartWindow() {
        const Screen = screen.getPrimaryDisplay();
        const {width, height} = Screen.workAreaSize;

        startWindow = new BrowserWindow({
            width: width / 1.5,
            height: height / 1.5,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: true,
            }
        })
        startWindow.loadFile(path.join(__dirname, "../../assets/pages/start_page.html")).then(() => {
            startWindow.show();

        }).catch(() => {
            console.log(`error: ${path.join(__dirname, "../../assets/pages/start_page.html")}`)
        });
        startWindow.show();

    }
}


app.whenReady().then(async () => {
    FABRICS.createStartWindow();
    await GLOBAL.delay(2300).then();
    startWindow.destroy();
    FABRICS.createWindow();
});


app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});