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
    current_space: number,
    theme: string,
    show_start_page: boolean
}

export interface ExtendedMeta {
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
    path_to: string

}

declare global {
    interface Window {
        // __API__: {
        //     closeWindow: () => void
        //     resizeWindow: () => void
        //     wrapWindow: () => void,
        //     getAllSpaces: () => Promise<ISpace[]>,
        //     getSettings: () => Promise<ISettings>,
        //     getSpace: (name: string) => Promise<ISpace>,
        //     getSpacePath: () => Promise<[boolean, string]>,
        //     makeSpace: (name: string, path: string) => Promise<ISpace[]>,
        //     updateSettings: (settings: ISettings) => void,
        //     getMusicMeta: (path: string) => Promise<any[]>,
        //     getPlaylistImage: () => Promise<[boolean, string]>,
        //     getExtendedMeta: (path: string) => Promise<ExtendedMeta[]>,
        //     saveMeta: (meta: ExtendedMeta) => Promise<boolean>,
        //     getTheme: ()=>Promise<[boolean, string]>,
        //     getThemes: ()=>Promise<[boolean, string[]]>,
        //     returnAddress: (fn:any)=>any
        // }
        __API__: API
    }
}
