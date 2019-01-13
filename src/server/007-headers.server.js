import {config} from "../general/config";

const headers = config.get('server.headers')

export const init = (app) => {
    app.use((req, res, next) => {

        for(let header in headers) {
            let value =
                Array.isArray(headers[header])
                    ? headers[header]
                    : [headers[header]]
            for(let v of value) {
                res.header(header, v)
            }
        }

        next()
    })
}