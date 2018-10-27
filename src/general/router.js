import Router from 'falcor-router'
import {database, models} from "../database/database";

class _MEVARouter extends

    Router.createClass([
        {
            route: 'status',
            get: function (pathSet) {
                return {path: ['status'], value: this.userMail ? 'authenticated' : 'unauthenticated'}
            }
        },
        {
            route: 'user',
            get: async function (pathSet) {
                if(!this.userMail) {
                    throw new Error('not authorized')
                }
                let find = await database.models.User.find({email: this.userMail})
                console.log(find)
                return {path: ['user'], value: this.userMail}
            }
        }
    ]) {

    constructor(userMail) {
        super();
        this.userMail = userMail
    }

}

export const MEVARouter = _MEVARouter