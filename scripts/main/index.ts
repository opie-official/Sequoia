import {BrowserWindow, IpcMainInvokeEvent, ipcMain, screen, app, nativeImage, dialog, IpcMainEvent} from "electron"
import * as fs from "fs"
import * as path from "path"
import * as utils from "./utils"
import * as spaces from "./spaces"
import {CHECK, UTILS} from "./utils";
import getAllSpaces = UTILS.getAllSpaces;
import {parseFiles, readMetaMP3, ExtendedMeta, saveMetaMP3} from "./metadata";

let __window_maximized__ = false;

let win: BrowserWindow;
let startWindow: BrowserWindow;


/**
 *
 */
namespace FABRICS {


    /**
     *
     */
    export function createWindow() {
        const Screen = screen.getPrimaryDisplay();
        const {width, height} = Screen.workAreaSize;
        win = new BrowserWindow({
            width: width,
            height: height,
            frame: false,
            show: false,
            title: "Sequoia",
            minWidth: width / 2,
            minHeight: height / 2,
            icon: nativeImage.createFromPath(path.join(__dirname, "../../assets/images/sequoia_icon.png")),
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, 'preload.js'),
                devTools: true
            }
        })

        win.loadFile(path.join(__dirname, "../..", "index.html")).then();

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
            title: "Sequoia",
            icon: nativeImage.createFromPath(path.join(__dirname, "../../assets/images/sequoia_icon.png")),
            frame: false,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: true,
            }
        })
        startWindow.loadFile(path.join(__dirname, "../../start_page.html")).then();
        startWindow.on('ready-to-show', () => {
            startWindow.show();
        });
    }
}
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
ipcMain.handle("system:all_spaces", () => {
    return utils.UTILS.getAllSpaces()
});
ipcMain.handle("system:settings", () => {
    const res = utils.UTILS.getSettings()
    return res


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
ipcMain.on("system:settings_update", (e: IpcMainEvent, settings: utils.UTILS.ISettings) => {
    utils.UTILS.saveSettings(settings);
});
ipcMain.handle("system:music_meta", async (e: IpcMainInvokeEvent, path_: string) => {
    return parseFiles(path_);
});

ipcMain.handle("system:playlist_image", async () => {
    const res = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{
            name: "Изображения",
            extensions: ["png", "jpeg", "svg", "gif", "jpg"],
        }]
    });
    if (res.canceled) {
        return [false, ""]
    }
    const file = res.filePaths[0];
    const ext = path.extname(file).substring(1).toLowerCase();
    let data: string = "";
    let base: string;
    if (ext === "svg") {
        data = fs.readFileSync(file, "utf8");
        base = Buffer.from(data).toString("base64");
    } else {
        base = fs.readFileSync(file).toString("base64");

    }

    const result = `data:image/${ext};base64,${base}`;
    return [true, result];
})


ipcMain.handle("system:meta", (e: IpcMainInvokeEvent, path: string) => {
    return readMetaMP3(path);
})

ipcMain.handle("system:save_meta", (e: IpcMainInvokeEvent, meta: ExtendedMeta) => {
    return saveMetaMP3(meta);
})

/**
 *
 */
app.whenReady().then(() => {
    CHECK.startCheck();
    const ffmpeg_res = CHECK.checkFFMPEG();

    FABRICS.createStartWindow();
    FABRICS.createWindow();

    if (!ffmpeg_res) {
        dialog.showMessageBox(win, {
            "message": "У вас не установлен FFMPEG. Вы не сможете редактировать теги аудио-файлов",
            type: "warning"
        })
    }
    startWindow.once('ready-to-show', () => {
        startWindow.show();

        setTimeout(() => {
            startWindow.close();
        }, 2300);
    });


    startWindow.on("closed", () => {
        win.show();

    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});