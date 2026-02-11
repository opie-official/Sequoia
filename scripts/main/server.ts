import * as net from "net"
import {BrowserWindow} from "electron";
import * as os from "os"

let server: net.Server;
let client: net.Socket;
let connection: net.Socket;
let is_connect = false;

function getLocalIp(){
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        //@ts-ignore
        for (const iface of interfaces[name]) {
            if (iface.family==="IPv4" && !iface.internal){
                return iface.address;
            }
        }
    }

    return "127.0.0.1";
}



export function createServer(win: BrowserWindow) {
    server = net.createServer((socket) => {

    })

    server.on("connection", (socket) => {
        if (!is_connect){

        }else{
            socket.end();
        }

    })

    const host = getLocalIp();
    server.listen(8080, host, () => {
        // win.webContents.send("system:server", [true, HashHost(`${server.address()}:${8080}`)]);
    });
    console.log(server.address())


    return HashHost(`${host}:${8080}`)

}


const keys = {
    0: [1053, 7229, 1771, 8745, 8272, 8559, 4366, 8567, 5984, 4108, 2595, 2287, 6835, 4145, 5939, 4272, 8335, 1221, 3054, 5807],
    1: [2404, 7208, 4169, 2203, 3772, 3755, 8579, 8558, 5182, 1450, 4103, 5907, 6919, 3375, 6872, 2387, 7934, 3340, 6791, 6579],
    2: [5010, 7125, 8511, 7403, 2636, 3301, 7749, 2389, 1422, 6075, 7457, 8771, 6282, 8008, 2712, 6302, 1047, 1749, 3022, 2706],
    3: [5506, 6192, 4522, 6222, 3533, 6409, 7988, 7142, 7772, 4620, 8045, 2155, 7057, 1695, 8642, 6088, 3355, 6833, 4450, 8602],
    4: [4068, 8816, 6225, 6139, 7913, 4447, 5046, 2915, 8337, 5942, 8328, 8732, 4709, 6892, 2039, 4071, 8347, 7873, 2422, 5588],
    5: [4161, 1888, 1385, 4275, 2190, 5075, 6408, 5739, 3762, 3585, 8384, 1585, 1229, 8898, 8261, 1409, 6857, 8068, 6205, 4074],
    6: [7156, 6014, 8817, 8777, 6773, 4926, 6042, 1693, 8806, 2505, 1860, 1023, 4260, 7474, 5758, 5443, 3024, 8877, 8634, 5024],
    7: [8224, 5640, 1203, 8459, 2846, 1876, 6748, 1304, 6598, 4141, 6865, 4439, 2977, 3924, 8481, 5685, 8664, 8597, 5665, 3715],
    8: [5879, 2359, 1040, 1435, 3864, 1994, 6442, 1895, 6045, 2969, 2238, 6754, 8235, 7870, 6887, 5586, 1915, 1763, 2429, 6595],
    9: [5333, 2591, 3514, 2007, 3261, 7939, 1602, 7372, 2850, 1928, 8046, 4648, 4079, 7321, 5193, 7201, 8274, 8870, 8065, 7718],

}

/**
 *
 *
 */
export function HashHost(host: string) {
    console.log(host)
    const [ip, port] = host.split(":");
    const octets = ip.split(".");
    const new_octets = octets.map((el) => {
        let res = el;
        while (res.length < 3) {
            res = "0" + res;
        }
        console.log((el), (res))
        return res;
    })

    let new_port = port;
    while (new_port.length < 5) {
        new_port = "0" + new_port;
    }

    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

    let res = ``

    const new_host = [...new_octets, new_port];
    console.log(JSON.stringify(new_host))
    console.log(JSON.stringify(new_octets))
    new_host.forEach((val: string) => {
        let str = ""
        for (let i of val) {
            console.log(i)
            // @ts-ignore
            str += keys[parseInt(i)][rand(0, 20)];
        }
        res += str;
    })

    return res;

}


export function deHashHost(hash: string): [string, number] {
    const array = []
    let temp = ""
    for (let i = 0; i < hash.length; i++) {
        if (temp.length === 4) {
            array.push(temp)
            temp = ""
        }
        temp += hash[i];

    }
    array.push(temp)


    const port_octets = array.slice(12);
    const ip_octets = array.slice(0, 12);
    console.log(port_octets, ip_octets)

    let ip_array: string[] = []
    let times = 0;
    let num = ""

    ip_octets.forEach((el) => {
        for (const key in keys) {


            // @ts-ignore
            if (keys[key].includes(parseInt(el))) {
                num += key;
                break;
            }
        }
        times++;
        if (times >= 3) {
            ip_array.push(num);
            num = ""
            times = 0;
        }
    })
    let ip = ip_array.join(".")
    let port = "";

    port_octets.forEach((el) => {
        let num = ""
        for (const key in keys) {
            // @ts-ignore
            if (keys[key].includes(parseInt(el))) {
                num = key;
                break;
            }
        }
        port += num;

    })

    return [ip, parseInt(port)]


}