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
const path = __importStar(require("path"));
let win;
let startWindow;
var GLOBAL;
(function (GLOBAL) {
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    GLOBAL.delay = delay;
})(GLOBAL || (GLOBAL = {}));
var FABRICS;
(function (FABRICS) {
    async function createWindow() {
        const Screen = electron_1.screen.getPrimaryDisplay();
        const { width, height } = Screen.workAreaSize;
        win = new electron_1.BrowserWindow({
            width: width,
            height: height,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js'),
            }
        });
        console.log(path.join(__dirname, "../../index.html"));
        await win.loadFile("index.html");
    }
    FABRICS.createWindow = createWindow;
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
electron_1.app.whenReady().then(async () => {
    FABRICS.createStartWindow();
    await GLOBAL.delay(2300).then();
    startWindow.destroy();
    FABRICS.createWindow();
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
