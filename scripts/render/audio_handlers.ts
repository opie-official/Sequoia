function audioFabric(index: number, meta: Meta, root: HTMLDivElement) {
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
    duration.appendChild(document.createTextNode((meta.duration?? 0).toString()));

    const group = document.createElement("div");
    group.classList.add("main-song-group");
    group.append(num, pic_outer, name, artist, album);
    body.append(group, duration);


    root.append(body);
}

/**
 *
 */
async function audioHandler() {
    const {__API__} = window;
    const list = document.getElementById("main-songs") as HTMLDivElement;
    const settings = await __API__.getSettings();
    const path: string = settings.spaces[settings.current_space].path;
    const result: Meta[] = await __API__.getMusicMeta(path);
    for (let i = 0; i < result.length; i++) {
        audioFabric(i, result[i], list);
    }
}