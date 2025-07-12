"use strict";
/**
 *
 */
async function mainHandler(has = false) {
    manager.setupPage("main-page");
    if (!has) {
        UpdateManager.updateMain();
    }
}
/**
 *
 */
async function spaceHandler() {
    manager.setupPage("spaces");
    UpdateManager.updateSpaces();
}
/**
 *
 */
async function playlistsHandler() {
    manager.setupPage("playlists");
    UpdateManager.updatePlaylists();
}
/**
 *
 */
function bindButtons() {
    const main_space_button = document.getElementById("main-spaces-logo");
    /**
     *
     */
    main_space_button.addEventListener("click", async () => {
        await spaceHandler();
    });
    const main_playlists_button = document.getElementById("main-create-new-playlist");
    /**
     *
     */
    main_playlists_button.addEventListener("click", async () => {
        if (manager.settings.current_space === -1) {
            errorFabric("Никакое пространство не выбрано");
            return;
        }
        await playlistsHandler();
    });
    const space_back_button = document.getElementById("undo");
    /**
     *
     */
    space_back_button.addEventListener("click", async () => {
        await mainHandler();
    });
    const playlist_undo = document.getElementById("playlists-undo");
    /**
     *
     */
    playlist_undo.addEventListener("click", async () => {
        if (manager.settings.current_space === -1) {
            errorFabric("Никакое пространство не выбрано");
            return;
        }
        manager.new_playlist_audio = [];
        await mainHandler();
    });
    const playlists_redo = document.getElementById("playlists-redo");
    /**
     *
     */
    playlists_redo.addEventListener("click", async () => {
        if (manager.settings.current_space === -1) {
            errorFabric("Никакое пространство не выбрано");
            return;
        }
        const name = document.getElementById("playlists-name-input");
        if (!name.value) {
            errorFabric("Неверное название плейлиста");
            return;
        }
        const playlists = manager.getPlaylists().map((val) => val.name);
        if (playlists.includes(name.value)) {
            errorFabric("Плейлист с таким именем уже есть");
            return;
        }
        if (manager.new_playlist_audio.length === 0) {
            errorFabric("В плейлисте должна быть хотя-бы одна песня");
            return;
        }
        const song_names = [];
        manager.new_playlist_audio.forEach((val) => {
            song_names.push(val.name);
        });
        const playlist = {
            name: name.value,
            icon: "",
            songs: song_names
        };
        manager.appendAndSavePlaylist(playlist);
        manager.setCurrentPlaylist();
        await mainHandler();
    });
    const space_new = document.getElementById("space-new");
    /**
     *
     */
    space_new.addEventListener("click", async () => {
        await createNewSpace();
    });
    const playlist_delete = document.getElementById("main-create-delete-playlist");
    /**
     *
     */
    playlist_delete.addEventListener("click", () => {
        if (manager.settings.current_space === -1) {
            errorFabric("Никакое пространство не выбрано");
            return;
        }
        if (manager.current_playlist_index !== 0) {
            manager.deletePlaylist();
            UpdateManager.updateMain();
        }
        else {
            errorFabric("Вы не можете удалить этот плейлист");
        }
    });
    const space_delete = document.getElementById("space-delete");
    /**
     *
     */
    space_delete.addEventListener("click", () => {
        const current_space = manager.settings.spaces[manager.settings.current_space];
        if (current_space === undefined) {
            return;
        }
        const new_spaces = [];
        for (const i of manager.settings.spaces) {
            if (i.name !== current_space.name) {
                new_spaces.push(i);
            }
        }
        manager.settings.spaces = new_spaces;
        manager.settings.current_space = -1;
        UpdateManager.updateMain();
        UpdateManager.updateSpaces();
        manager.saveSettings();
    });
}
