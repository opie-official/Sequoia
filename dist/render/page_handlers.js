"use strict";
/**
 * @file page_handlers
 * @author OPIE
 *
 */
/**
 * Change current page on #main-page
 */
async function mainHandler() {
    manager.setupPage("main-page");
    UpdateManager.updateMain();
}
/**
 * Change current page on #spaces
 */
async function spaceHandler() {
    manager.setupPage("spaces");
    UpdateManager.updateSpaces();
}
/**
 * Change current page on #playlists
 */
async function playlistsHandler() {
    if (manager.settings.current_space === -1) {
        errorFabric("Ни одна папка не выбрана");
        return;
    }
    manager.setupPage("playlists");
    UpdateManager.updatePlaylists();
}
/**
 * Change current page on #selected
 */
async function selectedHandler() {
    manager.setupPage("selected-audio");
    const logo_button = document.getElementById("footer-audio-logo");
    logo_button.disabled = true;
    const logo = document.getElementById("selected-logo-logo");
    const name = document.getElementById("selected-name");
    const artist = document.getElementById("selected-artist");
    try {
        const current_song = manager.playlist_audio[manager.current_audio_index];
        if (current_song.pictures.length > 0) {
            logo.src = current_song.pictures;
        }
        else {
            logo.src = "assets/images/playlist_logo.svg";
        }
        name.textContent = current_song.name;
        artist.textContent = current_song.artist;
    }
    catch {
        logo.src = "assets/images/playlist_logo.svg";
    }
    console.log(manager.current_audio_index);
    console.log(logo.src);
    footerToSelected();
}
/**
 * Shows equalizer
 */
async function equalizerHandler() {
    const equalizer_widget = document.querySelector("#equalizer-body");
    equalizer_widget.classList.remove("disabled");
}
/**
 * Change current page on #playlists for editing current playlist
 */
async function editPlaylistHandler() {
    if (manager.getCurrentPlaylist().name === "__global__") {
        errorFabric("Нельзя отредактировать этот плейлист");
        return;
    }
    if (manager.settings.current_space === -1) {
        errorFabric("Ни одна папка не выбрана");
        return;
    }
    manager.setupPage("playlists");
    manager.is_playlist_edit = true;
    UpdateManager.updatePlaylists();
    const audio = document.querySelectorAll(".playlist-body");
    const currentPlaylist = manager.getCurrentPlaylist();
    const img2 = document.getElementById("playlists-img2");
    img2.src = currentPlaylist.icon;
    manager.new_playlist_image = currentPlaylist.icon;
    audio.forEach((item, index) => {
        const checkbox = item.querySelector("input");
        if (currentPlaylist.songs.includes(manager.all_audio[index].name)) {
            checkbox.checked = true;
            manager.new_playlist_audio.push(manager.all_audio[index]);
        }
    });
    const playlist_name = document.querySelector("#playlists-name-input");
    playlist_name.value = currentPlaylist.name;
}
/**
 * Change current page on #tags
 */
async function editTagsHandler() {
    manager.setupPage("tag-page");
    UpdateManager.removeChildren("tag-audio");
    const footer = document.querySelector("footer");
    footer.classList.add("disabled");
    const filename = document.querySelector("#tag-filename");
    const name = document.querySelector("#tag-name");
    const album = document.querySelector("#tag-album");
    const artist = document.querySelector("#tag-artist");
    const executor = document.querySelector("#tag-executor");
    const composer = document.querySelector("#tag-composer");
    const icon = document.querySelector("#tag-icon-1");
    const genre = document.querySelector("#tag-genre");
    const description = document.querySelector("#tag-desc");
    const year = document.querySelector("#tag-year");
    const number = document.querySelector("#tag-number");
    const disk = document.querySelector("#tag-disc-number");
    filename.value = "";
    name.value = "";
    album.value = "";
    artist.value = "";
    executor.value = "";
    composer.value = "";
    genre.value = "";
    description.value = "";
    year.value = "";
    number.value = "";
    disk.value = "";
    icon.src = "assets/images/playlist_logo.svg";
    const list = document.getElementById("tag-audio");
    const path = manager.getCurrentSpace().path;
    const res = await manager.api.getExtendedMeta(path);
    if (res.length === 0) {
        errorFabric("В текущем пространстве нет песен");
        return;
    }
    manager.current_audio_for_edit = -1;
    for (let i = 0; i < res.length; i++) {
        const audio = audioFabric(i, manager.all_audio[i]);
        audio.addEventListener("click", () => {
            const meta = res[i];
            filename.value = meta.filename;
            name.value = meta.name;
            album.value = meta.album;
            artist.value = meta.artist;
            executor.value = meta.executor;
            composer.value = meta.composer;
            icon.src = meta.icon ? `data:image/png;base64,${meta.icon}` : "assets/images/playlist_logo.svg";
            genre.value = meta.genre;
            description.value = meta.description;
            year.value = meta.year;
            number.value = meta.number;
            disk.value = meta.disk_number;
            for (const j of list.children) {
                j.classList.remove("toggled");
            }
            audio.classList.add("toggled");
            manager.current_audio_for_edit = i;
            manager.current_audio_for_edit_name = meta.filename;
            manager.current_audio_for_edit_path = meta.filepath;
            manager.current_audio_for_edit_path_to = meta.path_to;
        });
        list.append(audio);
    }
}
/**
 * Change current page on #settings
 */
async function settingsHandler() {
    manager.setupPage("settings");
    const settings = await manager.api.getSettings();
    const list = document.getElementById("settings-themes");
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    const themes = await manager.api.getThemes();
    if (themes[0]) {
        const arr = themes[1];
        for (const i of arr) {
            const option = document.createElement("option");
            option.classList.add("settings-theme");
            option.value = i.replace(".json", "");
            option.textContent = i.replace(".json", "");
            if (settings.theme && i.replace(".json", "") === settings.theme.replace(".json", "")) {
                option.selected = true;
            }
            list.append(option);
        }
    }
    const check = document.getElementById("settings-start-input");
    check.checked = settings.show_start_page;
}
/**
 * Changes the footer styles if the selected audio page is on the screen.
 */
function footerToSelected() {
    const footer = document.querySelector("footer");
    const footer_left = document.querySelector("#footer-left");
    const footer_main = document.getElementById('footer-main');
    const footer_right = document.getElementById("footer-right");
    footer.id = "selected-footer";
    footer_left.id = "selected-footer-left";
    footer_main.id = "selected-footer-main";
    footer_right.id = "selected-footer-right";
}
/**
 * Changes the footer styles if the main page is on the screen.
 */
function footerToMain() {
    const footer = document.querySelector("footer");
    const footer_left = document.querySelector("#selected-footer-left");
    const footer_main = document.getElementById('selected-footer-main');
    const footer_right = document.getElementById("selected-footer-right");
    footer.id = "main-footer";
    footer_left.id = "footer-left";
    footer_main.id = "footer-main";
    footer_right.id = "footer-right";
}
