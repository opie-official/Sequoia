"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("__API__", {
    closeWindow: () => {
        electron_1.ipcRenderer.send("system:close");
    },
    resizeWindow: () => {
        electron_1.ipcRenderer.send("system:resize");
    },
    wrapWindow: () => {
        electron_1.ipcRenderer.send("system:wrap");
    },
    getAllSpaces: async () => {
        return await electron_1.ipcRenderer.invoke("system:all_spaces");
    },
    getSettings: async () => {
        return await electron_1.ipcRenderer.invoke("system:settings");
    },
    updateSettings: (settings) => {
        electron_1.ipcRenderer.send("system:settings_update", settings);
    },
    getSpace: async (name) => {
        return await electron_1.ipcRenderer.invoke("system:space", name);
    },
    getSpacePath: async () => {
        return await electron_1.ipcRenderer.invoke("system:space_path");
    },
    makeSpace: async (name, path) => {
        return await electron_1.ipcRenderer.invoke("system:space_make", name, path);
    },
    getMusicMeta: async (path) => {
        return await electron_1.ipcRenderer.invoke("system:music_meta", path);
    },
    getPlaylistImage: async () => {
        return await electron_1.ipcRenderer.invoke("system:playlist_image");
    },
    getExtendedMeta: async (path) => {
        return await electron_1.ipcRenderer.invoke("system:meta", path);
    },
    saveMeta: async (meta) => {
        return await electron_1.ipcRenderer.invoke("system:save_meta", meta);
    },
    getTheme: async () => {
        return await electron_1.ipcRenderer.invoke("display:get_theme");
    },
    getThemes: async () => {
        return await electron_1.ipcRenderer.invoke("display:get_themes");
    }
});
