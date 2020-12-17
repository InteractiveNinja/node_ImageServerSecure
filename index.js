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

app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(bodyParser.json())
 

app.get("/", (req, res) => {

  res.sendFile(path.join(__dirname + "/image.png"))
})

app.get('/set',(_,res) => {

  res.sendFile(path.join(__dirname + "/form.html"))

})

app.post('/set',(req,res) =>{

  let val = req.body.text
  let typ = req.body.typ
  let html = Handlebars.compile(fs.readFileSync(path.join(__dirname + "/text.html"), "utf-8"))
  if(val == "ninja") {
    fs.copyFileSync(path.join(__dirname + "/error.png"),path.join(__dirname + "/image.png"))
    return

  }
  switch (typ) {
    case "qr":
      QRCode.toFile(path.join(__dirname + "/image.png"),val).then(() =>{
        res.redirect("/")
      })
      break;
    case "text":
      nodeHtmlToImage({
        output: './image.png',
        html: html({text:val})
      }).then(() => {
      res.redirect("/")
      });
      break;
  }
  
})



app.listen(PORT, () => {

  console.log(`Server läuft auf Port ${PORT}`)

})