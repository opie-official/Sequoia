"use strict";
/**
 *
 */
/**
 *
 */
async function setupFooter() {
    const volume_range = document.getElementById("volume");
    const audio = document.getElementById("main-audio");
    const duration = document.getElementById("duration");
    const p_duration = document.getElementById("footer-duration-value");
    const p_volume = document.getElementById("volume-value");
    const pause_button = document.getElementById("main-pause");
    const rewind_prev = document.getElementById("main-rewind-prev");
    const rewind_next = document.getElementById("main-rewind-next");
    const next_button = document.getElementById("main-next");
    const prev_button = document.getElementById("main-previous");
    const loop_button = document.getElementById("other-loop");
    const random_button = document.getElementById("other-random");
    pause_button.addEventListener("click", () => {
        const img = pause_button.querySelector("img");
        if (manager.paused) {
            try {
                audio.play();
            }
            catch {
            }
            manager.paused = false;
            img.src = "assets/images/play.svg";
        }
        else {
            try {
                audio.pause();
            }
            catch {
            }
            manager.paused = true;
            img.src = "assets/images/pause.svg";
        }
        console.log(manager.paused);
    });
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
        const list = document.getElementById("main-songs");
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
        showCurrentAudio();
    });
    prev_button.addEventListener("click", async () => {
        if (manager.settings.current_space === -1) {
            errorFabric("Никакое пространство не выбрано");
            return;
        }
        const list = document.getElementById("main-songs");
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
        showCurrentAudio();
    });
    loop_button.addEventListener("click", () => {
        manager.looped = !manager.looped;
        if (manager.looped) {
            loop_button.classList.add("clicked");
        }
        else {
            loop_button.classList.remove("clicked");
        }
    });
    random_button.addEventListener("click", () => {
        manager.randomed = !manager.randomed;
        if (manager.randomed) {
            random_button.classList.add("clicked");
        }
        else {
            random_button.classList.remove("clicked");
        }
    });
    volume_range.addEventListener("input", () => {
        p_volume.textContent = volume_range.value;
        audio.volume = parseInt(volume_range.value) / 100;
    });
    duration.addEventListener("input", () => {
        p_duration.textContent = secondsToTime(parseFloat(duration.value));
        audio.currentTime = parseInt(duration.value);
    });
    audio.addEventListener("playing", () => {
        duration.min = "0";
        duration.max = `${audio.duration}`;
    });
    audio.addEventListener("timeupdate", () => {
        duration.value = `${audio.currentTime}`;
        p_duration.textContent = secondsToTime(parseFloat(duration.value));
    });
    audio.addEventListener("ended", async () => {
        const list = document.getElementById("main-songs");
        if (manager.looped) {
            audio.currentTime = 0;
            audio.pause();
            setTimeout(async () => {
                await audio.play();
            }, 1000);
        }
        else if (manager.randomed) {
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
        }
        else {
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
        showCurrentAudio();
    });
    document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            pause_button.click();
        }
    });
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
        p.textContent = "Введите название пространства";
        input.id = "custom-prompt-input";
        accept.id = "custom-prompt-accept";
        accept.appendChild(document.createTextNode("Подтвердить"));
        reject.id = "custom-prompt-reject";
        reject.appendChild(document.createTextNode("Назад"));
        group.id = "custom-prompt-group";
        group.append(reject, accept);
        body.append(p, input, group);
        parent.append(body);
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
        body.remove();
        manager.settings.spaces.push({
            name: name,
            path: path[1],
            playlists: []
        });
        manager.settings.current_space = manager.settings.spaces.length - 1;
        manager.settings.spaces[manager.settings.current_space].playlists.push({
            name: "__global__",
            icon: "",
            songs: []
        });
        manager.saveSettings();
        UpdateManager.updateSpaces();
        await setupAudio();
    });
    /**
     * reject a creating new space
     */
    reject.addEventListener("click", function () {
        body.remove();
    });
}
