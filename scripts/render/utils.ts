/**
 * @interface IPlaylist
 * Interface of playlist
 *
 * @param name - a name of playlist
 * @param icon - a path to icon of playlist
 * @param songs - names of songs of playlist
 */
interface IPlaylist {
    name: string,
    icon: string,
    songs: string[],
}

/**
 * @interface ISpace
 * Interface of space
 * @param name a name of space
 * @param path a path to dir of space
 * @param playlists a playlists of this space
 */
interface ISpace {
    name: string,
    path: string,
    playlists: IPlaylist[]
}

/**
 * @interface ISettings
 * Interface of app settings
 * @param doctype
 * @param version {string} a version of app
 * @param space a list of spaces
 * @param current_space a current space index
 */
interface ISettings {
    doctype: string,
    version: string,
    spaces: ISpace[],
    current_space: number
}

/**
 * @interface Meta
 * Interface of audio
 *
 */
interface Meta {
    name: string,
    artist: string,
    album: string,
    duration: number,
    path: string,
    pictures: string,
}


/**
 *
 */
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
    path_to: string
}

/**
 * @interface API
 * Interface of IPC-API
 */
interface API {
    closeWindow: () => void
    resizeWindow: () => void
    wrapWindow: () => void,
    getAllSpaces: () => Promise<ISpace[]>,
    getSettings: () => Promise<ISettings>,
    getSpace: (name: string) => Promise<ISpace>,
    getSpacePath: () => Promise<[boolean, string]>,
    makeSpace: (name: string, path: string) => Promise<ISpace[]>,
    updateSettings: (settings: ISettings) => void,
    getMusicMeta: (path: string) => Promise<any[]>,
    getPlaylistImage: () => Promise<[boolean, string]>,
    getExtendedMeta: (path: string) => Promise<ExtendedMeta[]>,
    saveMeta: (meta: ExtendedMeta) => void

}

/**
 * @class MainManager
 * A class of app manager that responsible for keep settings and api and their update
 */
class MainManager {
    readonly api: API;
    readonly settings: ISettings;
    readonly root: HTMLDivElement;
    public all_audio: Meta[] = []; // audio from space
    public playlist_audio: Meta[] = []; // audio from playlist from current space;

    public new_playlist_audio: Meta[] = []
    public new_playlist_image: string = "";

    public current_playlist_index = 0;
    public current_audio_index = 0;
    public paused = false;
    public looped = false;
    public randomed = false;
    public is_playlist_edit = false;

    public current_audio_for_edit = -1;
    public current_audio_for_edit_name = "";
    public current_audio_for_edit_path = "";
    public current_audio_for_edit_path_to = "";

    constructor(api: API, settings: ISettings, root: HTMLDivElement) {
        this.api = api;
        this.settings = settings;
        this.root = root;
    }

    /**
     * Change a visible page
     * @param id an id of needed page
     */
    setupPage(id: string) {
        for (const i of this.root.children) {
            if (i.id === id) {
                i.classList.add("enabled");
                i.classList.remove("disabled");
            } else {
                i.classList.add("disabled");
                i.classList.remove("enabled");
            }
        }
    }

    /**
     * update this.playlist_audio by loading in it Meta objects
     */
    setCurrentPlaylist() {
        if (this.all_audio) {
            const current = this.settings.spaces[this.settings.current_space].playlists[this.current_playlist_index];
            if (current.name === "__global__") {
                this.playlist_audio = this.all_audio;
                return;
            }
            // console.log("non __global__")
            const names = current.songs;
            // console.log(names);
            this.playlist_audio = [];
            for (const i of this.all_audio) {
                // console.log(`${names.includes(i.name)} :: ${i.name}`)
                if (names.includes(i.name)) {
                    this.playlist_audio.push(i);
                }
            }
            // console.log(`playlist_audio: ${this.playlist_audio}`)
        } else {
        }            // console.log("error: all_audio is null")
    }

    /**
     * unused now
     */
    getCurrentPlaylist() {
        return this.settings.spaces[this.settings.current_space].playlists[this.current_playlist_index]
    }

    /**
     * get all playlist of current space
     */
    getPlaylists() {
        return this.settings.spaces[this.settings.current_space].playlists

    }

    /**
     * get current space object
     */
    getCurrentSpace() {
        return this.settings.spaces[this.settings.current_space];
    }

    /**
     * increments a this.current_audio_index and, if it greats or equals to playlist length, set to 0
     */
    saveAudioIncrement() {
        this.current_audio_index++;
        if (this.current_audio_index >= this.playlist_audio.length) {
            this.current_audio_index = 0;
        }
    }

    /**
     * decrements a this.current_audio_index and, if it less than 0, set to playlists length -1
     */
    saveAudioDecrement() {
        this.current_audio_index--;
        if (this.current_audio_index < 0) {
            this.current_audio_index = this.playlist_audio.length - 1;
        }
    }

    /**
     * save settings to file
     */
    saveSettings() {
        this.api.updateSettings(this.settings);
    }

    /**
     * save a new created playlist
     * @param playlist
     */
    appendAndSavePlaylist(playlist: IPlaylist) {
        manager.settings.spaces[manager.settings.current_space].playlists.push(playlist);
        this.saveSettings();
    }


    deletePlaylist() {
        const current_playlist = this.getCurrentPlaylist();
        const new_list: IPlaylist[] = []
        for (const i of this.getPlaylists()) {
            if (i.name !== current_playlist.name) {
                new_list.push(i);
            }
        }
        this.settings.spaces[this.settings.current_space].playlists = new_list;
        manager.current_playlist_index = 0;

        this.saveSettings();
    }

}

/**
 * @class UpdateManager
 * a class that responsible to updating parts of interface
 */
class UpdateManager {

    /**
     *
     * @param id
     */
    static removeChildren(id: string) {
        try {
            const div = document.getElementById(id) as HTMLElement;
            while (div.firstChild) {
                div.removeChild(div.firstChild);
            }
        } catch {
        }
    }

    /**
     *
     */
    static updateMain() {
        this.updateMain_Playlists();
        this.updateMain_Songs();
        this.updateMain_Messages();
    }

    /**
     *
     */
    static updateMain_Songs() {
        const songs_div = document.getElementById("main-songs") as HTMLDivElement;
        this.removeChildren("main-songs");
        if (manager.settings.current_space === -1) {
            return;
        }
        manager.setCurrentPlaylist();
        const audio_div = document.getElementById("main-audio") as HTMLAudioElement;
        for (let i = 0; i < manager.playlist_audio.length; i++) {
            const index = i;
            const audio = manager.playlist_audio[index];
            const result = audioFabric(index, audio);
            result.addEventListener("click", async () => {
                manager.current_audio_index = index;
                const current_audio = manager.playlist_audio[i];
                audio_div.pause();
                audio_div.src = current_audio.path;
                await audio_div.play();

                for (const j of songs_div.children) {
                    j.classList.remove("toggled");
                }
                result.classList.add("toggled");
                manager.paused = false;
                const bt = document.getElementById("main-pause") as HTMLButtonElement;
                const img = bt.querySelector("img") as HTMLImageElement;
                img.src = "assets/images/play.svg";
                showCurrentAudio();

            });
            songs_div.append(result);
        }
    }

    /**
     *
     */
    static updateMain_Playlists() {
        const playlists_div = document.getElementById("main-aside-playlists") as HTMLDivElement;
        this.removeChildren(playlists_div.id);
        if (manager.settings.current_space === -1) {
            return;
        }
        const playlists = manager.getPlaylists();
        for (let i = 0; i < playlists.length; i++) {
            const index = i;
            const result = playlistOnMainFabric(playlists[i]);

            if (index === manager.current_playlist_index) {
                result.classList.add("toggled-playlist");
            }

            result.addEventListener("click", async () => {
                manager.current_playlist_index = index;
                manager.setCurrentPlaylist();
                for (const j of playlists_div.children) {
                    j.classList.remove("toggled-playlist");
                }
                result.classList.add("toggled-playlist");
                this.updateMain_Songs();


            });
            playlists_div.append(result);
        }

    }

    /**
     *
     */
    static updateMain_Messages() {
        const p = document.getElementById("main-spaces-name") as HTMLParagraphElement;
        const list = document.getElementById("main-songs") as HTMLDivElement;
        if (manager.settings.current_space !== -1) {
            const space = manager.getCurrentSpace();
            p.textContent = space.name;

        } else {
            p.textContent = "";
            list.append(document.createTextNode("В текущем пространстве нет ни одной песни"));
        }


    }

    /**
     *
     */
    static updateSpaces() {
        const spaces_div = document.getElementById("space-list") as HTMLDivElement;
        this.removeChildren(spaces_div.id);

        const spaces = manager.settings.spaces;
        for (let i = 0; i < spaces.length; i++) {
            const index = i;
            const result = spaceFabric(i, spaces[i]);
            result.addEventListener("click", async () => {
                await select(index);
            });
            spaces_div.append(result);
        }
    }


    /**
     *
     */
    static updatePlaylists() {
        const img2 = document.getElementById("playlists-img2") as HTMLImageElement;
        img2.src = "";


        const playlist_div = document.getElementById("playlists-right") as HTMLDivElement;
        manager.new_playlist_audio = [];
        this.removeChildren(playlist_div.id);
        const audio = manager.all_audio;
        if (!audio) {
            playlist_div.appendChild(document.createTextNode("В текущем пространстве нет ни одной песни"))
            return;

        }
        for (let i = 0; i < audio.length; i++) {
            const result = playlistsAudioFabric(i, audio[i]);
            const checkbox = result.querySelector("input[type='checkbox']") as HTMLInputElement;
            checkbox.addEventListener("change", async () => {
                if (checkbox.checked) {
                    manager.new_playlist_audio.push(audio[i]);
                } else {
                    manager.new_playlist_audio = manager.new_playlist_audio.filter((val) => val !== audio[i]);
                }
            })
            playlist_div.append(result);
        }
    }

}

let manager: MainManager;


/**
 *
 * @param seconds
 */
function secondsToTime(seconds: number) {
    seconds = Math.round(seconds);
    const minutes = Math.floor(seconds / 60);
    const new_seconds = String(Math.abs(minutes * 60 - seconds));
    return `${minutes > 10 ? "0" + String(minutes) : minutes}:${new_seconds.length === 1 ? "0" + new_seconds : new_seconds}`
}


/**
 * Select a new space
 * @param index
 */
async function select(index: number) {
    manager.settings.current_space = index;
    manager.current_playlist_index = 0;
    manager.saveSettings();
    UpdateManager.updateMain_Songs();

    const p2 = document.getElementById("space-name") as HTMLParagraphElement;
    p2.textContent = manager.getCurrentSpace().name;
    await setupAudio();

}


/**
 * load from settings manager.all_audio after app is starting
 */
async function setupAudio() {
    if (manager.settings.current_space === -1 && manager.settings.spaces.length > 0) {
        manager.settings.current_space = 0;
    }
    if (manager.settings.current_space === -1) {
        console.log("setupAudio returned")
        return;
    }
    console.log("setupAudio continue")
    const spaces = manager.settings.spaces;
    const i = manager.settings.current_space;
    const info = document.getElementById("space-name") as HTMLParagraphElement;
    info.textContent = spaces[i].name;

    manager.all_audio = await manager.api.getMusicMeta(spaces[i].path);
    manager.current_playlist_index = 0;
    manager.setCurrentPlaylist();
    manager.saveSettings();
    UpdateManager.updateMain();

    const list = document.getElementById("main-aside-playlists") as HTMLDivElement;
    const current_playlist = list.children[manager.current_playlist_index];
    current_playlist.classList.add("toggled-playlist");


    const audio = document.getElementById("main-audio") as HTMLAudioElement;
    const volume = document.getElementById("volume") as HTMLInputElement;
    audio.volume = parseFloat(volume.value) / 100;

}


/**
 *
 */
function showCurrentAudio() {
    try {
        const name = document.getElementById("label-name") as HTMLParagraphElement;
        const author = document.getElementById("label-author") as HTMLParagraphElement;
        const img = document.getElementById("footer-current-icon") as HTMLImageElement;
        if (manager.playlist_audio[manager.current_audio_index].pictures) {
            img.src = manager.playlist_audio[manager.current_audio_index].pictures;
        } else {
            img.src = "assets/images/playlist_logo.svg";
        }
        name.textContent = manager.playlist_audio[manager.current_audio_index].name;
        author.textContent = manager.playlist_audio[manager.current_audio_index].artist;
    } catch (e) {
        console.log(e)
    }

}


/**
 * @file fabrics
 */


/**
 * Create a space widget
 * @param index {number} an index of space
 * @param space {ISpace} an object with properties of space
 * @returns {HTMLDivElement} a new widget
 */
function spaceFabric(index: number, space: ISpace): HTMLDivElement {
    const {name, path} = space;
    const body = document.createElement('div');
    const _number = document.createElement("p");
    const _name = document.createElement("p");
    const _path = document.createElement("p");

    body.classList.add("space-element");
    _number.classList.add("space-element-number");
    _number.appendChild(document.createTextNode(index.toString()));
    _name.classList.add("space-element-name");
    _name.appendChild(document.createTextNode(name));
    _path.classList.add("space-element-path");
    _path.appendChild(document.createTextNode(path));


    body.append(_number, _name, _path);
    return body;


}

/**
 * Create an audio-widget that user can choose for append to a new playlist
 * @param index {number} an index of audio
 * @param meta {Meta} an object with properties of audio
 * @returns {HTMLDivElement} a new widget
 */
function playlistsAudioFabric(index: number, meta: Meta): HTMLDivElement {
    const body = document.createElement("div");
    const checkbox = document.createElement("input");
    const index_ = document.createElement("p");
    const div = document.createElement("div");
    const name = document.createElement("p");
    const artist = document.createElement("p");
    const album = document.createElement("p");
    const duration = document.createElement("p");
    const group = document.createElement("div");
    const img = document.createElement("img");
    body.classList.add("playlist-body");

    checkbox.type = "checkbox";
    checkbox.classList.add("playlist-body-checkbox");

    index_.classList.add("playlist-body-index");
    index_.textContent = cutText(index.toString(), 15);

    div.classList.add("playlist-body-pic-out");

    img.src =meta.pictures? meta.pictures : "assets/images/playlist_logo.svg";
    div.append(img)

    name.classList.add("playlist-body-name");
    name.textContent = cutText(`${meta.name}`, 15);

    artist.classList.add("playlist-body-artist");
    artist.textContent = cutText(`${meta.artist}`, 15)

    album.classList.add("playlist-body-album")
    album.textContent = cutText(`${meta.album}`, 15);

    duration.classList.add("playlist-body-duration");
    duration.textContent = cutText(secondsToTime(meta.duration), 15);


    group.classList.add("playlist-body-group");
    group.append(checkbox, index_, div, name, artist, album)

    body.append(group, duration);

    return body;

}


/**
 * Cut text
 * @param text {string} a text that wil be cut
 * @param max {max} an index of last char in result
 * @returns {string} a cut up text
 */
function cutText(text: string, max: number): string {
    return text.length > max ? text.substring(0, max) + "..." : text;
}


/**
 * Create a playlist-widget on mainpage
 * @param meta {IPlaylist} an object with properties of playlist
 * @param is_main deprecated argument
 * @returns {HTMLDivElement} a new widget
 */
function playlistOnMainFabric(meta: IPlaylist, is_main = false): HTMLDivElement {

    const body = document.createElement("div");
    const div = document.createElement("div");
    const name = document.createElement("p");
    const amount = document.createElement("p");
    if (meta.icon) {
        const pic = document.createElement("img");
        pic.classList.add("main-playlist-body-pic");
        pic.src = meta.icon;
        div.append(pic);
    }

    body.classList.add("main-playlist-body");

    div.classList.add("main-playlist-body-pic-out");

    name.classList.add("main-playlist-name");
    name.textContent = meta.name;

    amount.classList.add("main-playlist-amount");

    if (is_main || meta.name === "__global__") {
        name.textContent = "Все песни"
        amount.textContent = manager.all_audio.length.toString() + " аудио";
    } else {

        amount.textContent = meta.songs.length + " аудио";
    }

    body.append(div, name, amount);
    return body;
}

/**
 * Create an audio widget
 * @param index {number} an index of audio
 * @param meta {Meta} an object with properties of audio
 * @returns {HTMLDivElement} a new widget
 *
 */
function audioFabric(index: number, meta: Meta): HTMLDivElement {


    const body = document.createElement("div");
    body.classList.add("main-song");
    const num = document.createElement("p");
    num.classList.add("main-song-number");
    num.appendChild(document.createTextNode(`${index + 1}`));
    const pic_outer = document.createElement("div");
    pic_outer.classList.add("main-song-image-out");
    const img = document.createElement("img");
    img.classList.add("main-song-image");
    if (meta.pictures) {
        img.src = meta.pictures;
    } else {
        img.src = "assets/images/playlist_logo.svg";
    }
    pic_outer.appendChild(img);

    const name = document.createElement("p");
    name.classList.add("main-song-name");
    name.textContent = cutText(meta.name, 20);
    const artist = document.createElement("p");
    artist.classList.add("main-song-artist");
    artist.appendChild(document.createTextNode(meta.artist));
    const album = document.createElement("p");
    album.classList.add("main-song-album");
    album.appendChild(document.createTextNode(meta.album));
    const duration = document.createElement("p");
    duration.classList.add("main-song-duration");
    duration.textContent = secondsToTime(meta.duration ?? 0);

    const group = document.createElement("div");
    group.classList.add("main-song-group");
    group.append(num, pic_outer, name, artist, album);
    body.append(group, duration);

    return body;
}

/**
 * Create a temporary message about error
 * @param name {string} a message of error
 */
function errorFabric(name: string) {
    const body = document.createElement("div");
    body.classList.add("error");
    const p = document.createElement("p");
    p.classList.add("error-p");
    p.textContent = name;
    body.append(p);
    manager.root.append(body);


    setTimeout(() => {
        body.remove();
    }, 3000);
}


