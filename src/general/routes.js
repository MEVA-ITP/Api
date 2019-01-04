import {config} from "../config/config";
import path from "path";
import fs from "fs";

export const loadRoutes = () => {
    let ret = []

    fs.readdirSync(path.join(config.paths.routes)).sort().forEach(file => {
        if (file.endsWith(".route.js")) {
            const {route} = require(path.join('..', config.paths.routes, file))
            if(route !== undefined && route !== null) {
                console.log("LOADED ROUTE:", file)
                ret = ret.concat(Array.isArray(route) ? route : [route])
            }
        }
    })

    return ret
}