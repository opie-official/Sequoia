import {readdir} from "fs/promises"
import {IPicture, parseFile} from "music-metadata"
import * as path from "path"

export interface Meta {
    name: string,
    artist: string,
    album: string,
    duration: number,
    path: string,
    pictures: string,
}


export async function parseFiles(path_: string): Promise<Meta[]> {
    const files = await readdir(path_);
    const result: Meta[] = []
    for (const file of files) {
        const path_to = path.join(path_, file);
        try {
            const meta =await parseFile(path_to);
            const cover = meta.common.picture && meta.common.picture[0];
            let pic: string;
            if (cover){
                const buffer = Buffer.isBuffer(cover.data) ? cover.data : Buffer.from(cover.data);
                const base64 = buffer.toString('base64');
                pic = `data:${cover.format};base64:${base64}`;
            }else{
                pic = ""
            }
            console.log(meta);
            result.push({
                name: file.replace(".mp3", "").length>25? file.replace(".mp3", "").slice(0, 22)+"..." : file.replace("mp3", ""),
                artist: meta.common.artist as string,
                album: meta.common.album as string,
                duration: meta.format.duration as number,
                path: path_to,
                pictures: pic
            })
        } catch {
        }
    }
    return result;
}