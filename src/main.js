import "babel-polyfill"
import express from "express"
import {config} from "./config";
import path from 'path'
import fs from 'fs'

let app = express()

fs.readdirSync(path.join(__dirname, config.paths.server)).sort().forEach(file => {
    console.log("FILE", file)
    if (file.endsWith(".js")) {
        const {init} = require(__dirname + "/server/" + file)
        if (typeof init === 'function') {
            init(app)
        }
    }
})

app.get('/authreq', (req, res) => {
    console.log(`AUTHREQ ${req.isAuthenticated()}`)
    if (req.isAuthenticated()) {
        res.send(`you hit the auth endpoint ${req.user}`)
    } else {
        res.redirect('/')
    }
})

app.use('/', express.static(path.join(__dirname, config.paths.public)))

app.listen(3000, () => console.log('Server started on port 3000'))