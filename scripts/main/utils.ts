import * as fs from "fs"
import * as path from "node:path";
import {get} from "animejs";


export namespace UTILS {

    export interface IPlaylist {
        name: string,
        icon: string,
        songs: string[],
    }

    export interface ISpace {
        name: string,
        path: string,
        playlists: IPlaylist[]
    }

    export interface ISettings {
        doctype: string,
        version: string,
        spaces: ISpace[],
        current_space: number
    }


    export function getSettings(): ISettings {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "../../preferences/settings.json"), "utf-8"));
    }

    export function createSpace(name: string, path: string) {

        const space: ISpace={
          name,
          path,
          playlists:[]
        };

        const settings = getSettings();
        settings.spaces.push(space);
        saveSettings(settings);
    }


    export function saveSettings(settings:ISettings){
        fs.writeFileSync(path.join(__dirname, "../../preferences/settings.json"), JSON.stringify(settings));
    }
    export function getAllSpaces(): ISpace[]{
        const settings = getSettings();
       return settings.spaces;
    }

    export function checkSpaces(): boolean {
        const settings = getSettings();
        const spaces = settings.spaces;
        if (spaces.length < 1) {
            return false;
        }
        return true;
    }
}