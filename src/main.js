import express from "express"
import {config} from "./config/config";
import path from 'path'
import fs from 'fs'
import send from 'send'

let PORT = process.env.PORT || 3000;

// Create express app
let app = express()

// Scan server directory for .js files and require them and call the init method with the express app as argument
fs.readdirSync(path.join(__dirname, config.paths.server)).sort().forEach(file => {
    if (file.endsWith(".js")) {
        console.log("LOAD FILE:", file)
        const {init} = require(path.join(__dirname, config.paths.server, file))
        if (typeof init === 'function') {
            init(app)
        }
    }
})

// Server public directory
app.use('/', express.static(path.join(__dirname, config.paths.public)))

// If file is not found, serve default file
app.use('/', (req, res) => {
    send(req, path.join(__dirname, config.paths.defaultFile)).pipe(res)
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}: http://localhost:${PORT}/`))