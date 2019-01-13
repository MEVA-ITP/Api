#!/usr/bin/env node

import express from "express"
import {config} from "./general/config";
import path from 'path'
import fs from 'fs'
import send from 'send'
import {logger} from "./general/loger";

const PORT = config.get('server.port')

// Create express app
let app = express()

// Scan server directory for .server.js files and require them and call the init method with the express app as an argument
fs.readdirSync(path.join(__dirname, config.get('paths.server'))).sort().forEach(file => {
    if (file.endsWith(".server.js")) {
        logger.info(`LOAD FILE: ${file}`)
        const {init} = require(path.join(__dirname, config.get('paths.server'), file))
        if (typeof init === 'function') {
            init(app)
        }
    }
})

// Server public directory
app.use('/', express.static(path.join(__dirname, config.get('paths.public'))))

// If file is not found, serve default file
app.use('/', (req, res) => {
    send(req, path.join(__dirname, config.get('paths.defaultFile'))).pipe(res)
})

app.listen(PORT, () => logger.info(`Server started on port ${PORT}: http://localhost:${PORT}/`))