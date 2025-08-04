import {contextBridge, ipcRenderer} from "electron"

interface IPlaylist {
    name: string,
    icon: string,
    songs: string[],
}
interface Theme {
    name: string,
    styles:{
        bg:{
            color: string,
            hover: string
        },
        aside:{
            color: string,
            hover: string
        },
        footer:{
            color: string,
            hover: string,
            button: string
        },
        text:{
            font: string,
            title: string,
            subtitle: string
        },
        buttons:{
            bg: string,
            hover: string,
            active: string,
            aside_bt:string,
            aside_bt_hover: string
        }
    }
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
    current_space: number,
    theme: string
}
interface ExtendedMeta {
    name: string,
    filename: string,
    description: string,
    icon: string,
    album: string,
    artist: string,
    executor: string,
    composer: string,
    genre: string,
    year: string,
    number: string,
    disk_number: string,
    filepath: string,
    path_to:string

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
    }
})