/**
 * @file render
 */



/**
 *
 */
document.addEventListener("DOMContentLoaded", async () => {
    const {__API__} = window;
    const settings = await __API__.getSettings();
    const root = document.getElementById("root") as HTMLDivElement;
    manager = new MainManager(__API__, settings, root);

    const closeButton = document.getElementById("title-close") as HTMLButtonElement;
    const wrapButton = document.getElementById("title-wrap") as HTMLButtonElement;
    const resizeButton = document.getElementById("title-resize") as HTMLButtonElement;


    closeButton.addEventListener("click", manager.api.closeWindow);
    wrapButton.addEventListener("click", manager.api.wrapWindow);
    resizeButton.addEventListener("click", manager.api.resizeWindow);

    await setupAudio();

    await setupFooter();
    await setupTheme();
    bindButtons();
    await mainHandler();
})

