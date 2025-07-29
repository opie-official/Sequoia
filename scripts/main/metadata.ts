import {readdir} from "fs/promises"
import {IPicture, parseFile} from "music-metadata"
import * as path from "path"

//@ts-ignore
import * as ff from "ffmetadata"
import * as fs from "node:fs";
import {UTILS, CHECK} from "./utils";


export interface Meta {
    name: string,
    artist: string,
    album: string,
    duration: number,
    path: string,
    pictures: string,
}

export interface ExtendedMeta {
    name: string,
    filename: string,
    description: string,
    icon: string,
    album: string,
    artist: string,
    executor: string,
    composer: string,
    genre: string,
    year: string,
    number: string,
    disk_number: string,
    filepath: string,
    path_to: string
}


export async function parseFiles(path_: string): Promise<Meta[]> {


    const files = await readdir(path_);
    const result: Meta[] = []
    for (const file of files) {
        const path_to = path.join(path_, file);
        try {
            const meta = await parseFile(path_to);

            const cover = meta.common.picture && meta.common.picture[0];
            let pic: string;
            if (cover) {
                const buffer = Buffer.isBuffer(cover.data) ? cover.data : Buffer.from(cover.data);
                const base64 = buffer.toString('base64');
                pic = `data:${cover.format};base64,${base64}`;
            } else {
                pic = ""
            }
            result.push({
                name: file.replace(".mp3", ""),//.length>25? file.replace(".mp3", "").slice(0, 22)+"..." : file.replace("mp3", ""),
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

// for (const file of files) {
//     if (path.extname(file) !== ".mp3") {
//         console.log(`continue :: ${path.extname(file)}`)
//         continue;
//     }
//     const path_to = path.join(path_, file);
//     // ff.read(path_to, (err: any, data: any) => {
//     //     if (err){
//     //         return;
//     //     }
//     //     const meta = {
//     //         name: data.title,
//     //         filename: file,
//     //         description: data.description | data.lyrics,
//     //         icon: "",
//     //         album: data.album,
//     //         artist: data.artist,
//     //         executor: data.performer,
//     //         composer: data.composer,
//     //         genre: data.genre,
//     //         year: data.date,
//     //         number: data.track,
//     //         disc_number: data.disc
//     //     }
//     //
//     //
//     // })
//
//     const tags: Tags = id3.read(path_to);
//     console.log(`${file} ::: ${tags}`)
//     const meta: ExtendedMeta = {
//         filename: file,
//         name: tags.title ?? "",
//         description: tags.comment ? tags.comment.text : "",
//         album: tags.album ?? "",
//         artist: tags.artist ?? "",
//         executor: "",
//         composer: tags.composer ?? "",
//         year: tags.year ?? "",
//         number: tags.trackNumber ?? "0",
//         disk_number: tags.partOfSet ?? "",
//         //@ts-ignore
//         icon: tags.image ? tags.image.imageBuffer.toString("base64") : "",
//         genre: tags.genre ?? ""
//     }
//
//     result.push(meta)
// }

export async function readMetaMP3(path_: string) {
    const files = await readdir(path_);

    const result: ExtendedMeta[] = []


    for (const file of files) {
        try {
            const path_to = path.join(path_, file);
            //
            // ff.read(path_to, {coverPath: path.join(__dirname, "../../preferences/cover.png")}, (err: any, data: any) => {
            //     if (err) {
            //         console.log("returned", err)
            //         return;
            //     }
            //     let icon =""
            //     fs.readFile(path.join(__dirname, "../../preferences/cover.png"), (err, data: any) => {
            //         if (err) {
            //             console.log("returned2", err)
            //         }
            //         icon = data.toString("base64");
            //     })
            const data = await parseFile(path_to);
            const icons = data.common.picture;
            let icon = ""

            if (icons) {
                icon = Buffer.from(icons[0].data).toString("base64");
            }

            const title = data.common.title ?? "";
            const desc = data.common.description ? data.common.description.join(" ") : "";
            const album = data.common.album ?? "";
            const artist = data.common.artist ?? "";
            const composer = data.common.composer ? data.common.composer.join(", ") : "";
            const track = data.common.track ? `${data.common.track.no}/${data.common.track.of}` : "";
            const year = data.common.year ? String(data.common.year) : "";
            const disc = data.common.disk ? `${data.common.disk.no}/${data.common.disk.of}` : "";
            const genre = data.common.genre ? data.common.genre.join(", ") : "";
            const meta: ExtendedMeta = {
                filepath: path_,
                filename: file,
                description: desc,
                name: title,
                album: album,
                artist: artist,
                executor: "",
                composer: composer,
                number: track,
                year: year,
                disk_number: disc,
                icon: icon,
                genre: genre,
                path_to: path_to
            }
            result.push(meta)
        } catch {
        }
    }
    return result;
}


export function saveMetaMP3(meta: ExtendedMeta): boolean {
    const res = CHECK.checkFFMPEG();
    if (!res){
        return false;
    }
    try {
        console.log("saving...")
        const tags = {
            title: meta.name,
            description: meta.description,
            artist: meta.artist,
            composer: meta.composer,
            album: meta.album,
            track: meta.number,
            disc: meta.disk_number,
            date: meta.year,
            genre: meta.genre
        };
        //console.log(JSON.stringify(meta))
        const data = meta.icon.replace("data:image/png;base64,", "");
        console.log(data)
        fs.writeFileSync(path.join(__dirname, "../../preferences/cover.jpg"), Buffer.from(data, "base64"))

        const options = {
            attachments: [path.join(__dirname, "../../preferences/cover.jpg")]
        };
        ff.write(meta.path_to, tags, options, (err: any) => {
            if (err) {
                console.log(err)
            } else {
                console.log("saved")

                console.log("outed")
                const ext = path.extname(meta.path_to)
                console.log("exited")
                const new_name = path.extname(path.join(meta.filepath, meta.filename)) === ext ?
                    path.join(meta.filepath, meta.filename)
                    : path.join(meta.filepath, meta.filename + ext);

                console.log(`${new_name}\n${meta.path_to}`)

                if (new_name !== meta.path_to) {

                    fs.rename(meta.path_to, new_name, (err: any) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("renamed")
                        }
                    });
                } else {
                    console.log("not renamed")
                }


            }
        })
        return true
    } catch (e) {
        console.log(e)
        return false;
    }

}