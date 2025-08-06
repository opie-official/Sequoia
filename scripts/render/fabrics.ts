/**
 * @file fabrics
 * @author OPIE
 */


/**
 * Create a space widget
 * @param index {number} an index of space
 * @param space {ISpace} an object with properties of space
 * @returns {HTMLDivElement} a new widget
 */
function spaceFabric(index: number, space: ISpace): HTMLDivElement {
    const {name, path} = space;
    const body = document.createElement('div');
    const _number = document.createElement("p");
    const _name = document.createElement("p");
    const _path = document.createElement("p");

    body.classList.add("space-element");
    _number.classList.add("space-element-number", "title");
    _number.appendChild(document.createTextNode(index.toString()));
    _name.classList.add("space-element-name", "title");
    _name.appendChild(document.createTextNode(name));
    _path.classList.add("space-element-path", "title");
    _path.appendChild(document.createTextNode(path));


    body.append(_number, _name, _path);
    return body;


}

/**
 * Create an audio-widget that user can choose for append to a new playlist
 * @param index {number} an index of audio
 * @param meta {Meta} an object with properties of audio
 * @returns {HTMLDivElement} a new widget
 */
function playlistsAudioFabric(index: number, meta: Meta): HTMLDivElement {
    const body = document.createElement("div");
    const checkbox = document.createElement("input");
    const index_ = document.createElement("p");
    const div = document.createElement("div");
    const name = document.createElement("p");
    const artist = document.createElement("p");
    const album = document.createElement("p");
    const duration = document.createElement("p");
    const group = document.createElement("div");
    const img = document.createElement("img");
    body.classList.add("playlist-body");

    checkbox.type = "checkbox";
    checkbox.classList.add("playlist-body-checkbox");

    index_.classList.add("playlist-body-index", "title");
    index_.textContent = `${index}`;

    div.classList.add("playlist-body-pic-out");

    img.src = meta.pictures ? meta.pictures : "assets/images/playlist_logo.svg";
    div.append(img)

    name.classList.add("playlist-body-name", "title");
    name.textContent = `${meta.name}`;

    artist.classList.add("playlist-body-artist", "title");
    artist.textContent = `${meta.artist}`;

    album.classList.add("playlist-body-album", "title")
    album.textContent =`${meta.album}`;

    duration.classList.add("playlist-body-duration", "title");
    duration.textContent = secondsToTime(meta.duration);


    group.classList.add("playlist-body-group");
    group.append(checkbox, index_, div, name, artist, album)

    body.append(group, duration);

    return body;

}



/**
 * Create a playlist-widget on mainpage
 * @param meta {IPlaylist} an object with properties of playlist
 * @param is_main deprecated argument
 * @returns {HTMLDivElement} a new widget
 */
function playlistOnMainFabric(meta: IPlaylist, is_main = false): HTMLDivElement {

    const body = document.createElement("div");
    const div = document.createElement("div");
    const name = document.createElement("p");
    const amount = document.createElement("p");
    if (meta.icon) {
        const pic = document.createElement("img");
        pic.classList.add("main-playlist-body-pic");
        pic.src = meta.icon;
        div.append(pic);
    }

    body.classList.add("main-playlist-body");

    div.classList.add("main-playlist-body-pic-out");

    name.classList.add("main-playlist-name", "title");
    name.textContent = meta.name;

    amount.classList.add("main-playlist-amount", "sub-title");

    if (is_main || meta.name === "__global__") {
        name.textContent = "Все песни"
        amount.textContent = manager.all_audio.length.toString() + " аудио";
    } else {

        amount.textContent = meta.songs.length + " аудио";
    }

    body.append(div, name, amount);
    return body;
}

/**
 * Create an audio widget
 * @param index {number} an index of audio
 * @param meta {Meta} an object with properties of audio
 * @returns {HTMLDivElement} a new widget
 *
 */
function audioFabric(index: number, meta: Meta): HTMLDivElement {


    const body = document.createElement("div");
    body.classList.add("main-song");
    const num = document.createElement("p");
    num.classList.add("main-song-number", "title");
    num.appendChild(document.createTextNode(`${index + 1}`));
    const pic_outer = document.createElement("div");
    pic_outer.classList.add("main-song-image-out");
    const img = document.createElement("img");
    img.classList.add("main-song-image");
    if (meta.pictures) {
        img.src = meta.pictures;
    } else {
        img.src = "assets/images/playlist_logo.svg";
    }
    pic_outer.appendChild(img);

    const name = document.createElement("p");
    name.classList.add("main-song-name", "title");
    name.textContent = meta.name;
    const artist = document.createElement("p");
    artist.classList.add("main-song-artist", "title");
    artist.textContent = meta.artist;
    const album = document.createElement("p");
    album.classList.add("main-song-album", "title");
    album.textContent = meta.album;
    const duration = document.createElement("p");
    duration.classList.add("main-song-duration", "title");
    duration.textContent = secondsToTime(meta.duration ?? 0);

    const group = document.createElement("div");
    group.classList.add("main-song-group");
    group.append(num, pic_outer, name, artist, album);
    body.append(group, duration);

    return body;
}

/**
 * Create a temporary message about error
 * @param name {string} a message of error
 */
function errorFabric(name: string) {
    const body = document.createElement("div");
    body.classList.add("error");
    const p = document.createElement("p");
    p.classList.add("error-p");
    p.textContent = name;
    body.append(p);
    manager.root.append(body);


    setTimeout(() => {
        body.remove();
    }, 3000);
}




/**
 * Create a temporary message about completed action
 * @param name {string} a message of error
 */
function completeFabric(name: string) {
    const body = document.createElement("div");
    body.classList.add("complete");
    const p = document.createElement("p");
    p.classList.add("complete-p");
    p.textContent = name;
    body.append(p);
    manager.root.append(body);


    setTimeout(() => {
        body.remove();
    }, 3000);
}
