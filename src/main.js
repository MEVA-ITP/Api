import "@babel/polyfill"
import express from "express"
import {config} from "./config";
import path from 'path'
import fs from 'fs'

// Create express app
let app = express()

// Scan server directory for .js files and require them and call the init method with the express app as argument
fs.readdirSync(path.join(__dirname, config.paths.server)).sort().forEach(file => {
    if (file.endsWith(".js")) {
        console.log("LOAD FILE:", file)
        const {init} = require(__dirname + "/server/" + file)
        if (typeof init === 'function') {
            init(app)
        }
    }
})

// Server public directory
app.use('/', express.static(path.join(__dirname, config.paths.public)))

app.listen(3000, () => console.log('Server started on port 3000'))