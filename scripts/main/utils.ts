import * as fs from "fs"
import * as path from "node:path";

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
        current_space: number,
        theme: string,
        show_start_page:boolean
    }

    /**
     * Reads a settings.json file and parse it into ISettings object
     */
    export function getSettings(): ISettings {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "../../preferences/settings.json"), "utf-8"));

    }

    /**
     * Creates a new space
     * @param name a name of new space
     * @param path a path to dir of new space
     */
    export function createSpace(name: string, path: string) {

        const space: ISpace = {
            name,
            path,
            playlists: []
        };

        const settings = getSettings();
        settings.spaces.push(space);
        saveSettings(settings);
    }

    /**
     * Save settings to settings.json file
     * @param settings a settings object
     */
    export function saveSettings(settings: ISettings) {
        fs.writeFileSync(path.join(__dirname, "../../preferences/settings.json"), JSON.stringify(settings));
    }

    /**
     * get all space from settings.json
     */
    export function getAllSpaces(): ISpace[] {
        const settings = getSettings();
        return settings.spaces;
    }


}
export namespace CHECK {

    /**
     * Checks files for integrity
     */
    export function startCheck() {

        const settings = checkSettings();

        if (!settings){
            const sets: UTILS.ISettings={
                doctype: "opie/seq",
                version:"",
                spaces: [],
                current_space: -1,
                theme: "dark",
                show_start_page: true
            }
            fs.writeFileSync(path.join(__dirname, "../../preferences/settings.json"),JSON.stringify(sets));
        }



    }

    /**
     * Check settings.json for integrity
     * @private
     */
    function checkSettings(): boolean {
        return fs.existsSync(path.join(__dirname, "../../preferences/settings.json"));

    }


    /**
     * Check FFMPEG for availability
     */
    export function checkFFMPEG() {
        const path_env = (process.env.Path as string) || (process.env.PATH as string);
        const dirs = path_env.split(path.delimiter);
        for (const dir of dirs){
            const full_path = path.join(dir, "ffmpeg" + (process.platform === "win32"? ".exe":""));
            if (fs.existsSync(full_path)) {
                return true;
            }
        }
        return false;

    }

}
