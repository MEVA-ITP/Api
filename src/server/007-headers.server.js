import {config} from "../config/defaultConfig";

export const init = (app) => {
    app.use((req, res, next) => {

        for(let header in config.server.headers) {
            let value =
                Array.isArray(config.server.headers[header])
                    ? config.server.headers[header]
                    : [config.server.headers[header]]
            for(let v of value) {
                res.header(header, v)
            }
        }

        next()
    })
}