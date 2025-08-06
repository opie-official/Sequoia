"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const utils = __importStar(require("./utils"));
const spaces = __importStar(require("./spaces"));
const utils_1 = require("./utils");
var getAllSpaces = utils_1.UTILS.getAllSpaces;
const metadata_1 = require("./metadata");
const themes_1 = require("./themes");
var getSettings = utils_1.UTILS.getSettings;
let __window_maximized__ = false;
let win;
let startWindow;
var FABRICS;
(function (FABRICS) {
    /**
     * Creates a main window
     */
    function createWindow() {
        const Screen = electron_1.screen.getPrimaryDisplay();
        const { width, height } = Screen.workAreaSize;
        win = new electron_1.BrowserWindow({
            width: width,
            height: height,
            frame: false,
            show: false,
            title: "Sequoia",
            minWidth: width / 2,
            minHeight: height / 2,
            icon: electron_1.nativeImage.createFromPath(path.join(__dirname, "../../assets/images/sequoia_icon.png")),
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, 'preload.js'),
                devTools: true
            }
        });
        win.loadFile(path.join(__dirname, "../..", "index.html")).then();
    }
    FABRICS.createWindow = createWindow;
    /**
     * Creates a start window
     */
    function createStartWindow() {
        const Screen = electron_1.screen.getPrimaryDisplay();
        const { width, height } = Screen.workAreaSize;
        startWindow = new electron_1.BrowserWindow({
            width: width / 1.5,
            height: height / 1.5,
            title: "Sequoia",
            icon: electron_1.nativeImage.createFromPath(path.join(__dirname, "../../assets/images/sequoia_icon.png")),
            frame: false,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: true,
            }
        });
        startWindow.loadFile(path.join(__dirname, "../../start_page.html")).then();
        startWindow.on('ready-to-show', () => {
            startWindow.show();
        });
    }
    FABRICS.createStartWindow = createStartWindow;
})(FABRICS || (FABRICS = {}));
electron_1.ipcMain.on("system:close", () => {
    const win_ = electron_1.BrowserWindow.getFocusedWindow();
    if (win_) {
        win_.close();
    }
});
electron_1.ipcMain.on("system:resize", () => {
    const win_ = electron_1.BrowserWindow.getFocusedWindow();
    if (win_) {
        if (__window_maximized__) {
            win_.unmaximize();
            __window_maximized__ = false;
        }
        else {
            win_.maximize();
            __window_maximized__ = true;
        }
    }
});
electron_1.ipcMain.on("system:wrap", () => {
    const win_ = electron_1.BrowserWindow.getFocusedWindow();
    if (win_) {
        win_.minimize();
    }
});
electron_1.ipcMain.on("system:settings_update", (_, settings) => {
    utils.UTILS.saveSettings(settings);
});
electron_1.ipcMain.handle("system:all_spaces", () => {
    return utils.UTILS.getAllSpaces();
});
electron_1.ipcMain.handle("system:settings", () => {
    const res = utils.UTILS.getSettings();
    return res;
});
electron_1.ipcMain.handle("system:space", (_, name) => {
    const spaces = getAllSpaces();
    return spaces.filter((elem) => {
        return elem.name === name;
    })[0];
});
electron_1.ipcMain.handle("system:space_path", async () => {
    return await spaces.getDirectoryOfSpace();
});
electron_1.ipcMain.handle("system:space_make", (_, name, path) => {
    utils.UTILS.createSpace(name, path);
    return utils.UTILS.getAllSpaces();
});
electron_1.ipcMain.handle("system:music_meta", async (_, path_) => {
    return (0, metadata_1.parseFiles)(path_);
});
electron_1.ipcMain.handle("system:playlist_image", async () => {
    const res = await electron_1.dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{
                name: "Изображения",
                extensions: ["png", "jpeg", "svg", "gif", "jpg"],
            }]
    });
    if (res.canceled) {
        return [false, ""];
    }
    const file = res.filePaths[0];
    const ext = path.extname(file).substring(1).toLowerCase();
    let data = "";
    let base;
    if (ext === "svg") {
        data = fs.readFileSync(file, "utf8");
        base = Buffer.from(data).toString("base64");
    }
    else {
        base = fs.readFileSync(file).toString("base64");
    }
    const result = `data:image/${ext};base64,${base}`;
    return [true, result];
});
electron_1.ipcMain.handle("system:meta", (_, path) => {
    return (0, metadata_1.readMetaMP3)(path);
});
electron_1.ipcMain.handle("system:save_meta", (_, meta) => {
    return (0, metadata_1.saveMetaMP3)(meta);
});
electron_1.ipcMain.handle("display:get_theme", themes_1.importTheme);
electron_1.ipcMain.handle("display:get_themes", themes_1.getThemes);
electron_1.app.whenReady().then(() => {
    utils_1.CHECK.startCheck();
    const ffmpeg_res = utils_1.CHECK.checkFFMPEG();
    const settings = getSettings();
    if (settings.show_start_page) {
        FABRICS.createStartWindow();
        FABRICS.createWindow();
        startWindow.once('ready-to-show', () => {
            startWindow.show();
            setTimeout(() => {
                startWindow.close();
            }, 2300);
        });
        startWindow.on("closed", () => {
            win.show();
        });
    }
    else {
        FABRICS.createWindow();
        win.once("ready-to-show", () => {
            win.show();
        });
    }
    if (!ffmpeg_res) {
        electron_1.dialog.showMessageBox(win, {
            "message": "У вас не установлен FFMPEG. Вы не сможете редактировать теги аудио-файлов",
            type: "warning"
        }).then();
    }
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
