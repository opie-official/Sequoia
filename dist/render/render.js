"use strict";
let __close_button__;
let __resize_button__;
let __wrap_button__;
let __body__;
let root;
/**
 *
 */
function createSpace() {
    const songs_field = document.getElementById("main-songs");
    songs_field.innerHTML = `
<div style="position: relative; display: flex; align-items: center; justify-content: center;flex-direction: column; top: 40%">
<p style="color: #BABABA;">Песни в текущем пространстве не найдены.</p>
<br>
<p style="color: #BABABA">Для управления пространствами нажмите на красный квадрат сверху</p>
</div>
`;
}
/**
 *
 * @param root
 */
async function gotoSpaces(root) {
    const { __API__ } = window;
    const result = await __API__.getPage("spaces.html");
    if (result[0]) {
        root.innerHTML = result[1];
    }
    const spaces = await __API__.getAllSpaces();
    await paintSpaces(spaces);
    const newSpace = document.getElementById("space-new");
    newSpace.addEventListener("click", () => {
        createSpaceProcess();
    });
    const undo = document.getElementById("undo");
    undo.addEventListener("click", async () => {
        await gotoMain(root);
    });
}
/**
 *
 */
document.addEventListener('DOMContentLoaded', async () => {
    const { __API__ } = window;
    __body__ = document.body;
    __close_button__ = document.getElementById("title-close");
    __resize_button__ = document.getElementById("title-resize");
    __wrap_button__ = document.getElementById("title-wrap");
    __close_button__.addEventListener("click", __API__.closeWindow);
    __resize_button__.addEventListener("click", __API__.resizeWindow);
    __wrap_button__.addEventListener("click", __API__.wrapWindow);
    root = document.getElementById("root");
    await gotoMain(root);
});
/**
 *
 */
async function setCurrentSpaceLabel() {
    const { __API__ } = window;
    const p = document.getElementById("main-spaces-name");
    const settings = await __API__.getSettings();
    p.appendChild(document.createTextNode(settings.spaces[settings.current_space].name));
}
/**
 *
 * @param root
 */
async function gotoMain(root) {
    const { __API__ } = window;
    const result = await __API__.getPage("mainpage.html");
    if (result[0]) {
        root.innerHTML = result[1];
    }
    const hasSpaces = await __API__.getAllSpaces();
    if (hasSpaces.length == 0) {
        createSpace();
    }
    else {
        await setCurrentSpaceLabel();
        await audioHandler();
    }
    const space = document.getElementById("main-spaces-logo");
    space.addEventListener("click", async () => {
        await gotoSpaces(root);
    });
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
    p_volume.textContent = volume_range.value;
    volume_range.addEventListener("input", () => {
        p_volume.textContent = volume_range.value;
        audio.volume = parseInt(volume_range.value) / 100;
    });
    audio.addEventListener("timeupdate", () => {
        duration.value = `${audio.currentTime}`;
        p_duration.textContent = `${Math.round(audio.currentTime)}`;
    });
    audio.addEventListener("playing", () => {
        duration.max = `${audio.duration}`;
    });
    duration.addEventListener("input", () => {
        // audio.pause();
        audio.currentTime = parseFloat(duration.value);
    });
    duration.addEventListener("change", () => {
        // audio.play()
    });
    pause_button.addEventListener("click", () => {
        const img = pause_button.querySelector("img");
        if (__paused__) {
            audio.play();
            __paused__ = false;
            img.src = "assets/images/play.svg";
        }
        else {
            audio.pause();
            __paused__ = true;
            img.src = "assets/images/pause.svg";
        }
    });
    rewind_next.addEventListener("click", () => {
        audio.currentTime += 10;
    });
    rewind_prev.addEventListener("click", () => {
        audio.currentTime -= 10;
    });
    next_button.addEventListener("click", () => {
        __current_index__++;
        if (__current_index__ > __meta__.length - 1) {
            __current_index__ = 0;
        }
        __current__ = __meta__[__current_index__].path;
        playAudio(__current__);
    });
    prev_button.addEventListener("click", () => {
        __current_index__--;
        if (__current_index__ < 0) {
            __current_index__ = __meta__.length - 1;
        }
        __current__ = __meta__[__current_index__].path;
        playAudio(__current__);
    });
    audio.addEventListener("ended", () => {
        if (__looped__) {
            setTimeout(() => {
                playAudio(__current__);
            }, 1000);
        }
        else if (__randomed__) {
            __current_index__ = Math.floor(Math.random() * (__meta__.length - 1));
            __current__ = __meta__[__current_index__].path;
            setTimeout(() => {
                playAudio(__current__);
            }, 1000);
        }
        else {
            __current_index__++;
            if (__current_index__ > __meta__.length - 1) {
                __current_index__ = 0;
            }
            __current__ = __meta__[__current_index__].path;
            setTimeout(() => {
                playAudio(__current__);
            }, 1000);
        }
    });
    loop_button.addEventListener("click", () => {
        __looped__ = !__looped__;
        if (__looped__) {
            loop_button.classList.add("lighted");
        }
        else {
            loop_button.classList.remove("lighted");
        }
    });
    random_button.addEventListener("click", () => {
        __randomed__ = !__randomed__;
        if (__randomed__) {
            random_button.classList.add("lighted");
        }
        else {
            random_button.classList.remove("lighted");
        }
    });
}
