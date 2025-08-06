import * as fs from "fs"
import {UTILS} from "./utils"
import * as path from "path"

export function importTheme(): [boolean, string] {
    const settings = UTILS.getSettings();


    if (!settings.theme) {
        return [false, ""]
    }

    const text = fs.readFileSync(path.join(__dirname, `../../preferences/themes/${settings.theme.replace(".json", "")}.json`), 'utf-8')
    return [true, text];

}


export function getThemes(): [boolean, string[]] {
    try {
        const files = fs.readdirSync(path.join(__dirname, `../../preferences/themes`));
        return [true, files];
    }catch{
        return [false, []]
    }
}