import {contextBridge, ipcRenderer} from "electron"
import {UTILS} from "./utils"
import {ExtendedMeta} from "./metadata"


contextBridge.exposeInMainWorld("__API__", {
    closeWindow: () => {
        ipcRenderer.send("system:close");
    },
    resizeWindow: () => {
        ipcRenderer.send("system:resize");
    },
    wrapWindow: () => {
        ipcRenderer.send("system:wrap")
    },
    getAllSpaces: async () => await ipcRenderer.invoke("system:all_spaces"),
    getSettings: async () => await ipcRenderer.invoke("system:settings"),
    updateSettings: (settings: UTILS.ISettings) => ipcRenderer.send("system:settings_update", settings),
    getSpace: async (name: string) => await ipcRenderer.invoke("system:space", name),
    getSpacePath: async () => await ipcRenderer.invoke("system:space_path"),
    makeSpace: async (name: string, path: string) => await ipcRenderer.invoke("system:space_make", name, path),
    getMusicMeta: async (path: string) => await ipcRenderer.invoke("system:music_meta", path),
    getPlaylistImage: async () => await ipcRenderer.invoke("system:playlist_image"),
    getExtendedMeta: async (path: string) => await ipcRenderer.invoke("system:meta", path),
    saveMeta: async (meta: ExtendedMeta) => await ipcRenderer.invoke("system:save_meta", meta)
    ,
    getTheme: async () => await ipcRenderer.invoke("display:get_theme")
    ,
    getThemes: async () => await ipcRenderer.invoke("display:get_themes")
    ,
    returnAddress: (fn: any) => ipcRenderer.on("system:server", fn),
    createServer: async () => await ipcRenderer.invoke("system:create_server")
})