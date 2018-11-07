import falcorExpress from "falcor-express";
import {MEVARouter} from "../general/router";
import {isThisLocalhost} from "../general/helpers";

export const init = (app) => {
    app.use('/model.json',
        falcorExpress.dataSourceRoute((req, res) => {
            return new MEVARouter(req.user, isThisLocalhost(req))
        }))
}