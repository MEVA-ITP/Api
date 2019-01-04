import Router from 'falcor-router'
import {loadRoutes} from "./routes";

let MEVARouterBase = Router.createClass(loadRoutes())

let _MEVARouter = function (user, isLocalhost) {
    MEVARouterBase.call(this);
    this.user = user;
    this.isLocalhost = isLocalhost;
}

_MEVARouter.prototype = Object.create(MEVARouterBase.prototype);

export const MEVARouter = _MEVARouter

