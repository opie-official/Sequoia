import {BrowserWindow, IpcMainInvokeEvent, ipcMain, screen, app} from "electron"
import * as fs from "fs"
import * as path from "path"
import * as utils from "./utils"
import * as spaces from "./spaces"
import {UTILS} from "./utils";
import getAllSpaces = UTILS.getAllSpaces;
import {parseFiles} from "./metadata";

let __window_maximized__ = false;

let win: BrowserWindow;
let startWindow: BrowserWindow;

/**
 *
 */
namespace HANDLERS {

    /**
     *
     * @param e
     * @param page
     */
    export async function returnPage(e: IpcMainInvokeEvent, page: string) {
        try {
            const text = fs.readFileSync(path.join(__dirname, `../../assets/pages/${page}`), "utf8");
            return [true, text]
        } catch (e) {
            return [false, e]
        }
    }
}
/**
 *
 */
namespace GLOBAL {

    export function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


}
/**
 *
 */
namespace FABRICS {

    /**
     *
     */
    export async function createWindow() {

        ipcMain.on("system:close", () => {
            const win_ = BrowserWindow.getFocusedWindow();
            if (win_) {
                win_.close();
            }
        });
        ipcMain.on("system:resize", () => {
            const win_ = BrowserWindow.getFocusedWindow();
            if (win_) {
                if (__window_maximized__) {
                    win_.unmaximize();
                    __window_maximized__ = false;
                } else {
                    win_.maximize();
                    __window_maximized__ = true;
                }
            }
        });
        ipcMain.on("system:wrap", () => {
            const win_ = BrowserWindow.getFocusedWindow();
            if (win_) {
                win_.minimize();
            }
        })

        const Screen = screen.getPrimaryDisplay();
        const {width, height} = Screen.workAreaSize;
        win = new BrowserWindow({
            width: width,
            height: height,
            frame: false,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, 'preload.js'),
            }
        })

        await win.loadFile(path.join(__dirname, "../..", "index.html"));

    }

    /**
     *
     */
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

/**
 *
 */
app.whenReady().then(async () => {
    ipcMain.handle("display:page", HANDLERS.returnPage);
    ipcMain.handle("system:all_spaces", () => {
        return utils.UTILS.getAllSpaces()
    });
    ipcMain.handle("system:settings", () => {
        return utils.UTILS.getSettings()
    });
    ipcMain.handle("system:space", (e: IpcMainInvokeEvent, name: string) => {
        const spaces = getAllSpaces();
        return spaces.filter((elem) => {
            return elem.name === name
        })[0]
    });
    ipcMain.handle("system:space_path", async () => {
        return await spaces.getDirectoryOfSpace();
    });
    ipcMain.handle("system:space_make", (e: IpcMainInvokeEvent, name: string, path: string) => {
        utils.UTILS.createSpace(name, path)
        return utils.UTILS.getAllSpaces()
    });

    ipcMain.on("system:settings_update", (e: IpcMainInvokeEvent, settings: utils.UTILS.ISettings) => {
        utils.UTILS.saveSettings(settings);
    });


    ipcMain.handle("system:music_meta", async (e: IpcMainInvokeEvent, path_: string) => {
        const res = parseFiles(path_);
        // console.log(await res)
        return res
    });


    FABRICS.createStartWindow();
    await FABRICS.createWindow();

    await GLOBAL.delay(2300).then();

    startWindow.on('closed', async () => {
        win.show();
    });
    startWindow.close();
});


app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});