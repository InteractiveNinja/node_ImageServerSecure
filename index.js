const express = require('express')
const app = express()



app.get("/", (req, res) => {


    var figlet = require('figlet');

    figlet('Hello World!!', function (err, data) {

        const textToImage = require('text-to-image');
        textToImage.generate(data).then(function (dataUri) {
            res.send(`<img src='${dataUri}'>`)
            // res.send(`<pre>${data}</pre>`)
        });
    });

})



app.listen(8080, () => {

    console.log("Server läuft")

})