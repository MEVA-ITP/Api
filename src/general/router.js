import Router from 'falcor-router'
import {database, models} from "../database/database";

class _MEVARouter extends

    Router.createClass([
        {
            route: 'status',
            get: function (pathSet) {
                return {path: ['status'], value: this.user ? 'authenticated' : 'unauthenticated'}
            }
        },
        {
            route: "user['email', 'phone', 'external', 'active']",
            get: async function (pathSet) {
                let keys = pathSet[1]
                if(!this.user) {
                    throw new Error('not authorized')
                }

                return keys.map(key => ({path: ['user', key], value: this.user[key]}))
            }
        },
        {
            route: "userById[{keys:ids}]['email', 'phone', 'external', 'active', 'message_tokens', 'password']",
            get: function *(pathSet) {
                if(!this.isLocalhost) {
                    throw new Error("not authorized")
                }



            }
        }
    ]) {

    constructor(user, isLocalhost) {
        super();
        this.user = user
        this.isLocalhost = isLocalhost
    }

}

export const MEVARouter = _MEVARouter