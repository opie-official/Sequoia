let __close_button__: HTMLButtonElement;
let __resize_button__: HTMLButtonElement;
let __wrap_button__: HTMLButtonElement;
let __body__: HTMLBodyElement;
let root: HTMLDivElement;


/**
 *
 */
function createSpace() {
    const songs_field = document.getElementById("main-songs") as HTMLDivElement;
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
async function gotoSpaces(root: HTMLDivElement) {
    const {__API__} = window;
    const result = await __API__.getPage("spaces.html");
    if (result[0]) {
        root.innerHTML = result[1];
    }
    const spaces = await __API__.getAllSpaces();

    await paintSpaces(spaces);
    const newSpace = document.getElementById("space-new") as HTMLButtonElement;
    newSpace.addEventListener("click", () => {
        createSpaceProcess()
    });

    const undo = document.getElementById("undo") as HTMLButtonElement;
    undo.addEventListener("click", async () => {
        await gotoMain(root)
    });
}

/**
 *
 */
document.addEventListener('DOMContentLoaded', async () => {
    const {__API__} = window;
    __body__ = document.body as HTMLBodyElement;
    __close_button__ = document.getElementById("title-close") as HTMLButtonElement;
    __resize_button__ = document.getElementById("title-resize") as HTMLButtonElement;
    __wrap_button__ = document.getElementById("title-wrap") as HTMLButtonElement;


    __close_button__.addEventListener("click", __API__.closeWindow);
    __resize_button__.addEventListener("click", __API__.resizeWindow);
    __wrap_button__.addEventListener("click", __API__.wrapWindow);

    root = document.getElementById("root") as HTMLDivElement;

    await gotoMain(root);
})

/**
 *
 */
async function setCurrentSpaceLabel() {
    const {__API__} = window;
    const p = document.getElementById("main-spaces-name") as HTMLParagraphElement;
    const settings = await __API__.getSettings();

    p.appendChild(document.createTextNode(settings.spaces[settings.current_space].name))
}

/**
 *
 * @param root
 */
async function gotoMain(root: HTMLDivElement) {
    const {__API__} = window;

    const result = await __API__.getPage("mainpage.html");
    if (result[0]) {
        root.innerHTML = result[1];
    }

    const hasSpaces = await __API__.getAllSpaces();
    if (hasSpaces.length == 0) {
        createSpace();
    } else {
        await setCurrentSpaceLabel();
        await audioHandler();
    }


    const space = document.getElementById("main-spaces-logo") as HTMLDivElement;
    space.addEventListener("click", async () => {
        await gotoSpaces(root)
    })

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
    p_volume.textContent = volume_range.value;
    volume_range.addEventListener("input", () => {
        p_volume.textContent = volume_range.value;


        audio.volume = parseInt(volume_range.value) / 100;
    })

    audio.addEventListener("timeupdate", () => {
        duration.value = `${audio.currentTime}`;
        p_duration.textContent = `${Math.round(audio.currentTime)}`;

    })
    audio.addEventListener("playing", () => {
        duration.max = `${audio.duration}`;
    })

    duration.addEventListener("input", () => {
        audio.currentTime = parseFloat(duration.value)
    })

    pause_button.addEventListener("click", () => {

        const img = pause_button.querySelector("img") as HTMLImageElement;
        if (__paused__) {
            audio.play();
            __paused__ = false;
            img.src = "assets/images/play.svg"
        } else {
            audio.pause();
            __paused__ = true;
            img.src = "assets/images/pause.svg"
        }


    })

    rewind_next.addEventListener("click", () => {
        audio.currentTime += 10;
    })
    rewind_prev.addEventListener("click", () => {
        audio.currentTime -= 10;
    })


    next_button.addEventListener("click", () => {
        __current_index__++;
        if (__current_index__ > __meta__.length - 1) {
            __current_index__ = 0;
        }
        __current__ = __meta__[__current_index__].path;
        playAudio(__current__);
    })

    prev_button.addEventListener("click", () => {
        __current_index__--;
        if (__current_index__ < 0) {
            __current_index__ = __meta__.length - 1;
        }
        __current__ = __meta__[__current_index__].path;
        playAudio(__current__);
    })


    audio.addEventListener("ended", () => {
        if (__looped__) {
            setTimeout(() => {
                playAudio(__current__)
            }, 1000);
        } else if (__randomed__) {
            __current_index__ = Math.floor(Math.random() * (__meta__.length - 1));
            __current__ = __meta__[__current_index__].path;
            setTimeout(() => {
                playAudio(__current__);
            }, 1000);
        } else {
            __current_index__++;
            if (__current_index__ > __meta__.length - 1) {
                __current_index__ = 0;
            }
            __current__ = __meta__[__current_index__].path;
            setTimeout(() => {
                playAudio(__current__);
            }, 1000);
        }


    })

    loop_button.addEventListener("click", ()=>{
        __looped__ = !__looped__;
        if (__looped__){
            loop_button.classList.add("lighted");
        }else{
            loop_button.classList.remove("lighted");
        }
    })

    random_button.addEventListener("click", ()=>{
        __randomed__ = !__randomed__
        if (__randomed__){
            random_button.classList.add("lighted");
        }else{
            random_button.classList.remove("lighted");
        }
    })


}


