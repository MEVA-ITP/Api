import falcorExpress from "falcor-express";
import {MEVARouter} from "../general/router";
import {isThisLocalhost} from "../general/helpers";

export const init = (app) => {
    // Set the endpoint /model.json to use our Falcor Router.
    // And pass the user object and if the request came from localhost to the Router
    app.use('/model.json',
        falcorExpress.dataSourceRoute((req) => {
                return new MEVARouter(req.user, isThisLocalhost(req))
            }
        )
    )
}