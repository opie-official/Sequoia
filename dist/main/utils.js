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
exports.CHECK = exports.UTILS = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("node:path"));
var UTILS;
(function (UTILS) {
    /**
     * Reads a settings.json file and parse it into ISettings object
     */
    function getSettings() {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "../../preferences/settings.json"), "utf-8"));
    }
    UTILS.getSettings = getSettings;
    /**
     * Creates a new space
     * @param name a name of new space
     * @param path a path to dir of new space
     */
    function createSpace(name, path) {
        const space = {
            name,
            path,
            playlists: []
        };
        const settings = getSettings();
        settings.spaces.push(space);
        saveSettings(settings);
    }
    UTILS.createSpace = createSpace;
    /**
     * Save settings to settings.json file
     * @param settings a settings object
     */
    function saveSettings(settings) {
        fs.writeFileSync(path.join(__dirname, "../../preferences/settings.json"), JSON.stringify(settings));
    }
    UTILS.saveSettings = saveSettings;
    /**
     * get all space from settings.json
     */
    function getAllSpaces() {
        const settings = getSettings();
        return settings.spaces;
    }
    UTILS.getAllSpaces = getAllSpaces;
})(UTILS || (exports.UTILS = UTILS = {}));
var CHECK;
(function (CHECK) {
    /**
     * Checks files for integrity
     */
    function startCheck() {
        const settings = checkSettings();
        if (!settings) {
            const sets = {
                doctype: "opie/seq",
                version: "",
                spaces: [],
                current_space: -1,
                theme: "dark",
                show_start_page: true
            };
            fs.writeFileSync(path.join(__dirname, "../../preferences/settings.json"), JSON.stringify(sets));
        }
    }
    CHECK.startCheck = startCheck;
    /**
     * Check settings.json for integrity
     * @private
     */
    function checkSettings() {
        return fs.existsSync(path.join(__dirname, "../../preferences/settings.json"));
    }
    /**
     * Check FFMPEG for availability
     */
    function checkFFMPEG() {
        const path_env = process.env.Path || process.env.PATH;
        const dirs = path_env.split(path.delimiter);
        for (const dir of dirs) {
            const full_path = path.join(dir, "ffmpeg" + (process.platform === "win32" ? ".exe" : ""));
            if (fs.existsSync(full_path)) {
                return true;
            }
        }
        return false;
    }
    CHECK.checkFFMPEG = checkFFMPEG;
})(CHECK || (exports.CHECK = CHECK = {}));
