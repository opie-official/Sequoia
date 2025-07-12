"use strict";
/**
 * @class MainManager
 * A class of app manager that responsible for keep settings and api and their update
 */
class MainManager {
    api;
    settings;
    root;
    all_audio = []; // audio from space
    playlist_audio = []; // audio from playlist from current space;
    new_playlist_audio = [];
    current_playlist_index = 0;
    current_audio_index = 0;
    paused = false;
    looped = false;
    randomed = false;
    constructor(api, settings, root) {
        this.api = api;
        this.settings = settings;
        this.root = root;
    }
    /**
     * Change a visible page
     * @param id an id of needed page
     */
    setupPage(id) {
        for (const i of this.root.children) {
            if (i.id === id) {
                i.classList.add("enabled");
                i.classList.remove("disabled");
            }
            else {
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
        }
        else {
        } // console.log("error: all_audio is null")
    }
    /**
     * unused now
     */
    getCurrentPlaylist() {
        return this.settings.spaces[this.settings.current_space].playlists[this.current_playlist_index];
    }
    /**
     * get all playlist of current space
     */
    getPlaylists() {
        return this.settings.spaces[this.settings.current_space].playlists;
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
    appendAndSavePlaylist(playlist) {
        manager.settings.spaces[manager.settings.current_space].playlists.push(playlist);
        this.saveSettings();
    }
    deletePlaylist() {
        const current_playlist = this.getCurrentPlaylist();
        const new_list = [];
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
    static removeChildren(id) {
        try {
            const div = document.getElementById(id);
            while (div.firstChild) {
                div.removeChild(div.firstChild);
            }
        }
        catch {
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
        const songs_div = document.getElementById("main-songs");
        this.removeChildren("main-songs");
        if (manager.settings.current_space === -1) {
            return;
        }
        manager.setCurrentPlaylist();
        const audio_div = document.getElementById("main-audio");
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
                const bt = document.getElementById("main-pause");
                const img = bt.querySelector("img");
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
        const playlists_div = document.getElementById("main-aside-playlists");
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
        const p = document.getElementById("main-spaces-name");
        const list = document.getElementById("main-songs");
        if (manager.settings.current_space !== -1) {
            const space = manager.getCurrentSpace();
            p.textContent = space.name;
        }
        else {
            p.textContent = "";
            list.append(document.createTextNode("В текущем пространстве нет ни одной песни"));
        }
    }
    /**
     *
     */
    static updateSpaces() {
        const spaces_div = document.getElementById("space-list");
        this.removeChildren(spaces_div.id);
        const spaces = manager.settings.spaces;
        for (let i = 0; i < spaces.length; i++) {
            const index = i;
            const result = spaceFabric(i, spaces[i]);
            result.addEventListener("click", async () => {
                console.log("clicked");
                await select(index);
            });
            spaces_div.append(result);
        }
    }
    /**
     *
     */
    static updatePlaylists() {
        const playlist_div = document.getElementById("playlists-right");
        this.removeChildren(playlist_div.id);
        const audio = manager.all_audio;
        if (!audio) {
            playlist_div.appendChild(document.createTextNode("В текущем пространстве нет ни одной песни"));
            return;
        }
        for (let i = 0; i < audio.length; i++) {
            const result = playlistsAudioFabric(i, audio[i]);
            const checkbox = result.querySelector("input[type='checkbox']");
            checkbox.addEventListener("change", async () => {
                if (checkbox.checked) {
                    manager.new_playlist_audio.push(audio[i]);
                }
                else {
                    manager.new_playlist_audio = manager.new_playlist_audio.filter((val) => val !== audio[i]);
                }
            });
            playlist_div.append(result);
        }
    }
}
let manager;
/**
 *
 * @param seconds
 */
function secondsToTime(seconds) {
    seconds = Math.round(seconds);
    const minutes = Math.floor(seconds / 60);
    const new_seconds = String(Math.abs(minutes * 60 - seconds));
    return `${minutes}:${new_seconds}`;
}
/**
 * Select a new space
 * @param index
 * @param body
 */
async function select(index) {
    manager.settings.current_space = index;
    manager.current_playlist_index = 0;
    manager.saveSettings();
    UpdateManager.updateMain_Songs();
    const p2 = document.getElementById("space-name");
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
        return;
    }
    const spaces = manager.settings.spaces;
    const i = manager.settings.current_space;
    const info = document.getElementById("space-name");
    info.textContent = spaces[i].name;
    manager.all_audio = await manager.api.getMusicMeta(spaces[i].path);
    manager.current_playlist_index = 0;
    manager.setCurrentPlaylist();
    manager.saveSettings();
    UpdateManager.updateMain();
    const list = document.getElementById("main-aside-playlists");
    const current_playlist = list.children[manager.current_playlist_index];
    current_playlist.classList.add("toggled-playlist");
    const audio = document.getElementById("main-audio");
    console.log(`audio: ${current_playlist}`);
    const volume = document.getElementById("volume");
    audio.volume = parseFloat(volume.value) / 100;
}
/**
 *
 */
function showCurrentAudio() {
    try {
        const name = document.getElementById("label-name");
        const author = document.getElementById("label-author");
        name.textContent = manager.playlist_audio[manager.current_audio_index].name;
        author.textContent = manager.playlist_audio[manager.current_audio_index].artist;
    }
    catch (e) {
        console.log(e);
    }
}
