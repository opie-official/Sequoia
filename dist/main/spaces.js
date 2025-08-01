"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirectoryOfSpace = getDirectoryOfSpace;
const electron_1 = require("electron");
async function getDirectoryOfSpace() {
    const result = await electron_1.dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (result.canceled) {
        return [false, ""];
    }
    return [true, result.filePaths[0]];
}
