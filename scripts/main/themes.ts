import * as fs from "fs"
import {UTILS} from "./utils"


export function importTheme(): [boolean, string]{
    const settings = UTILS.getSettings();


    if (!settings.theme){
        return [false, ""]
    }

    const text = fs.readFileSync(`preferences/themes/${settings.theme.replace(".json", "")}.json`, 'utf-8')
    return [true, text];

}