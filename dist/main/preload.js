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
    getAllSpaces: async () => await electron_1.ipcRenderer.invoke("system:all_spaces"),
    getSettings: async () => await electron_1.ipcRenderer.invoke("system:settings"),
    updateSettings: (settings) => electron_1.ipcRenderer.send("system:settings_update", settings),
    getSpace: async (name) => await electron_1.ipcRenderer.invoke("system:space", name),
    getSpacePath: async () => await electron_1.ipcRenderer.invoke("system:space_path"),
    makeSpace: async (name, path) => await electron_1.ipcRenderer.invoke("system:space_make", name, path),
    getMusicMeta: async (path) => await electron_1.ipcRenderer.invoke("system:music_meta", path),
    getPlaylistImage: async () => await electron_1.ipcRenderer.invoke("system:playlist_image"),
    getExtendedMeta: async (path) => await electron_1.ipcRenderer.invoke("system:meta", path),
    saveMeta: async (meta) => await electron_1.ipcRenderer.invoke("system:save_meta", meta),
    getTheme: async () => await electron_1.ipcRenderer.invoke("display:get_theme"),
    getThemes: async () => await electron_1.ipcRenderer.invoke("display:get_themes"),
    returnAddress: (fn) => electron_1.ipcRenderer.on("system:server", fn),
    createServer: async () => await electron_1.ipcRenderer.invoke("system:create_server")
});
