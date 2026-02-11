/**
 * @file listeners
 * @author OPIE
 */


/**
 * Function that`s setup footer buttons
 */
async function setupFooter() {


    const volume_range = document.getElementById("volume") as HTMLInputElement;
    const audio = document.getElementById("main-audio") as HTMLAudioElement;
    const duration = document.getElementById("duration") as HTMLInputElement;
    const p_duration = document.getElementById("footer-duration-value") as HTMLParagraphElement
    const p_volume = document.getElementById("volume-value") as HTMLParagraphElement;

    const pause_button = document.getElementById("main-pause") as HTMLButtonElement;
    const rewind_prev = document.getElementById("main-rewind-prev") as HTMLButtonElement;
    const rewind_next = document.getElementById("main-rewind-next") as HTMLButtonElement;
    const next_button = document.getElementById("main-next") as HTMLButtonElement;
    const prev_button = document.getElementById("main-previous") as HTMLButtonElement;
    const loop_button = document.getElementById("other-loop") as HTMLButtonElement;
    const random_button = document.getElementById("other-random") as HTMLButtonElement;


    pause_button.addEventListener("click", () => {
        const svg1 = document.getElementById("play-svg") as HTMLElement;
        const svg2 = document.getElementById("pause-svg") as HTMLElement;


        if (manager.paused) {
            try {
                audio.play();
            } catch {
            }
            manager.paused = false;
            svg1.style.opacity = "1";
            svg2.style.opacity = "0";

        } else {
            try {
                audio.pause();
            } catch {
            }
            manager.paused = true;
            svg1.style.opacity = "0";
            svg2.style.opacity = "1";
        }
    })
    rewind_prev.addEventListener("click", () => {
        audio.currentTime -= 10;
    });
    rewind_next.addEventListener("click", () => {
        audio.currentTime += 10;
    });
    next_button.addEventListener("click", async () => {
        if (manager.settings.current_space === -1) {
            errorFabric("Никакое пространство не выбрано");
            return;
        }
        const list = document.getElementById("main-songs") as HTMLDivElement;
        const current = list.children[manager.current_audio_index];
        current.classList.remove("toggled");

        manager.saveAudioIncrement();
        const current_playlist = manager.playlist_audio;
        const current_audio = current_playlist[manager.current_audio_index];
        audio.pause();
        audio.src = current_audio.path;

        const current2 = list.children[manager.current_audio_index];
        current2.classList.add("toggled");
        await audio.play();
        UpdateManager.updateMain_CurrentAudio();
    });
    prev_button.addEventListener("click", async () => {
        if (manager.settings.current_space === -1) {
            errorFabric("Никакое пространство не выбрано");
            return;
        }
        const list = document.getElementById("main-songs") as HTMLDivElement;
        const current = list.children[manager.current_audio_index];
        current.classList.remove("toggled");

        manager.saveAudioDecrement();
        const current_playlist = manager.playlist_audio;
        const current_audio = current_playlist[manager.current_audio_index];
        audio.pause();
        audio.src = current_audio.path;

        const current2 = list.children[manager.current_audio_index];
        current2.classList.add("toggled");
        await audio.play();
        UpdateManager.updateMain_CurrentAudio();
    });
    loop_button.addEventListener("click", async () => {
        manager.looped = !manager.looped;

        if (manager.looped) {
            loop_button.classList.add("clicked");
        } else {
            loop_button.classList.remove("clicked");
        }
    })
    random_button.addEventListener("click", () => {
        manager.randomed = !manager.randomed;
        if (manager.randomed) {
            random_button.classList.add("clicked");
        } else {
            random_button.classList.remove("clicked");
        }
    })

    volume_range.addEventListener("input", () => {
        p_volume.textContent = volume_range.value;
        audio.volume = parseInt(volume_range.value) / 100;
    });
    duration.addEventListener("input", () => {
        p_duration.textContent = secondsToTime(parseFloat(duration.value));
        audio.currentTime = parseInt(duration.value);
    })
    audio.addEventListener("playing", () => {
        duration.min = "0";
        duration.max = `${audio.duration}`;

    });
    audio.addEventListener("timeupdate", () => {
        duration.value = `${audio.currentTime}`;
        p_duration.textContent = secondsToTime(parseFloat(duration.value));
    });
    audio.addEventListener("ended", async () => {
        const list = document.getElementById("main-songs") as HTMLDivElement;

        if (manager.looped) {
            audio.currentTime = 0;
            audio.pause();
            setTimeout(async () => {
                await audio.play();
            }, 1000);
        } else if (manager.randomed) {
            const current = list.children[manager.current_audio_index];
            current.classList.remove("toggled");


            const index = Math.floor(Math.random() * (manager.playlist_audio.length - 1));
            const current_audio = manager.playlist_audio[index];
            audio.pause();
            audio.src = current_audio.path;
            manager.current_audio_index = index;
            const current2 = list.children[manager.current_audio_index];
            current2.classList.add("toggled");


            setTimeout(async () => {
                await audio.play();
            }, 1000);
        } else {
            const current = list.children[manager.current_audio_index];
            current.classList.remove("toggled");

            manager.saveAudioIncrement();
            const current_playlist = manager.playlist_audio;
            const current_audio = current_playlist[manager.current_audio_index];
            audio.pause();
            audio.src = current_audio.path;

            const current2 = list.children[manager.current_audio_index];
            current2.classList.add("toggled");

            setTimeout(async () => {
                await audio.play();
            }, 1000);
        }
        UpdateManager.updateMain_CurrentAudio();
    });


    document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            event.preventDefault()
            const footer = document.querySelector("footer") as HTMLDivElement;
            if (footer.classList.contains("disabled")) {
                return;
            }
            pause_button.click();
        } else if (event.code === "ArrowRight") {
            event.preventDefault();
            rewind_next.click();
            duration.value = `${audio.currentTime}`;
            p_duration.textContent = duration.value;

        } else if (event.code === "ArrowLeft") {
            event.preventDefault();
            rewind_prev.click();
            duration.value = `${audio.currentTime}`;
            p_duration.textContent = duration.value;
        } else if (event.code === "ArrowUp") {
            event.preventDefault();
            volume_range.value = `${parseFloat(volume_range.value) + 5}`
            p_volume.textContent = volume_range.value;
            audio.volume = parseFloat(volume_range.value) / 100;
        } else if (event.code === "ArrowDown") {
            event.preventDefault();
            volume_range.value = `${parseFloat(volume_range.value) - 5}`
            p_volume.textContent = volume_range.value;
            audio.volume = parseFloat(volume_range.value) / 100;


        } else if (event.code === "Escape") {
            event.preventDefault();
            const settings = document.getElementById("main-settings") as HTMLButtonElement;
            settings.click();
        }
    })
    p_volume.textContent = volume_range.value;


}

/**
 * Handler that creates a new space
 */
async function createNewSpace() {

    const body = document.createElement("div");
    const p = document.createElement("p");
    const input = document.createElement("input");
    const accept = document.createElement("button");
    const reject = document.createElement("button");
    const group = document.createElement("div");
    const parent = document.body;

    {
        body.id = "custom-prompt";
        p.id = "custom-prompt-p";
        p.textContent = "Введите название для папки";
        input.id = "custom-prompt-input";
        accept.id = "custom-prompt-accept";
        accept.appendChild(document.createTextNode("Подтвердить"));

        reject.id = "custom-prompt-reject";
        reject.appendChild(document.createTextNode("Назад"))

        group.id = "custom-prompt-group";
        group.append(reject, accept)
        body.append(p, input, group);

        parent.append(body);
        body.classList.add("animation-1-start");
        body.classList.remove("animation-1-end");
    }

    /**
     * check and accept a creating of new space
     */
    accept.addEventListener("click", async function () {
        const name = input.value;
        if (name.length === 0) { // if name of new space is incorrect
            return;
        }
        const path = await manager.api.getSpacePath(); // open a dialog-window with selecting of directory path
        if (!path[0]) { // if path not selected
            body.remove();
            return;
        }


        body.classList.remove("animation-1-start");
        body.classList.add("animation-1-end");

        setTimeout(() => {
            body.remove()

        }, 290);
        manager.settings.spaces.push({
            name: name,
            path: path[1],
            playlists: []

        })

        manager.settings.current_space = manager.settings.spaces.length - 1;
        manager.settings.spaces[manager.settings.current_space].playlists.push({
            name: "__global__",
            icon: "",
            songs: []
        })

        manager.saveSettings();

        UpdateManager.updateSpaces();


        await setupAudio();

    })


    /**
     * reject a creating new space
     */
    reject.addEventListener("click", function () {
        body.classList.remove("animation-1-start");
        body.classList.add("animation-1-end");

        setTimeout(() => {
            body.remove()

        }, 290);

    })


}

/**
 * Adds buttons to their functions
 */
function bindButtons() {
    const main_space_button = document.getElementById("main-spaces-logo") as HTMLButtonElement;
    main_space_button.addEventListener("click", async () => {
        await spaceHandler();
    })

    const main_playlists_button = document.getElementById("main-create-new-playlist") as HTMLButtonElement;
    main_playlists_button.addEventListener("click", async () => {
        if (manager.settings.current_space === -1) {
            errorFabric("Никакая папка не выбрана");
            return;
        }
        await playlistsHandler();
    })

    const space_back_button = document.getElementById("undo") as HTMLButtonElement;
    space_back_button.addEventListener("click", async () => {
        await mainHandler();
    })

    const playlist_undo = document.getElementById("playlists-undo") as HTMLButtonElement;
    playlist_undo.addEventListener("click", async () => {
        if (manager.settings.current_space === -1) {
            errorFabric("Никакая папка не выбрана");
            return;
        }
        manager.new_playlist_audio = [];
        await mainHandler();
    })

    const playlists_redo = document.getElementById("playlists-redo") as HTMLButtonElement;
    playlists_redo.addEventListener("click", async () => {
        if (!manager.is_playlist_edit) {
            if (manager.settings.current_space === -1) {
                errorFabric("Никакое пространство не выбрано");
                return;
            }
            const name = document.getElementById("playlists-name-input") as HTMLInputElement;
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
            const song_names: string[] = []
            manager.new_playlist_audio.forEach((val) => {
                song_names.push(val.name);
            })

            const playlist = {
                name: name.value,
                icon: manager.new_playlist_image,
                songs: song_names
            }

            manager.appendAndSavePlaylist(playlist);
            manager.setCurrentPlaylist();
            await mainHandler();
        } else {
            manager.is_playlist_edit = false;
            const currentPlaylist = manager.getCurrentPlaylist();
            if (manager.settings.current_space === -1) {
                errorFabric("Никакая папка не выбрана");
                return;
            }

            const name = document.getElementById("playlists-name-input") as HTMLInputElement;

            if (!name.value) {
                errorFabric("Неверное название плейлиста");
                return;
            }
            if (manager.new_playlist_audio.length === 0) {
                errorFabric("В плейлисте должна быть хотя-бы одна песня");
                return;
            }


            let song_names: string[] = []
            manager.new_playlist_audio.forEach((val) => {
                song_names.push(val.name);
            })

            let song_names2: string[] = []

            song_names.forEach((val) => {
                if (!song_names2.includes(val)) {
                    song_names2.push(val);
                }
            })

            song_names = song_names2;

            const playlist = {
                name: name.value,
                icon: manager.new_playlist_image,
                songs: song_names
            }

            manager.settings.spaces[manager.settings.current_space].playlists.forEach((val) => {
                if (val.name === currentPlaylist.name) {
                    val.name = playlist.name;
                    val.songs = song_names
                    val.icon = playlist.icon;
                }
            })
            manager.saveSettings();
            await mainHandler();

        }
    })


    const space_new = document.getElementById("space-new") as HTMLButtonElement;
    space_new.addEventListener("click", async () => {

        await createNewSpace();
    })


    const playlist_delete = document.getElementById("main-create-delete-playlist") as HTMLButtonElement;
    playlist_delete.addEventListener("click", () => {
        if (manager.settings.current_space === -1) {
            errorFabric("Никакая папка не выбрана");
            return;
        }
        if (manager.current_playlist_index !== 0) {
            manager.deletePlaylist();
            UpdateManager.updateMain();
        } else {
            errorFabric("Вы не можете удалить этот плейлист");
        }
    })


    const playlist_edit = document.getElementById("main-create-edit-playlist") as HTMLButtonElement;
    playlist_edit.addEventListener("click", async () => {
        if (manager.settings.current_space === -1) {
            errorFabric("Ни одна папка не выбрана");
            return;
        }
        await editPlaylistHandler();
    })


    const space_delete = document.getElementById("space-delete") as HTMLButtonElement;
    space_delete.addEventListener("click", () => {
        const current_space = manager.settings.spaces[manager.settings.current_space];
        if (current_space === undefined) {
            return;
        }
        const new_spaces: ISpace[] = [];
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
    })


    const selected_undo = document.getElementById("selected-undo") as HTMLButtonElement;
    selected_undo.addEventListener("click", async () => {
        const logo_button = document.getElementById("footer-audio-logo") as HTMLButtonElement;
        logo_button.disabled = false;

        const footer = document.querySelector("footer") as HTMLDivElement;

        footer.id = "selected-footer";
        await mainHandler()
        footerToMain();
    })


    const logo_button = document.getElementById("footer-audio-logo") as HTMLButtonElement;
    logo_button.addEventListener("click", async () => {
        if (manager.settings.current_space === -1) {
            return;
        }

        await selectedHandler();

    })


    const equalizer = document.querySelector("#equalizer") as HTMLButtonElement;
    equalizer.addEventListener("click", async () => {
        await equalizerHandler();
    })

    const equalizer_undo = document.getElementById("equalizer-undo") as HTMLButtonElement;
    equalizer_undo.addEventListener("click", () => {
        const widget = document.querySelector("#equalizer-body") as HTMLDivElement;
        widget.classList.remove("animation-1-start");
        widget.classList.add("animation-1-end");
        setTimeout(() => {
            widget.classList.add("disabled");
        }, 290);
    })

    setupEqualizer();


    const playlist_logo = document.getElementById("playlists-logo") as HTMLButtonElement;
    playlist_logo.addEventListener("click", async () => {
        const result = await manager.api.getPlaylistImage();
        if (!result[0]) {
            return;
        }
        manager.new_playlist_image = result[1];

        const img2 = document.getElementById("playlists-img2") as HTMLImageElement;
        img2.src = result[1];
    })


    const tags_button = document.getElementById("selected-edit-tags") as HTMLButtonElement;
    tags_button.addEventListener("click", async () => {
        await editTagsHandler();
    })


    const tags_undo = document.getElementById("tag-undo") as HTMLButtonElement;
    tags_undo.addEventListener("click", async () => {
        manager.current_audio_for_edit = -1;
        const footer = document.querySelector("footer") as HTMLDivElement;
        footer.classList.remove("disabled");
        await selectedHandler();
    })


    const filename = document.querySelector("#tag-filename") as HTMLInputElement;
    const name = document.querySelector("#tag-name") as HTMLInputElement;
    const album = document.querySelector("#tag-album") as HTMLInputElement;
    const artist = document.querySelector("#tag-artist") as HTMLInputElement;
    const executor = document.querySelector("#tag-executor") as HTMLInputElement;
    const composer = document.querySelector("#tag-composer") as HTMLInputElement;
    const icon_remove = document.querySelector("#tag-remove-icon") as HTMLButtonElement;
    const icon_select = document.querySelector("#tag-new-icon") as HTMLButtonElement;
    const icon = document.querySelector("#tag-icon-1") as HTMLImageElement;
    const genre = document.querySelector("#tag-genre") as HTMLInputElement;
    const description = document.querySelector("#tag-desc") as HTMLInputElement;
    const year = document.querySelector("#tag-year") as HTMLInputElement;
    const number = document.querySelector("#tag-number") as HTMLInputElement;
    const disk = document.querySelector("#tag-disc-number") as HTMLInputElement;


    icon_remove.addEventListener("click", () => {
        icon.src = "assets/images/playlist_logo.svg";

    })


    icon_select.addEventListener("click", async () => {
        const res = await manager.api.getPlaylistImage()
        if (res[0]) {
            icon.src = res[1];

        }
    })

    const tags_redo = document.querySelector("#tag-redo") as HTMLButtonElement;

    tags_redo.addEventListener("click", async () => {
        if (manager.current_audio_for_edit === -1) {
            errorFabric("Ни одно аудио не выбрано");
            return;
        }

        const meta: ExtendedMeta = {
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
        }

        const old_name = manager.all_audio[manager.current_audio_for_edit].name;

        manager.all_audio[manager.current_audio_for_edit].name = filename.value ?? manager.current_audio_for_edit_name;
        const playlists = manager.settings.spaces[manager.settings.current_space].playlists;
        playlists.forEach((_, index) => {
            playlists[index].songs.forEach((val, index1) => {
                if (val === old_name) {
                    playlists[index].songs[index1] = filename.value ?? manager.current_audio_for_edit_name
                }
            })

        })
        manager.settings.spaces[manager.settings.current_space].playlists = playlists;
        const res = await manager.api.saveMeta(meta);
        if (!res) {
            errorFabric("FFMPEG не установлен")
            return;
        }
        manager.saveSettings();


        await setupAudio();
        UpdateManager.updateMain();
        await editTagsHandler();


    })

    const select = document.getElementById("filters-sorting") as HTMLSelectElement;
    select.addEventListener("change", (e) => {

        manager.render_mode_of_audio = (e.target as HTMLSelectElement).value;
        console.log(`${manager.render_mode_of_audio} :: selected`)
        manager.changePlaylistAudio();
        UpdateManager.updateMain();
    })

    const arrow = document.getElementById("main-arrow") as HTMLButtonElement;

    const main_audio = document.getElementById("main-songs") as HTMLDivElement;


    arrow.addEventListener("click", () => {
        const result = main_audio.children[manager.current_audio_index] as HTMLDivElement;
        main_audio.scrollTo({
            top: result.offsetTop,
            behavior: "smooth"
        })

    })
    main_audio.addEventListener("scroll", () => {
        const result = main_audio.children[manager.current_audio_index] as HTMLDivElement;
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
            arrow.classList.add("disabled")
        }

    });


    const filter_name = document.getElementById("filters-name") as HTMLParagraphElement;
    const filter_album = document.getElementById("filters-album") as HTMLParagraphElement;
    const filter_artist = document.getElementById("filters-artist") as HTMLParagraphElement;
    const array = [filter_name, filter_artist, filter_album]
    let is_name_hover = false;
    let is_album_hover = false;
    let is_artist_hover = false;
    let e_x_pos: number = 0;


    const hr = document.querySelector("hr") as HTMLHRElement;

    const startWidthHandler = (type: number) => {
        hr.classList.remove("disabled");
        if (type === 0) {
            is_name_hover = true;
            filter_name.classList.add("entering");
            const rect = filter_name.getBoundingClientRect();
            hr.style.left = `${rect.left + rect.width - 2}px`;

        } else if (type === 1) {
            is_artist_hover = true
            filter_artist.classList.add("entering");
            const rect = filter_artist.getBoundingClientRect();
            hr.style.left = `${rect.left + rect.width - 2}px`;

        } else if (type === 2) {
            filter_album.classList.add("entering");
            is_album_hover = true;
            const rect = filter_album.getBoundingClientRect();
            hr.style.left = `${rect.left + rect.width - 2}px`;

        }
    }
    const moveHandler = (e: MouseEvent, i: number) => {
        if (!is_name_hover && !is_album_hover && !is_artist_hover) {
            return;
        }
        if (e_x_pos === 0) {
            e_x_pos = e.clientX;
            return;
        }
        let current: HTMLParagraphElement;
        if (i === 0) {
            current = filter_name;
        } else if (i === 1) {
            current = filter_artist;
        } else {
            current = filter_album;
        }
        const diff = (e.clientX - e_x_pos);
        if (diff > 10) {
            current.style.width = `${current.offsetWidth + Math.abs(e.clientX - e_x_pos)}px`;
            e_x_pos = e.clientX;

        } else if (diff < -10) {
            current.style.width = `${current.offsetWidth - Math.abs(e.clientX - e_x_pos)}px`;
            e_x_pos = e.clientX;

        }
        const rect_1 = current.getBoundingClientRect();
        hr.style.left = `${rect_1.x + rect_1.width - 2}px`;
        setupWidth();

    }
    const endWidthHandler = () => {
        hr.classList.add("disabled")
        if (!is_name_hover && !is_album_hover && !is_artist_hover) {
            return;
        }
        is_name_hover = false;
        is_artist_hover = false;
        is_album_hover = false;
        array.forEach(value => value.classList.remove("entering"));
        e_x_pos = 0;
    }

    array.forEach((value, key) => {
        const i = key;
        value.addEventListener("mousedown", () => startWidthHandler(i));
        value.addEventListener("mouseup", () => endWidthHandler());
        value.addEventListener("mouseleave", () => endWidthHandler());
        value.addEventListener("mousemove", (e) => moveHandler(e, i));
    })


    const settings_bt = document.getElementById("main-settings") as HTMLButtonElement;
    settings_bt.addEventListener("click", async () => {
        await settingsHandler();
    })


    const settings_undo = document.getElementById("settings-undo") as HTMLButtonElement;
    settings_undo.addEventListener("click", async () => {
        await mainHandler();
    })

    const settings_redo = document.getElementById("settings-redo") as HTMLButtonElement;
    settings_redo.addEventListener("click", async () => {
        const check = document.getElementById("settings-start-input") as HTMLInputElement;
        const current_theme = manager.settings.theme;

        const list = document.getElementById("settings-themes") as HTMLSelectElement;
        if (list.firstChild) {
            const val = list.value;
            if (val !== current_theme) {
                manager.settings.theme = val;
                await setupTheme();
                window.location.reload();
                setTimeout(() => {
                    completeFabric("Настройки сохранены");

                }, 2000)
            }
        }
        manager.settings.show_start_page = check.checked;

        manager.saveSettings();
        await mainHandler();
        completeFabric("Настройки сохранены");
    })
    const make_session = document.getElementById("session-make") as HTMLDivElement;
    const make_session_undo = document.getElementById("session-make-undo") as HTMLButtonElement;
    make_session_undo.addEventListener("click", () => {
        make_session.classList.add("animation-1-end");
        setTimeout(() => {
            make_session.classList.add("disabled");
            make_session.classList.remove("animation-1-end")
        }, 250);
    })
    const bt = document.getElementById("sync-make") as HTMLButtonElement;
    bt.addEventListener("click", () => {
        make_session.classList.add("animation-1-start");
        make_session.classList.remove("disabled");
        setTimeout(() => {
            make_session.classList.remove("animation-1-start")
        }, 299);
    })


    const make_session_redo = document.getElementById("session-make-redo") as HTMLButtonElement;
    make_session_redo.addEventListener("click", async () => {
        make_session.classList.add("animation-1-end");
        setTimeout(() => {
            make_session.classList.add("disabled");
            make_session.classList.remove("animation-1-end")
        }, 250);
        await syncHandler();
    })
}

/**
 * Sets the width for the audio widget components
 */
function setupWidth() {


    const filter_name = document.getElementById("filters-name") as HTMLParagraphElement;
    const filter_album = document.getElementById("filters-album") as HTMLParagraphElement;
    const filter_artist = document.getElementById("filters-artist") as HTMLParagraphElement;

    const styles = document.styleSheets[1]
    const songs_div = document.getElementById("main-songs") as HTMLDivElement;

    const rect_filter_name = filter_name.getBoundingClientRect();
    const rect_filter_artist = filter_artist.getBoundingClientRect();
    const rect_filter_album = filter_album.getBoundingClientRect();


    const first = songs_div.firstChild as HTMLDivElement;
    for (let i = 0; i < styles.cssRules.length; i++) {
        const rule = styles.cssRules[i];
        if (rule instanceof CSSStyleRule) {
            if (rule.selectorText === `.main-song-name`) {
                const name = first.querySelector(".main-song-name") as HTMLParagraphElement;
                const rect = name.getBoundingClientRect();
                const delimiter = Math.abs(rect.left - rect_filter_name.left);
                rule.style.setProperty("width", `${rect_filter_name.width - delimiter}px`);

            } else if (rule.selectorText === `.main-song-artist`) {
                const name = first.querySelector(".main-song-artist") as HTMLParagraphElement;
                const rect = name.getBoundingClientRect();
                const delimiter = Math.abs(rect.left - rect_filter_artist.left);
                rule.style.setProperty("width", `${rect_filter_artist.width - delimiter}px`);

            } else if (rule.selectorText === `.main-song-album`) {
                const name = first.querySelector(".main-song-album") as HTMLParagraphElement;
                const rect = name.getBoundingClientRect();
                const delimiter = Math.abs(rect.left - rect_filter_album.left);
                rule.style.setProperty("width", `${rect_filter_album.width - delimiter}px`);

            }
        }
    }

}


/**
 * Sets the equalizer
 */
function setupEqualizer() {

    const context = new AudioContext();
    let source = context.createMediaElementSource(document.getElementById("main-audio") as HTMLAudioElement);
    const createFilter = function (frequency: number) {
        const filter = context.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = frequency;
        filter.Q.value = 1;
        filter.gain.value = 0;
        return filter;
    }


    const frequencies = [60, 170, 310, 1000, 6000, 12000];

    const filters = frequencies.map(createFilter);
    filters.reduce(function (prev, curr) {
        prev.connect(curr);
        return curr;
    });
    source.connect(filters[0]);
    filters[filters.length - 1].connect(context.destination);

    const equalizer_list = document.querySelector("#equalizer-list") as HTMLDivElement;
    const inputs = equalizer_list.querySelectorAll(".equalizer-option");

    const names = equalizer_list.querySelectorAll(".equalizer-option-name");
    names.forEach((item, i) => {
        item.textContent = `${frequencies[i]}`
    })


    inputs.forEach(function (item, i) {
        item.addEventListener('input', function (e) {
            const parent = item.parentNode as HTMLDivElement;
            const value = parent.querySelector(".equalizer-option-value") as HTMLParagraphElement;
            filters[i].gain.value = Number((e.target as HTMLInputElement).value);
            value.textContent = `${(e.target as HTMLInputElement).value}`
        });
    });


    const reset = document.getElementById("equalizer-reset") as HTMLButtonElement;
    reset.addEventListener("click", () => {
        const equalizer_list = document.querySelector("#equalizer-list") as HTMLDivElement;
        const inputs = equalizer_list.querySelectorAll(".equalizer-option");
        inputs.forEach((item, index) => {
            (item as HTMLInputElement).value = "0";
            const parent = item.parentNode as HTMLDivElement;
            const value = parent.querySelector(".equalizer-option-value") as HTMLParagraphElement;
            value.textContent = "0";

            filters[index].gain.value = 0;

        })
    })

}

