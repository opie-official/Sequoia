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
const promises_1 = require("fs/promises");
const music_metadata_1 = require("music-metadata");
const path = __importStar(require("path"));
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
                pic = `data:${cover.format};base64:${base64}`;
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
