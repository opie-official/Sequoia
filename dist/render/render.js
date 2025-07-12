"use strict";
/**
 * @file render
 */
/**
 *
 */
document.addEventListener("DOMContentLoaded", async () => {
    const { __API__ } = window;
    const settings = await __API__.getSettings();
    const root = document.getElementById("root");
    manager = new MainManager(__API__, settings, root);
    const closeButton = document.getElementById("title-close");
    const wrapButton = document.getElementById("title-wrap");
    const resizeButton = document.getElementById("title-resize");
    closeButton.addEventListener("click", manager.api.closeWindow);
    wrapButton.addEventListener("click", manager.api.wrapWindow);
    resizeButton.addEventListener("click", manager.api.resizeWindow);
    await setupAudio();
    await setupFooter();
    bindButtons();
    await mainHandler(true);
});
