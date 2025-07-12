


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
    getMusicMeta: (path: string) => Promise<any[]>
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

    public current_playlist_index = 0;
    public current_audio_index = 0;
    public paused = false;
    public looped = false;
    public randomed = false;


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
        if (manager.settings.current_space===-1){
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
        if (manager.settings.current_space===-1){
            return;
        }
        const playlists = manager.getPlaylists();
        for (let i = 0; i < playlists.length; i++) {
            const index = i;
            const result = playlistOnMainFabric(playlists[i]);

            if (index===manager.current_playlist_index){
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
        if (manager.settings.current_space!==-1) {
            const space = manager.getCurrentSpace();
            p.textContent = space.name;

        }else{
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
                console.log("clicked")
                await select(index);
            });
            spaces_div.append(result);
        }
    }


    /**
     *
     */
    static updatePlaylists() {
        const playlist_div = document.getElementById("playlists-right") as HTMLDivElement;
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
    return `${minutes}:${new_seconds}`
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
    if (manager.settings.current_space===-1){
        return;
    }
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
    console.log(`audio: ${current_playlist}`)
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
        name.textContent = manager.playlist_audio[manager.current_audio_index].name;
        author.textContent = manager.playlist_audio[manager.current_audio_index].artist;
    } catch (e) {
        console.log(e)
    }

}