"use strict";
/**
 * @file page_handlers
 * @author OPIE
 *
 */
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
    if (manager.settings.current_space === -1) {
        errorFabric("Ни одна папка не выбрана");
        return;
    }
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
        if (!manager.is_playlist_edit) {
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
                icon: manager.new_playlist_image,
                songs: song_names
            };
            manager.appendAndSavePlaylist(playlist);
            manager.setCurrentPlaylist();
            await mainHandler();
        }
        else {
            manager.is_playlist_edit = false;
            const currentPlaylist = manager.getCurrentPlaylist();
            if (manager.settings.current_space === -1) {
                errorFabric("Никакое пространство не выбрано");
                return;
            }
            const name = document.getElementById("playlists-name-input");
            if (!name.value) {
                errorFabric("Неверное название плейлиста");
                return;
            }
            if (manager.new_playlist_audio.length === 0) {
                errorFabric("В плейлисте должна быть хотя-бы одна песня");
                return;
            }
            let song_names = [];
            manager.new_playlist_audio.forEach((val) => {
                song_names.push(val.name);
            });
            let song_names2 = [];
            song_names.forEach((val) => {
                if (!song_names2.includes(val)) {
                    song_names2.push(val);
                }
            });
            song_names = song_names2;
            const playlist = {
                name: name.value,
                icon: manager.new_playlist_image,
                songs: song_names
            };
            manager.settings.spaces[manager.settings.current_space].playlists.forEach((val) => {
                if (val.name === currentPlaylist.name) {
                    val.name = playlist.name;
                    val.songs = song_names;
                    val.icon = playlist.icon;
                }
            });
            manager.saveSettings();
            await mainHandler();
        }
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
    const playlist_edit = document.getElementById("main-create-edit-playlist");
    playlist_edit.addEventListener("click", async () => {
        if (manager.settings.current_space === -1) {
            errorFabric("Ни одна папка не выбрана");
            return;
        }
        await editPlaylistHandler();
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
    const selected_undo = document.getElementById("selected-undo");
    selected_undo.addEventListener("click", async () => {
        const logo_button = document.getElementById("footer-audio-logo");
        logo_button.disabled = false;
        const footer = document.querySelector("footer");
        footer.id = "selected-footer";
        await mainHandler();
        footerToMain();
    });
    const logo_button = document.getElementById("footer-audio-logo");
    logo_button.addEventListener("click", async () => {
        if (manager.settings.current_space === -1) {
            return;
        }
        await selectedHandler();
    });
    const equalizer = document.querySelector("#equalizer");
    equalizer.addEventListener("click", async () => {
        await equalizerHandler();
    });
    const equalizer_undo = document.getElementById("equalizer-undo");
    equalizer_undo.addEventListener("click", () => {
        const widget = document.querySelector("#equalizer-body");
        widget.classList.add("disabled");
    });
    setupEqualizer();
    const playlist_logo = document.getElementById("playlists-logo");
    playlist_logo.addEventListener("click", async () => {
        const result = await manager.api.getPlaylistImage();
        if (!result[0]) {
            return;
        }
        manager.new_playlist_image = result[1];
        const img2 = document.getElementById("playlists-img2");
        img2.src = result[1];
    });
    const tags_button = document.getElementById("selected-edit-tags");
    tags_button.addEventListener("click", async () => {
        // errorFabric("Функция в разработке");
        await editTagsHandler();
    });
    const tags_undo = document.getElementById("tag-undo");
    tags_undo.addEventListener("click", async () => {
        manager.current_audio_for_edit = -1;
        const footer = document.querySelector("footer");
        footer.classList.remove("disabled");
        await selectedHandler();
    });
    const filename = document.querySelector("#tag-filename");
    const name = document.querySelector("#tag-name");
    const album = document.querySelector("#tag-album");
    const artist = document.querySelector("#tag-artist");
    const executor = document.querySelector("#tag-executor");
    const composer = document.querySelector("#tag-composer");
    const icon_remove = document.querySelector("#tag-remove-icon");
    const icon_select = document.querySelector("#tag-new-icon");
    const icon = document.querySelector("#tag-icon-1");
    const genre = document.querySelector("#tag-genre");
    const description = document.querySelector("#tag-desc");
    const year = document.querySelector("#tag-year");
    const number = document.querySelector("#tag-number");
    const disk = document.querySelector("#tag-disc-number");
    icon_remove.addEventListener("click", () => {
        icon.src = "assets/images/playlist_logo.svg";
    });
    icon_select.addEventListener("click", async () => {
        const res = await manager.api.getPlaylistImage();
        if (res[0]) {
            icon.src = res[1];
        }
    });
    const tags_redo = document.querySelector("#tag-redo");
    tags_redo.addEventListener("click", async () => {
        if (manager.current_audio_for_edit === -1) {
            errorFabric("Ни одно аудио не выбрано");
            return;
        }
        const meta = {
            filepath: manager.current_audio_for_edit_path,
            filename: filename.value ?? manager.current_audio_for_edit_name,
            name: name.value ?? "",
            description: description.value ?? "",
            album: album.value ?? "",
            artist: artist.value ?? "",
            executor: executor.value ?? "",
            composer: composer.value ?? "",
            genre: genre.value ?? "",
            year: year.value ?? "",
            number: number.value ?? "",
            disk_number: disk.value ?? "",
            icon: icon.src.replace("data:image/png;base64,", ""),
            path_to: manager.current_audio_for_edit_path_to
        };
        const old_name = manager.all_audio[manager.current_audio_for_edit].name;
        manager.all_audio[manager.current_audio_for_edit].name = filename.value ?? manager.current_audio_for_edit_name;
        const playlists = manager.settings.spaces[manager.settings.current_space].playlists;
        playlists.forEach((_, index) => {
            playlists[index].songs.forEach((val, index1) => {
                if (val === old_name) {
                    playlists[index].songs[index1] = filename.value ?? manager.current_audio_for_edit_name;
                }
            });
        });
        manager.settings.spaces[manager.settings.current_space].playlists = playlists;
        const res = await manager.api.saveMeta(meta);
        if (!res) {
            errorFabric("FFMPEG не установлен");
            return;
        }
        manager.saveSettings();
        await setupAudio();
        UpdateManager.updateMain();
        await editTagsHandler();
    });
    const select = document.getElementById("filters-sorting");
    select.addEventListener("change", (e) => {
        manager.render_mode_of_audio = e.target.value;
        console.log(`${manager.render_mode_of_audio} :: selected`);
        manager.changePlaylistAudio();
        UpdateManager.updateMain();
    });
    const arrow = document.getElementById("main-arrow");
    const main_audio = document.getElementById("main-songs");
    arrow.addEventListener("click", () => {
        const result = main_audio.children[manager.current_audio_index];
        main_audio.scrollTo({
            top: result.offsetTop,
            behavior: "smooth"
        });
    });
    main_audio.addEventListener("scroll", () => {
        const result = main_audio.children[manager.current_audio_index];
        const rect_elem = result.getBoundingClientRect();
        const rect_parent = main_audio.getBoundingClientRect();
        let isVisible = (rect_elem.top < rect_parent.bottom);
        let isVisible2 = (rect_elem.bottom > rect_parent.top);
        if (!isVisible || !isVisible2) {
            arrow.classList.remove("disabled");
            arrow.disabled = false;
        }
        if (!isVisible) {
            arrow.classList.remove("turned");
        }
        if (!isVisible2) {
            arrow.classList.remove("disabled");
            arrow.classList.add("turned");
            arrow.disabled = false;
        }
        if (isVisible && isVisible2) {
            arrow.disabled = true;
            arrow.classList.remove("turned");
            arrow.classList.add("disabled");
        }
    });
    const filter_name = document.getElementById("filters-name");
    const filter_album = document.getElementById("filters-album");
    const filter_artist = document.getElementById("filters-artist");
    const array = [filter_name, filter_artist, filter_album];
    let is_name_hover = false;
    let is_album_hover = false;
    let is_artist_hover = false;
    let e_x_pos = 0;
    const hr = document.querySelector("hr");
    const changeWidthHandler = (e, index) => {
        hr.classList.add("disabled");
        if (!is_name_hover && !is_album_hover && !is_artist_hover) {
            return;
        }
        is_name_hover = false;
        is_artist_hover = false;
        is_album_hover = false;
        array.forEach(value => value.classList.remove("entering"));
        const audio = document.getElementById("main-songs").children;
        if (audio.length > 0) {
            for (const i of audio) {
                const v = i;
                if (index === 0) {
                    const name = v.querySelector(".main-song-name");
                    const rect = filter_name.getBoundingClientRect();
                    const rect2 = name.getBoundingClientRect();
                    const x1 = rect.left;
                    const x2 = rect2.left;
                    const delimiter = Math.abs(x1 - x2);
                    const eval_ = rect.width - delimiter;
                    name.style.width = `${eval_}px`;
                }
                else if (index === 1) {
                    const artist = v.querySelector(".main-song-artist");
                    const rect = filter_artist.getBoundingClientRect();
                    const rect2 = artist.getBoundingClientRect();
                    const x1 = rect.left;
                    const x2 = rect2.left;
                    const delimiter = Math.abs(x1 - x2);
                    const eval_ = rect.width - delimiter;
                    artist.style.width = `${eval_}px`;
                }
                else if (index === 2) {
                    const album = v.querySelector(".main-song-album");
                    const rect = filter_album.getBoundingClientRect();
                    const rect2 = album.getBoundingClientRect();
                    const x1 = rect.left;
                    const x2 = rect2.left;
                    const delimiter = Math.abs(x1 - x2);
                    const eval_ = rect.width - delimiter;
                    album.style.width = `${eval_}px`;
                }
            }
        }
        e_x_pos = 0;
    };
    const setupWidthHandler = (type) => {
        hr.classList.remove("disabled");
        if (type === 0) {
            is_name_hover = true;
            filter_name.classList.add("entering");
            const rect = filter_name.getBoundingClientRect();
            hr.style.left = `${rect.left + rect.width - 2}px`;
        }
        else if (type === 1) {
            is_artist_hover = true;
            filter_artist.classList.add("entering");
            const rect = filter_artist.getBoundingClientRect();
            hr.style.left = `${rect.left + rect.width - 2}px`;
        }
        else if (type === 2) {
            filter_album.classList.add("entering");
            is_album_hover = true;
            const rect = filter_album.getBoundingClientRect();
            hr.style.left = `${rect.left + rect.width - 2}px`;
        }
    };
    const moveHandler = (e, i) => {
        if (!is_name_hover && !is_album_hover && !is_artist_hover) {
            return;
        }
        if (e_x_pos === 0) {
            e_x_pos = e.clientX;
            return;
        }
        let current;
        if (i === 0) {
            current = filter_name;
        }
        else if (i === 1) {
            current = filter_artist;
        }
        else {
            current = filter_album;
        }
        const diff = (e.clientX - e_x_pos);
        if (diff > 10) {
            current.style.width = `${current.offsetWidth + Math.abs(e.clientX - e_x_pos)}px`;
            e_x_pos = e.clientX;
        }
        else if (diff < -10) {
            current.style.width = `${current.offsetWidth - Math.abs(e.clientX - e_x_pos)}px`;
            e_x_pos = e.clientX;
        }
        const rect = current.getBoundingClientRect();
        hr.style.left = `${rect.x + rect.width - 2}px`;
    };
    array.forEach((value, key) => {
        const i = key;
        value.addEventListener("mousedown", () => setupWidthHandler(i));
        value.addEventListener("mouseup", (e) => changeWidthHandler(e, i));
        value.addEventListener("mouseleave", (e) => changeWidthHandler(e, i));
        value.addEventListener("mousemove", (e) => moveHandler(e, i));
    });
}
/**
 *
 */
function setupEqualizer() {
    const context = new AudioContext();
    let source = context.createMediaElementSource(document.getElementById("main-audio"));
    const createFilter = function (frequency) {
        const filter = context.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = frequency;
        filter.Q.value = 1;
        filter.gain.value = 0;
        return filter;
    };
    const frequencies = [60, 170, 310, 1000, 6000, 12000];
    const filters = frequencies.map(createFilter);
    filters.reduce(function (prev, curr) {
        prev.connect(curr);
        return curr;
    });
    source.connect(filters[0]);
    filters[filters.length - 1].connect(context.destination);
    const equalizer_list = document.querySelector("#equalizer-list");
    const inputs = equalizer_list.querySelectorAll(".equalizer-option");
    const names = equalizer_list.querySelectorAll(".equalizer-option-name");
    names.forEach((item, i) => {
        item.textContent = `${frequencies[i]}`;
    });
    inputs.forEach(function (item, i) {
        item.addEventListener('input', function (e) {
            const parent = item.parentNode;
            const value = parent.querySelector(".equalizer-option-value");
            filters[i].gain.value = Number(e.target.value);
            value.textContent = `${e.target.value}`;
        });
    });
    const reset = document.getElementById("equalizer-reset");
    reset.addEventListener("click", () => {
        const equalizer_list = document.querySelector("#equalizer-list");
        const inputs = equalizer_list.querySelectorAll(".equalizer-option");
        inputs.forEach((item, index) => {
            item.value = "0";
            const parent = item.parentNode;
            const value = parent.querySelector(".equalizer-option-value");
            value.textContent = "0";
            filters[index].gain.value = 0;
        });
    });
}
/**
 *
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
 *
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
 *
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
/**
 *
 */
async function equalizerHandler() {
    const equalizer_widget = document.querySelector("#equalizer-body");
    equalizer_widget.classList.remove("disabled");
}
/**
 *
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
 *
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
    setupTheme();
}
