import falcorExpress from "falcor-express";
import {MEVARouter} from "../general/router";
import {isThisLocalhost} from "../general/helpers";
import {logger} from "../general/loger";

const getUserId = (user) => {
    return user ? user._id : "Unknown"
}

export const init = (app) => {
    // Set the endpoint /model.json to use our Falcor Router.
    // And pass the user object and if the request came from localhost to the Router
    app.use('/model.json',
        falcorExpress.dataSourceRoute((req, res) => {
            // Modified from: https://gist.github.com/gdi2290/14b0c1a5701bc661ce2d

            let routerInstance = new MEVARouter(req.user, isThisLocalhost(req))

            // Wrap the falcor router so that we can log information
            return {
                get: function (paths) {
                    logger.silly(`${getUserId(req.user)} requested paths ${JSON.stringify(paths)}`);
                    return routerInstance.get(paths)
                },
                set: function (jsong) {
                    logger.silly(`${getUserId(req.user)} set the following jsong ${JSON.stringify(jsong)}`);
                    return routerInstance.set(jsong)
                },
                call: function (callPath, args, suffixes, paths) {
                    logger.silly(`${getUserId(req.user)} made a call to ${callPath} with the arguments ${JSON.stringify(args)}`)
                    return routerInstance.call(callPath, args, suffixes, paths)
                }
            }
        })
    )
}