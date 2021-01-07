const express = require('express')
const app = express()
const path = require('path')
const nodeHtmlToImage = require('node-html-to-image')
const conf = require("@interactiveninja/config-reader")
const config = new conf.config(path.join(__dirname + "/config.json"))
const PORT = config.get('port')
const fs = require('fs')
const Handlebars = require("handlebars");
const QRCode = require('qrcode')
const bodyparser = require('body-parser')

const FILENAME = path.join(__dirname + "/render/image.png")
const templatePath = path.join(__dirname + "/templates/")

app.use(bodyparser.urlencoded({ extended: false }))

app.use(bodyparser.json())

app.get("/", (req, res) => {

    res.sendFile(FILENAME)
})
app.get("/good", (req, res) => {

    res.sendFile(templatePath + "/good.html")
})
app.get("/error", (req, res) => {

    res.sendFile(templatePath + "/error.html")
})
app.get("/error-pin", (req, res) => {

    res.sendFile(templatePath + "/error-pin.html")
})

app.get('/set', (req, res) => {

    res.sendFile(templatePath + "form.html")

})


app.post('/set', (req, res) => {

    // Variabeln
    let val = req.body.text
    let typ = req.body.typ
    let pw = req.body.pw

    //Pin Prüfung
    if (pw != config.get("pw")) {
        res.redirect("/error-pin")
        return
    }

    switch (typ) {
        case "qr":
            createQR(val, (err) => {
                if (err) {
                    res.redirect("error")
                    return
                }
                res.redirect("/good")
            })
            break;
        case "text":
            createText(val, (err) => {
                if (err) {
                    res.redirect("/error")
                    return
                }
                res.redirect("/good")
            })

            break;
        case "img":
            createImage(val, (err) => {
                if (err) {
                    res.redirect("/error")
                    return
                }
                res.redirect("/good")
            })
            break;
    }

})


let createQR = (val, callback) => {
    QRCode.toFile(FILENAME, val, (err) => {
        callback(err)
    })

}

let createText = (val, callback) => {
    let html = Handlebars.compile(fs.readFileSync(path.join(__dirname + "/templates/text.html"), "utf-8"))
    nodeHtmlToImage({
        output: './render/image.png',
        html: html({ text: val })
    }).then(() => {
        callback(false)
    });
}
let createImage = (val, callback) => {
    let html = Handlebars.compile(fs.readFileSync(path.join(__dirname + "/templates/img.html"), "utf-8"))
    nodeHtmlToImage({
        output: './render/image.png',
        html: html({ imgurl: val })
    }).then(() => {
        callback(false)
    });
}


app.listen(PORT, () => {

    console.log(`Server läuft auf Port ${PORT}`)

})