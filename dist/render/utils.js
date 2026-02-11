"use strict";
/**
 * @file utils
 * @author OPIE
 */
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
    new_playlist_image = "";
    current_playlist_index = 0;
    current_audio_index = -1;
    paused = false;
    looped = false;
    randomed = false;
    is_playlist_edit = false;
    current_audio_for_edit = -1;
    current_audio_for_edit_name = "";
    current_audio_for_edit_path = "";
    current_audio_for_edit_path_to = "";
    render_mode_of_audio = "name";
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
            this.changePlaylistAudio();
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
    changePlaylistAudio() {
        if (this.render_mode_of_audio === "album") {
            console.log("album");
            this.playlist_audio = this.playlist_audio.sort((a, b) => {
                try {
                    return a.album.localeCompare(b.album);
                }
                catch {
                    return 1;
                }
            });
        }
        else if (this.render_mode_of_audio === "name") {
            console.log("name");
            this.playlist_audio = this.playlist_audio.sort((a, b) => {
                try {
                    return a.name.localeCompare(b.name);
                }
                catch {
                    return 1;
                }
            });
        }
        else if (this.render_mode_of_audio === "artist") {
            console.log("artist");
            this.playlist_audio = this.playlist_audio.sort((a, b) => {
                try {
                    return a.artist.localeCompare(b.artist);
                }
                catch {
                    return 1;
                }
            });
        }
        else {
            console.log("no one");
        }
        console.log(this.playlist_audio);
    }
}
/**
 * @class UpdateManager
 * A class that responsible to updating parts of interface
 */
class UpdateManager {
    /**
     * Remove all children from widget
     * @param id  id of widget
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
     * Update content on #main-page
     */
    static updateMain() {
        this.updateMain_Playlists();
        this.updateMain_Songs();
        this.updateMain_Space();
    }
    /**
     * Update an audio list on #main-page
     */
    static updateMain_Songs() {
        const songs_div = document.getElementById("main-songs");
        this.removeChildren("main-songs");
        if (manager.settings.current_space === -1) {
            const p = document.createElement("p");
            p.textContent = "Вы не добавили ни одну папку с музыкой";
            p.classList.add("warn");
            songs_div.appendChild(p);
            return;
        }
        manager.setCurrentPlaylist();
        if (manager.playlist_audio.length === 0) {
            const p = document.createElement("p");
            p.textContent = "В текущей папке нет музыки";
            p.classList.add("warn");
            songs_div.appendChild(p);
            return;
        }
        const audio_div = document.getElementById("main-audio");
        const svg1 = document.getElementById("play-svg");
        const svg2 = document.getElementById("pause-svg");
        for (let i = 0; i < manager.playlist_audio.length; i++) {
            const index = i;
            const audio = manager.playlist_audio[index];
            const result = audioFabric(index, audio);
            if (index === manager.current_audio_index) {
                result.classList.add("toggled");
            }
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
                svg1.style.opacity = "1";
                svg2.style.opacity = "0";
                this.updateMain_CurrentAudio();
            });
            songs_div.append(result);
        }
    }
    /**
     * Update a playlists list on #main-page
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
                manager.changePlaylistAudio();
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
     * Update a space-name on #main-page
     */
    static updateMain_Space() {
        const p = document.getElementById("main-spaces-name");
        if (manager.settings.current_space !== -1) {
            const space = manager.getCurrentSpace();
            p.textContent = space.name;
        }
        else {
            p.textContent = "";
        }
    }
    /**
     * Update a current audio info on #main-page
     */
    static updateMain_CurrentAudio() {
        try {
            const name = document.getElementById("label-name");
            const author = document.getElementById("label-author");
            const img = document.getElementById("footer-current-icon");
            if (manager.playlist_audio[manager.current_audio_index].pictures) {
                img.src = manager.playlist_audio[manager.current_audio_index].pictures;
            }
            else {
                img.src = "assets/images/playlist_logo.svg";
            }
            name.textContent = manager.playlist_audio[manager.current_audio_index].name;
            author.textContent = manager.playlist_audio[manager.current_audio_index].artist;
        }
        catch (e) {
            console.log(e);
        }
    }
    /**
     * Update a list of spaces on #spaces
     */
    static updateSpaces() {
        const spaces_div = document.getElementById("space-list");
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
     * Update a list of playlists on #playlists
     */
    static updatePlaylists() {
        const img2 = document.getElementById("playlists-img2");
        img2.src = "";
        const playlist_div = document.getElementById("playlists-right");
        manager.new_playlist_audio = [];
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
 * Convert seconds to minutes:seconds
 * @param seconds seconds
 */
function secondsToTime(seconds) {
    seconds = Math.round(seconds);
    const minutes = Math.floor(seconds / 60);
    const new_seconds = String(Math.abs(minutes * 60 - seconds));
    return `${minutes > 10 ? "0" + String(minutes) : minutes}:${new_seconds.length === 1 ? "0" + new_seconds : new_seconds}`;
}
/**
 * Select a new space
 * @param index
 */
async function select(index) {
    completeFabric(`папка "${manager.getCurrentSpace().name}" выбрана`);
    manager.settings.current_space = index;
    manager.current_playlist_index = 0;
    manager.saveSettings();
    UpdateManager.updateMain_Songs();
    const p2 = document.getElementById("space-name");
    p2.textContent = manager.getCurrentSpace().name;
    await setupAudio();
}
/**
 * Load from settings manager.all_audio after app is starting
 */
async function setupAudio() {
    if (manager.settings.current_space === -1 && manager.settings.spaces.length > 0) {
        manager.settings.current_space = 0;
    }
    if (manager.settings.current_space === -1) {
        console.log("setupAudio returned");
        return;
    }
    console.log("setupAudio continue");
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
    const volume = document.getElementById("volume");
    audio.volume = parseFloat(volume.value) / 100;
}
/**
 * Setups a current theme by changing a CSS variables
 */
async function setupTheme() {
    const theme = await manager.api.getTheme();
    if (!theme[0]) {
        return;
    }
    const obj = JSON.parse(theme[1]);
    const root = document.documentElement;
    if (obj.styles.main_color)
        root.style.setProperty("--main", obj.styles.main_color);
    if (obj.styles.aside_color)
        root.style.setProperty("--aside", obj.styles.aside_color);
    if (obj.styles.footer.color)
        root.style.setProperty("--footer", obj.styles.footer.color);
    if (obj.styles.footer.active)
        root.style.setProperty("--footer-clicked", obj.styles.footer.active);
    if (obj.styles.text.title)
        root.style.setProperty("--title", obj.styles.text.title);
    if (obj.styles.text.subtitle)
        root.style.setProperty("--sub-title", obj.styles.text.subtitle);
    if (obj.styles.footer.hover)
        root.style.setProperty("--footer-hovered", obj.styles.footer.hover);
    if (obj.styles.footer.button)
        root.style.setProperty("--footer-color", obj.styles.footer.button);
    if (obj.styles.input.bg)
        root.style.setProperty("--input-bg", obj.styles.input.bg);
    if (obj.styles.input.border)
        root.style.setProperty("--input-border", obj.styles.input.border);
    if (obj.styles.input.color)
        root.style.setProperty("--input-color", obj.styles.input.color);
    if (obj.styles.title_bar.bg)
        root.style.setProperty("--title-bar-color", obj.styles.title_bar.bg);
    if (obj.styles.buttons.main_hover)
        root.style.setProperty("--main-hover", obj.styles.buttons.main_hover);
    if (obj.styles.svg)
        root.style.setProperty("--svg", obj.styles.svg);
    if (obj.styles.range)
        root.style.setProperty("--range", obj.styles.range);
    if (obj.styles.utils.undo)
        root.style.setProperty("--undo", obj.styles.utils.undo);
    if (obj.styles.utils.undo_hover)
        root.style.setProperty("--undo-hover", obj.styles.utils.undo_hover);
    if (obj.styles.utils.redo)
        root.style.setProperty("--redo", obj.styles.utils.redo);
    if (obj.styles.utils.redo_hover)
        root.style.setProperty("--redo-hover", obj.styles.utils.redo_hover);
    if (obj.styles.utils.reset)
        root.style.setProperty("--reset", obj.styles.utils.reset);
    if (obj.styles.utils.reset_hover)
        root.style.setProperty("--reset-hover", obj.styles.utils.reset_hover);
    if (obj.styles.buttons.aside_hover)
        root.style.setProperty("--aside-hover", obj.styles.buttons.aside_hover);
    await hoverButtons();
}
/**
 * Use a current theme on buttons
 */
async function hoverButtons() {
    const theme = await manager.api.getTheme();
    if (theme[0]) {
        const obj = JSON.parse(theme[1]);
        const buttons = document.querySelectorAll(".button");
        buttons.forEach((val) => {
            let aside_color_hover = `#3e4045`;
            let main_color_hover = `#2a2a2e`;
            let fill_hover = "white";
            let fill_base = `#D9D9D9`;
            if (theme[0]) {
                const obj = JSON.parse(theme[1]);
                main_color_hover = obj.styles.buttons.main_hover;
                aside_color_hover = obj.styles.buttons.aside_hover;
                fill_base = obj.styles.buttons.fill_bg;
                fill_hover = obj.styles.buttons.fill_hover;
            }
            const value = val;
            const svg = value.querySelector("svg");
            value.style.background = "transparent";
            const path = svg.querySelector("path");
            path.style.fill = fill_base;
            path.style.stroke = fill_base;
            value.addEventListener("mouseenter", () => {
                if (value.classList.contains("aside")) {
                    value.style.background = aside_color_hover;
                }
                else {
                    value.style.background = main_color_hover;
                }
                path.style.fill = fill_hover;
                path.style.stroke = fill_hover;
            });
            value.addEventListener("mouseleave", () => {
                value.style.background = "transparent";
                path.style.fill = fill_base;
                path.style.stroke = fill_base;
            });
        });
        if (obj.styles.footer) {
            const bts = document.querySelectorAll(".footer-button");
            bts.forEach((bt) => {
                const svg = bt.querySelectorAll("svg");
                svg.forEach((v) => {
                    const paths = v.querySelectorAll("path");
                    paths.forEach((path) => {
                        path.style.fill = obj.styles.footer.button;
                    });
                });
                bt.addEventListener("mouseenter", () => {
                    svg.forEach((v) => {
                        const paths = v.querySelectorAll("path");
                        paths.forEach((path) => {
                            path.style.fill = obj.styles.footer.button;
                            path.style.fill = obj.styles.footer.hover;
                            path.style.color = obj.styles.footer.hover;
                        });
                    });
                });
                bt.addEventListener("mouseleave", () => {
                    svg.forEach((v) => {
                        const paths = v.querySelectorAll("path");
                        paths.forEach((path) => {
                            path.style.fill = obj.styles.footer.button;
                            path.style.fill = obj.styles.footer.button;
                            path.style.color = obj.styles.footer.button;
                        });
                    });
                });
            });
        }
    }
}
