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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const utils = __importStar(require("./utils"));
const spaces = __importStar(require("./spaces"));
const utils_1 = require("./utils");
var getAllSpaces = utils_1.UTILS.getAllSpaces;
const metadata_1 = require("./metadata");
let __window_maximized__ = false;
let win;
let startWindow;
/**
 *
 */
var HANDLERS;
(function (HANDLERS) {
    /**
     *
     * @param e
     * @param page
     */
    async function returnPage(e, page) {
        try {
            const text = fs.readFileSync(path.join(__dirname, `../../assets/pages/${page}`), "utf8");
            return [true, text];
        }
        catch (e) {
            return [false, e];
        }
    }
    HANDLERS.returnPage = returnPage;
})(HANDLERS || (HANDLERS = {}));
/**
 *
 */
var GLOBAL;
(function (GLOBAL) {
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    GLOBAL.delay = delay;
})(GLOBAL || (GLOBAL = {}));
/**
 *
 */
var FABRICS;
(function (FABRICS) {
    /**
     *
     */
    async function createWindow() {
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
        const Screen = electron_1.screen.getPrimaryDisplay();
        const { width, height } = Screen.workAreaSize;
        win = new electron_1.BrowserWindow({
            width: width,
            height: height,
            frame: false,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, 'preload.js'),
            }
        });
        await win.loadFile(path.join(__dirname, "../..", "index.html"));
    }
    FABRICS.createWindow = createWindow;
    /**
     *
     */
    function createStartWindow() {
        const Screen = electron_1.screen.getPrimaryDisplay();
        const { width, height } = Screen.workAreaSize;
        startWindow = new electron_1.BrowserWindow({
            width: width / 1.5,
            height: height / 1.5,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: true,
            }
        });
        startWindow.loadFile(path.join(__dirname, "../../assets/pages/start_page.html")).then(() => {
            startWindow.show();
        }).catch(() => {
            console.log(`error: ${path.join(__dirname, "../../assets/pages/start_page.html")}`);
        });
        startWindow.show();
    }
    FABRICS.createStartWindow = createStartWindow;
})(FABRICS || (FABRICS = {}));
/**
 *
 */
electron_1.app.whenReady().then(async () => {
    electron_1.ipcMain.handle("display:page", HANDLERS.returnPage);
    electron_1.ipcMain.handle("system:all_spaces", () => {
        return utils.UTILS.getAllSpaces();
    });
    electron_1.ipcMain.handle("system:settings", () => {
        return utils.UTILS.getSettings();
    });
    electron_1.ipcMain.handle("system:space", (e, name) => {
        const spaces = getAllSpaces();
        return spaces.filter((elem) => {
            return elem.name === name;
        })[0];
    });
    electron_1.ipcMain.handle("system:space_path", async () => {
        return await spaces.getDirectoryOfSpace();
    });
    electron_1.ipcMain.handle("system:space_make", (e, name, path) => {
        utils.UTILS.createSpace(name, path);
        return utils.UTILS.getAllSpaces();
    });
    electron_1.ipcMain.on("system:settings_update", (e, settings) => {
        utils.UTILS.saveSettings(settings);
    });
    electron_1.ipcMain.handle("system:music_meta", async (e, path_) => {
        const res = (0, metadata_1.parseFiles)(path_);
        // console.log(await res)
        return res;
    });
    FABRICS.createStartWindow();
    await FABRICS.createWindow();
    await GLOBAL.delay(2300).then();
    startWindow.on('closed', async () => {
        win.show();
    });
    startWindow.close();
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
