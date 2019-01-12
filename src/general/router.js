import Router from 'falcor-router'
import fs from "fs";
import path from "path";
import {config} from "../config/defaultConfig";
import {logger} from "./loger";

export const loadRoutes = () => {
    let ret = []

    // Read all files in routes directory
    fs.readdirSync(path.join(config.paths.routes)).sort().forEach(file => {
        // Check if file name ends with '.route.js'
        if (file.endsWith(".route.js")) {
            // Load route from file
            const {route} = require(path.join('..', config.paths.routes, file))
            // Check if route is defined
            if (route !== undefined && route !== null) {
                logger.info(`LOADED ROUTE: ${file}`)
                // Add route/s to ret
                ret = ret.concat(Array.isArray(route) ? route : [route])
            }
        }
    })

    return ret
}

let MEVARouterBase = Router.createClass(loadRoutes())

let _MEVARouter = function (user, isLocalhost) {
    MEVARouterBase.call(this);
    this.user = user;
    this.isLocalhost = isLocalhost;
}

_MEVARouter.prototype = Object.create(MEVARouterBase.prototype);

export const MEVARouter = _MEVARouter

