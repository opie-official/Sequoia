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
    undo.addEventListener("click", async()=>{await gotoMain(root)});
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
    }else{
        await setCurrentSpaceLabel();
        await audioHandler();
    }


    const space = document.getElementById("main-spaces-logo") as HTMLDivElement;
    space.addEventListener("click", async () => {
        await gotoSpaces(root)
    })

}