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


interface API {
    closeWindow: () => void
    resizeWindow: () => void
    wrapWindow: () => void,
    getPage: (page: string) => Promise<[boolean, string]>,
    getAllSpaces: () => Promise<ISpace[]>,
    getSettings: () => Promise<ISettings>,
    getSpace: (name: string) => Promise<ISpace>,
    getSpacePath: () => Promise<[boolean, string]>,
    makeSpace: (name: string, path: string) => Promise<ISpace[]>,
    updateSettings: (settings: ISettings) => void,
    getMusicMeta: (path: string) => Promise<any[]>
}


const enum Page {
    MAIN,
    SPACE,
    PLAYLIST,
    SETTINGS,
    AUDIO,
    TAGS,

}

class Manager {
    private readonly _api: API;

    private readonly _root: HTMLDivElement;

    private _all_audio: Meta[] = []
    private _playlist_audio: Meta[] = [];
    private _current_playlist: IPlaylist = {name: "__global__", icon: "", songs: []};
    private _current_audio_index: number = 0;
    private _paused = false;
    private _looped = false;
    private _randomed = false;
    private _current_playlist_index = 0;
    private _current_audio_path = "";
    private _settings: ISettings;
    private _new_playlists: Meta[] = [];

    constructor(api: API, settings: ISettings, root: HTMLDivElement) {
        this._api = api;
        this._settings = settings;
        this._root = root;
    }


    get new_playlists(): Meta[] {
        return this._new_playlists;
    }

    set new_playlists(value: Meta[]) {
        this._new_playlists = value;
    }

    get root(): HTMLDivElement {
        return this._root;
    }

    // set root(value: HTMLDivElement) {
    //     this._root = value;
    // }

    get current_playlist(): IPlaylist {
        return this._current_playlist;
    }

    set current_playlist(value: IPlaylist) {
        this._current_playlist = value;
    }

    get current_space_index() {
        return this.settings.current_space;
    }

    set current_space_index(i: number) {
        this.settings.current_space = i;
    }

    get settings() {
        return this._settings
    }

    set settings(settings_: ISettings) {
        this._settings = settings_;
    }

    get api(): API {
        return this._api;
    }

    get all_audio(): Meta[] {
        return this._all_audio;
    }

    get playlist_audio(): Meta[] {
        return this._playlist_audio;
    }

    get current_audio_index(): number {
        return this._current_audio_index;
    }

    get paused(): boolean {
        return this._paused;
    }

    get looped(): boolean {
        return this._looped;
    }

    get randomed(): boolean {
        return this._randomed;
    }

    get current_playlist_index(): number {
        return this._current_playlist_index;
    }

    get current_audio_path(): string {
        return this._current_audio_path;
    }


    // set api(value: API) {
    //     this._api = value;
    // }

    set all_audio(value: Meta[]) {
        this._all_audio = value;
    }

    set playlist_audio(value: Meta[]) {
        this._playlist_audio = value;
    }

    set current_audio_index(value: number) {
        this._current_audio_index = value;
    }

    set paused(value: boolean) {
        this._paused = value;
    }

    set looped(value: boolean) {
        this._looped = value;
    }

    set randomed(value: boolean) {
        this._randomed = value;
    }

    set current_playlist_index(value: number) {
        this._current_playlist_index = value;
    }

    set current_audio_path(value: string) {
        this._current_audio_path = value;
    }

    setCurrentAudio() {
        this.current_audio_path = this.playlist_audio[this.current_audio_index].path;
    }

    setIndexToZero() {
        this.current_audio_index = 0;
    }

    setIndexToLast() {
        this.current_audio_index = this.playlist_audio.length - 1;
    }

    randomizeNextAudio() {
        this.current_audio_index = Math.floor(Math.random() * (this.playlist_audio.length - 1));
        this._current_audio_path = this.playlist_audio[this.current_playlist_index].path;
    }

    reverseLoop() {
        this.looped = !this.looped;
    }

    reverseRandom() {
        this.randomed = !this.randomed;
    }


    setCurrentPlaylist() {
        this.current_playlist = this.settings.spaces[this.current_space_index].playlists[this.current_playlist_index];
    }


    getPlaylists() {
        return this.settings.spaces[this.current_space_index].playlists;
    }


    async setupPage(name: Page) {
        let name_id: string;
        switch (name) {
            case Page.MAIN:
                name_id = "main-page";
                break;
            case Page.SPACE:
                name_id = "spaces";
                break;
            case Page.PLAYLIST:
                name_id = "playlists";
                break;
            case Page.AUDIO:
                name_id = "audio";
                break;
            case Page.TAGS:
                name_id = "tags";
                break;
            case Page.SETTINGS:
                name_id = "settings";
                break;
        }
        for (const i of this.root.children) {
            if (i.id === name_id) {
                i.classList.remove("disabled");
                i.classList.add("enabled");
            }
        }
        for (const i of this.root.children) {
            if (i.id !== name_id) {
                i.classList.add("disabled");
                i.classList.remove("enabled");
            }
        }


    }


    async updateSettings() {
        this.settings = await this.api.getSettings();
    }


    getCurrentSpaceFormated() {
        try {
            return this.settings.spaces[this.current_space_index].name ?? "";
        } catch {
            return "";
        }
    }

    getSpaces() {
        return this.settings.spaces;
    }

    saveSettings() {
        this.api.updateSettings(this.settings);
    }

    updateSettingsLocally() {
        this.settings.current_space = this.current_space_index;

    }

    async loadAudio() {
        this.all_audio = await this.api.getMusicMeta(manager.getSpaces()[manager.settings.current_space].path);
    }


    setupLabelOnMain() {
        const name = document.getElementById("label-name") as HTMLParagraphElement;
        console.log(this.playlist_audio);
        name.textContent = this.playlist_audio[this.current_playlist_index].name;
        const artist = document.getElementById("label-author") as HTMLParagraphElement;
        artist.textContent = this.playlist_audio[this.current_playlist_index].artist;
    }


    savePlaylist(name: string) {
        this.settings.spaces[this.current_space_index].playlists.push({
            name: name,
            icon: "",
            songs: this.new_playlists.map((val) => val.name),
        });
        this.new_playlists = [];
        this.saveSettings();
        this.current_playlist_index = this.playlist_audio.length - 1;
        this.setCurrentPlaylist()
    }
}


let manager: Manager;
