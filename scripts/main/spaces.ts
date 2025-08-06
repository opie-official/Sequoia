import {dialog} from "electron"


/**
 * Opens a dialog box to select a folder.
 */
export async function getDirectoryOfSpace(): Promise<[boolean, string]> {
    const result = await dialog.showOpenDialog({properties: ['openDirectory']})
    if (result.canceled) {
        return [false, ""]
    }
    return [true, result.filePaths[0]]
}