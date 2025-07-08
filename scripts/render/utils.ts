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

interface Meta {
    name: string,
    artist: string,
    album: string,
    duration: number,
    path: string,
    pictures: string,
}
