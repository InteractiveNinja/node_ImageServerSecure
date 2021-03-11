import nodeHtmlToImage, { } from 'node-html-to-image'
import { toFile } from 'qrcode'
import { join } from 'path'
import { readFileSync } from 'fs'
import { compile } from 'handlebars'




const FILENAME = "public/render/image.png"


export let createQR = (val: string): Promise<void> => {
    console.log("image create anfrage")

    return new Promise((res, rej) => {
        if (val == undefined) rej()

        toFile(FILENAME, val, (err: any) => {
            if (!err) {

                res()
            }
            rej()
        })
    })


}

export let createText = (val: string) : Promise<void> => {
    return new Promise((res,rej) =>{
        nodeHtmlToImage({
            output: "public/render/image.png",
            html: readFileSync("templates/text.html", "utf-8"),
            content: {text : val}
        }).then(() => res()).catch((e) => console.log(e));
    })
    
}
export let createImage = (val: string): Promise<void> => {
    return new Promise((res,rej) =>{

        nodeHtmlToImage({
            output: "public/render/image.png",
            html: readFileSync("templates/img.html", "utf-8"),
            content: {imgurl: val}
        }).then(() => res()).catch(() => rej());
    })
}


