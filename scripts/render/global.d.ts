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
    path_to:string

}

declare global {
    interface Window {
        __API__: {
            closeWindow: () => void
            resizeWindow: () => void
            wrapWindow: () => void,
            getAllSpaces: ()=>Promise<ISpace[]>,
            getSettings: ()=>Promise<ISettings>,
            getSpace: (name: string) => Promise<ISpace>,
            getSpacePath:()=>Promise<[boolean, string]>,
            makeSpace: (name: string, path: string)=>Promise<ISpace[]>,
            updateSettings: (settings: ISettings)=>void,
            getMusicMeta: (path:string)=>Promise<any[]>,
            getPlaylistImage: ()=>Promise<[boolean, string]>,
            getExtendedMeta: (path: string)=>Promise<ExtendedMeta[]>,
            saveMeta: (meta: ExtendedMeta) => Promise<boolean>
        }
    }
}

declare module 'node-id3' {
    export interface Tags {
        title?: string;
        artist?: string;
        album?: string;
        year?: string;
        comment?: { language?: string; shortText?: string } | string;
        trackNumber?: string;
        partOfSet?: string;
        composer?: string;
        image?: string | Buffer | { mime: string; type: { id: number; name: string }; description?: string; imageBuffer: Buffer };
        // ... добавьте нужные поля
    }
    export function read(filePath: string): Tags | null;
    export function write(tags: Tags, filePath: string, callback?: (error?: Error) => void): void;
    export function update(tags: Tags, filePath: string, callback?: (error?: Error) => void): void;
}