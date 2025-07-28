"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFiles = parseFiles;
exports.readMetaMP3 = readMetaMP3;
exports.saveMetaMP3 = saveMetaMP3;
const promises_1 = require("fs/promises");
const music_metadata_1 = require("music-metadata");
const path = __importStar(require("path"));
//@ts-ignore
const ff = __importStar(require("ffmetadata"));
const fs = __importStar(require("node:fs"));
async function parseFiles(path_) {
    const files = await (0, promises_1.readdir)(path_);
    const result = [];
    for (const file of files) {
        const path_to = path.join(path_, file);
        try {
            const meta = await (0, music_metadata_1.parseFile)(path_to);
            const cover = meta.common.picture && meta.common.picture[0];
            let pic;
            if (cover) {
                const buffer = Buffer.isBuffer(cover.data) ? cover.data : Buffer.from(cover.data);
                const base64 = buffer.toString('base64');
                pic = `data:${cover.format};base64,${base64}`;
            }
            else {
                pic = "";
            }
            result.push({
                name: file.replace(".mp3", ""), //.length>25? file.replace(".mp3", "").slice(0, 22)+"..." : file.replace("mp3", ""),
                artist: meta.common.artist,
                album: meta.common.album,
                duration: meta.format.duration,
                path: path_to,
                pictures: pic
            });
        }
        catch {
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
async function readMetaMP3(path_) {
    const files = await (0, promises_1.readdir)(path_);
    const result = [];
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
            const data = await (0, music_metadata_1.parseFile)(path_to);
            const icons = data.common.picture;
            let icon = "";
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
            const meta = {
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
            };
            result.push(meta);
        }
        catch {
        }
    }
    return result;
}
function saveMetaMP3(meta) {
    console.log("saving...");
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
    console.log(data);
    fs.writeFileSync(path.join(__dirname, "../../preferences/cover.jpg"), Buffer.from(data, "base64"));
    const options = {
        attachments: [path.join(__dirname, "../../preferences/cover.jpg")]
    };
    ff.write(meta.path_to, tags, options, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("saved");
            console.log("outed");
            const ext = path.extname(meta.path_to);
            console.log("exited");
            const new_name = path.extname(path.join(meta.filepath, meta.filename)) === ext ?
                path.join(meta.filepath, meta.filename)
                : path.join(meta.filepath, meta.filename + ext);
            console.log(`${new_name}\n${meta.path_to}`);
            if (new_name !== meta.path_to) {
                fs.rename(meta.path_to, new_name, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("renamed");
                    }
                });
            }
            else {
                console.log("not renamed");
            }
        }
    });
}
