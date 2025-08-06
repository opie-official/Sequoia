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
    getAllSpaces: async () => {
        return await ipcRenderer.invoke("system:all_spaces");
    },
    getSettings: async () => {
        return await ipcRenderer.invoke("system:settings")
    },
    updateSettings: (settings: UTILS.ISettings) => {
        ipcRenderer.send("system:settings_update", settings)
    },
    getSpace: async (name: string) => {
        return await ipcRenderer.invoke("system:space", name);
    },
    getSpacePath: async () => {
        return await ipcRenderer.invoke("system:space_path");
    },
    makeSpace: async (name: string, path: string) => {
        return await ipcRenderer.invoke("system:space_make", name, path);
    },
    getMusicMeta: async (path: string) => {
        return await ipcRenderer.invoke("system:music_meta", path);
    },
    getPlaylistImage: async ()=>{
        return await ipcRenderer.invoke("system:playlist_image");
    },
    getExtendedMeta: async(path: string)=>{
        return await ipcRenderer.invoke("system:meta", path);
    },
    saveMeta: async (meta: ExtendedMeta)=>{
        return await ipcRenderer.invoke("system:save_meta", meta)
    },
    getTheme: async ()=>{
        return await ipcRenderer.invoke("display:get_theme");
    },
    getThemes: async()=>{
        return await ipcRenderer.invoke("display:get_themes");
    }
})