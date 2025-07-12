import {contextBridge, ipcRenderer} from "electron"

interface IPlaylist {
    name: string,
    icon: string,
    songs: string[],
}

interface ISpace {
    name: string,
    path: string,
    playlists: IPlaylist[]
}

interface ISettings {
    doctype: string,
    version: string,
    spaces: ISpace[],
    current_space: number
}

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
    // getPage: async (page: string): Promise<[boolean, string]> => {
    //     return await ipcRenderer.invoke("display:page", page);
    // },
    getAllSpaces: async (): Promise<ISpace[]> => {
        return await ipcRenderer.invoke("system:all_spaces");
    },
    getSettings: async (): Promise<ISettings> => {
        return await ipcRenderer.invoke("system:settings")
    },
    updateSettings: (settings: ISettings) => {
        ipcRenderer.send("system:settings_update", settings)
    },
    getSpace: async (name: string): Promise<ISpace> => {
        return await ipcRenderer.invoke("system:space", name);
    },
    getSpacePath: async (): Promise<[boolean, string]> => {
        return await ipcRenderer.invoke("system:space_path");
    },
    makeSpace: async (name: string, path: string): Promise<ISpace[]> => {
        return await ipcRenderer.invoke("system:space_make", name, path);
    },
    getMusicMeta: async (path: string) => {
        return await ipcRenderer.invoke("system:music_meta", path);
    }
})