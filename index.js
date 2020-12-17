const express = require('express')
const app = express()
const path = require('path')
const nodeHtmlToImage = require('node-html-to-image')
const conf = require("@interactiveninja/config-reader")
const config = new conf.config(path.join(__dirname + "/config.json"))
const PORT = config.get('port')
const fs = require('fs')
const Handlebars = require("handlebars");
var bodyParser = require('body-parser')
const QRCode = require('qrcode')
const request = require('request');
const sharp = require('sharp')

const FILENAME = path.join(__dirname + "/image.png")
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


app.get("/", (req, res) => {

  res.sendFile(FILENAME)
})

app.get('/set', (_, res) => {

  res.sendFile(path.join(__dirname + "/form.html"))

})

app.post('/set', (req, res) => {

  let val = req.body.text
  let typ = req.body.typ
  let pw = req.body.pw
  
  if(pw != config.get("pw")) {
    res.redirect("/")
    return 
  }
  let html = Handlebars.compile(fs.readFileSync(path.join(__dirname + "/text.html"), "utf-8"))
  if (val == "ninja") {
    fs.copyFileSync(path.join(__dirname + "/error.png"), FILENAME)
    return

  }
  switch (typ) {
    case "qr":
      QRCode.toFile(FILENAME, val).then(() => {
        res.redirect("/")
      })
      break;
    case "text":
      nodeHtmlToImage({
        output: './image.png',
        html: html({ text: val })
      }).then(() => {
        res.redirect("/")
      });
      break;
    case "img":
      download(val, FILENAME+'1', function (err) {
        sharp(FILENAME+'1').resize({ height: 300, width: 400 }).toFile(FILENAME)
          .then(function (FILENAME) {
            // fs.unlinkSync(path.join(FILENAME + "1"))
            res.redirect("/")
          }).catch(function (err) {
            console.log(err);
          });
      });
      break;
  }

})

let download = (uri, filename, callback) => {
  request.head(uri, (err, res, body) => {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


app.listen(PORT, () => {

  console.log(`Server läuft auf Port ${PORT}`)

})