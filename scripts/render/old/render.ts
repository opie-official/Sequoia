let __close_button__: HTMLButtonElement;
let __resize_button__: HTMLButtonElement;
let __wrap_button__: HTMLButtonElement;


/**
 *
 */
document.addEventListener('DOMContentLoaded', async () => {
    const {__API__} = window;
    const root = document.getElementById("root") as HTMLDivElement;

    manager = new Manager(__API__, await __API__.getSettings(), root);

    updateManager = new UpdateManager();

    __close_button__ = document.getElementById("title-close") as HTMLButtonElement;
    __resize_button__ = document.getElementById("title-resize") as HTMLButtonElement;
    __wrap_button__ = document.getElementById("title-wrap") as HTMLButtonElement;


    __close_button__.addEventListener("click", __API__.closeWindow);
    __resize_button__.addEventListener("click", __API__.resizeWindow);
    __wrap_button__.addEventListener("click", __API__.wrapWindow);

    await mainHandler();
    await setUpFooter();

})

