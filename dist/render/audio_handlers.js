"use strict";
function audioFabric(index, meta, root) {
    const body = document.createElement("div");
    body.classList.add("main-song");
    const num = document.createElement("p");
    num.classList.add("main-song-number");
    num.appendChild(document.createTextNode(`${index + 1}`));
    const pic_outer = document.createElement("div");
    pic_outer.classList.add("main-song-image-out");
    // if (meta.pictures) {
    //     const img = document.createElement("img");
    //     img.classList.add("main-song-image");
    //     img.src = meta.pictures;
    //     pic_outer.appendChild(img);
    // }
    const name = document.createElement("p");
    name.classList.add("main-song-name");
    name.appendChild(document.createTextNode(meta.name));
    const artist = document.createElement("p");
    artist.classList.add("main-song-artist");
    artist.appendChild(document.createTextNode(meta.artist));
    const album = document.createElement("p");
    album.classList.add("main-song-album");
    album.appendChild(document.createTextNode(meta.album));
    const duration = document.createElement("p");
    duration.classList.add("main-song-duration");
    duration.appendChild(document.createTextNode(secondsToDate(meta.duration ?? 0)));
    const group = document.createElement("div");
    group.classList.add("main-song-group");
    group.append(num, pic_outer, name, artist, album);
    body.append(group, duration);
    body.addEventListener("click", async () => {
        __current__ = meta.path;
        __current_index__ = index;
        await playAudio(meta.path);
    });
    root.append(body);
}
/**
 *
 */
async function audioHandler() {
    const { __API__ } = window;
    const list = document.getElementById("main-songs");
    const settings = await __API__.getSettings();
    const path = settings.spaces[settings.current_space].path;
    __meta__ = await __API__.getMusicMeta(path);
    for (let i = 0; i < __meta__.length; i++) {
        audioFabric(i, __meta__[i], list);
    }
}
/**
 *
 */
async function playAudio(path) {
    const play_button = document.getElementById("main-pause");
    const img = play_button.querySelector("img");
    img.src = "assets/images/play.svg";
    __paused__ = false;
    const audio = document.getElementById("main-audio");
    audio.src = path;
    coloringAudioDiv();
    setTimeout(async () => {
        await audio.play();
    }, 100);
}
function coloringAudioDiv() {
    const list = document.getElementById("main-songs");
    for (let i = 0; i < list.children.length; i++) {
        if (__current_index__ === i) {
            list.children[i].classList.add("main-coloring");
        }
        else {
            list.children[i].classList.remove('main-coloring');
        }
    }
}
function secondsToDate(seconds) {
    seconds = Math.round(seconds);
    const minutes = Math.floor(seconds / 60);
    const new_seconds = seconds - minutes * 60;
    return `${minutes}:${new_seconds}`;
}
