import {createServer} from 'https'
import express from 'express'
import { json, urlencoded } from 'body-parser'
import {config} from '@interactiveninja/config-reader'
import { readFileSync } from 'fs'

const app = express()
const configManager = config("config.json")

// Holt Port aus der Config
const PORT = configManager.get('port')


const FILENAME = "public/render/image.png"
const templatePath = "templates"
const sendFileOptions = {"root":"."}

// HTTPS Certificate
const privateKey = readFileSync("cert/privkey.pem");
const certificate = readFileSync("cert/cert.pem");


// Static Folders
app.use(express.static(("public")))

app.use(urlencoded({ extended: false }))

app.use(json())

app.get("/", (req, res) => {

    res.sendFile(FILENAME,sendFileOptions)
})

app.get("/show", (req, res) => {

    res.sendFile(templatePath + "/show.html",sendFileOptions)
})

app.get('/set', (req, res) => {

    res.sendFile(templatePath + "/form.html",sendFileOptions)

})


app.post('/set', (req, res) => {

    // Variabeln
    let val =  req.body.text 
    let typ =  req.body.typ
    let pw = req.body.pw

    if(val != undefined || typ !=  undefined || pw != undefined) {
        res.sendStatus(200)
    }


    
})


createServer({
    key: privateKey,
    cert: certificate
}, app).listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`)
});
