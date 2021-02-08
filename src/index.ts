import {join} from 'path'
import {createServer} from 'https'
import express from 'express'
import {createImage,createQR,createText} from './imageGenerator'
import { json, urlencoded } from 'body-parser'
import {config} from '@interactiveninja/config-reader'
import { readFileSync } from 'fs'

const app = express()
const configManager = config(join(__dirname + "/config.json"))

// Holt Port aus der Config
const PORT = configManager.get('port')

// Path Konstante
const templatePath = join(__dirname + "/templates/")
const FILENAME = join(__dirname + "/render/image.png")


// HTTPS Certificate
const privateKey = readFileSync(join(__dirname + "/cert/privkey.pem"));
const certificate = readFileSync(join(__dirname + "/cert/cert.pem"));


// Static Folders
app.use(express.static(join(__dirname +  "/public")))
app.use(express.static(join(__dirname + "/render")))

app.use(urlencoded({ extended: false }))

app.use(json())

app.get("/", (req, res) => {

    res.sendFile(FILENAME)
})

app.get("/show", (req, res) => {

    res.sendFile(templatePath + "/show.html")
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
    if (pw != configManager.get("pw")) {
        res.redirect("/error-pin")
        return
    }

    switch (typ) {
        case "qr":
            createQR(val, (err: any) => {
                if (err) {
                    res.redirect("error")
                    return
                }
                res.redirect("/good")
            })
            break;
        case "text":
            createText(val, (err: any) => {
                if (err) {
                    res.redirect("/error")
                    return
                }
                res.redirect("/good")
            })

            break;
        case "img":
            createImage(val, (err: any) => {
                if (err) {
                    res.redirect("/error")
                    return
                }
                res.redirect("/good")
            })
            break;
    }

})


createServer({
    key: privateKey,
    cert: certificate
}, app).listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`)
});
