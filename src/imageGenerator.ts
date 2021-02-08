import nodeHtmlToImage, {} from 'node-html-to-image'
import { toFile } from 'qrcode'
import {join} from 'path'
import { readFileSync } from 'fs'
import {compile} from 'handlebars'




const FILENAME = join(__dirname + "/render/image.png")


export let createQR = (val: any, callback: { (err: any): void; (arg0: any): void }) => {
    toFile(FILENAME, val, (err: any) => {
        callback(err)
    })

}

export let createText = (val: any, callback: { (err: any): void; (arg0: boolean): void }) => {
    let html = compile(readFileSync(join(__dirname + "/templates/text.html"), "utf-8"))
    nodeHtmlToImage({
        output: join(__dirname + "/render/image.png"),
        html: html({ text: val })
    }).then(() => {
        callback(false)
    });
}
export let createImage = (val: any, callback: { (err: any): void; (arg0: boolean): void }) => {
    let html = compile(readFileSync(join(__dirname + "/templates/img.html"), "utf-8"))
    nodeHtmlToImage({
        output: join(__dirname + "/render/image.png"),
        html: html({ imgurl: val })
    }).then(() => {
        callback(false)
    });
}


