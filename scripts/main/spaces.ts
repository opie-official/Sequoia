import {dialog} from "electron"

export async function getDirectoryOfSpace(): Promise<[boolean, string]> {
    const result = await dialog.showOpenDialog({properties: ['openDirectory']})
    if (result.canceled) {
        return [false, ""]
    }
    return [true, result.filePaths[0]]
}