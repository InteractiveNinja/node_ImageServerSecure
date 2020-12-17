const express = require('express')
const app = express()
const path = require('path')


app.get("/", (req, res) => {


    var figlet = require('figlet');

    figlet.text('Hello World', function (err, data) {
        const nodeHtmlToImage = require('node-html-to-image')
        nodeHtmlToImage({
            output: './image.png',
            html: `<html><head>
            <style>
              body {
                width: 400px;
                height: 300px;
              }
            </style>
          </head><body><pre>${data}</pre></body></html>`//,
            // transparent: true
        }).then(() =>{
    res.sendFile(path.join(__dirname + "/image.png"))
            
        })
    });
})



app.listen(8080, () => {

    console.log("Server läuft")

})