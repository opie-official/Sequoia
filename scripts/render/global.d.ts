export {}
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

declare global {
    interface Window {
        __API__: {
            closeWindow: () => void
            resizeWindow: () => void
            wrapWindow: () => void,
            getPage: (page:string) => Promise<[boolean, string]>,
            getAllSpaces: ()=>Promise<ISpace[]>,
            getSettings: ()=>Promise<ISettings>,
            getSpace: (name: string) => Promise<ISpace>,
            getSpacePath:()=>Promise<[boolean, string]>,
            makeSpace: (name: string, path: string)=>Promise<ISpace[]>,
            updateSettings: (settings: ISettings)=>void,
            getMusicMeta: (path:string)=>Promise<any[]>
        }
    }
}