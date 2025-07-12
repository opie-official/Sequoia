/**
 * @file fabrics
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
    _number.classList.add("space-element-number");
    _number.appendChild(document.createTextNode(index.toString()));
    _name.classList.add("space-element-name");
    _name.appendChild(document.createTextNode(name));
    _path.classList.add("space-element-path");
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

    body.classList.add("playlist-body");

    checkbox.type = "checkbox";
    checkbox.classList.add("playlist-body-checkbox");

    index_.classList.add("playlist-body-index");
    index_.textContent = cutText(index.toString(), 15);

    div.classList.add("playlist-body-pic-out");

    name.classList.add("playlist-body-name");
    name.textContent = cutText(`${meta.name}`, 15);

    artist.classList.add("playlist-body-artist");
    artist.textContent = cutText(`${meta.artist}`, 15)

    album.classList.add("playlist-body-album")
    album.textContent = cutText(`${meta.album}`, 15);

    duration.classList.add("playlist-body-duration");
    duration.textContent = cutText(secondsToTime(meta.duration), 15);


    group.classList.add("playlist-body-group");
    group.append(checkbox, index_, div, name, artist, album)

    body.append(group, duration);

    return body;

}

/**
 * Cut text
 * @param text {string} a text that wil be cut
 * @param max {max} an index of last char in result
 * @returns {string} a cut up text
 */
function cutText(text: string, max: number): string {
    return text.length > max ? text.substring(0, max) + "..." : text;
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

    body.classList.add("main-playlist-body");

    div.classList.add("main-playlist-body-pic-out");

    name.classList.add("main-playlist-name");
    name.textContent = meta.name;

    amount.classList.add("main-playlist-amount");

    if (is_main || meta.name === "__global__") {
        name.textContent = "Все песни"
        amount.textContent = manager.all_audio.length.toString() + " аудио";
    } else {

        amount.textContent = meta.songs.length + " аудио";
    }

    console.log(`playlist: ${JSON.stringify(meta)}:: amount: ${amount.textContent} :: ${manager.all_audio}`)
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
    name.textContent = cutText(meta.name, 20);
    const artist = document.createElement("p");
    artist.classList.add("main-song-artist");
    artist.appendChild(document.createTextNode(meta.artist));
    const album = document.createElement("p");
    album.classList.add("main-song-album");
    album.appendChild(document.createTextNode(meta.album));
    const duration = document.createElement("p");
    duration.classList.add("main-song-duration");
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

