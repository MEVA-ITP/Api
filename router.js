let Router = require('falcor-router')

class MEVARouter extends

    Router.createClass([
        {
            route: 'status',
            get: function (pathSet) {
                return {path: ['status'], value: this.userMail ? 'authenticated' : 'unauthenticated'}
            }
        },
        {
            route: 'user',
            get: function (pathSet) {
                if(!this.userMail) {
                    throw new Error('not authorized')
                }
                return {path: ['user'], value: this.userMail}
            }
        }
    ]) {

    constructor(userMail) {
        super();
        this.userMail = userMail
    }

}

module.exports = MEVARouter