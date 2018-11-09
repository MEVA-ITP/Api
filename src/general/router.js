import Router from 'falcor-router'
import {userPermissionBigerThan} from "./helpers";
import {models} from "../database";
import {userPermissions as UP} from "../database/models/user";

const errorStore = {
    notAuthed: () => new Error("not authorized"),
}

class _MEVARouter extends Router.createClass([
    {
        route: 'status',
        get: function () {
            console.log("CALL status")
            return {path: ['status'], value: this.user ? 'authenticated' : 'unauthenticated'}
        }
    },
    {
        route: "user['email', 'phone', 'external', 'active', 'permission']",
        get: async function (pathSet) {
            console.log('CALL user')
            let keys = pathSet[1]
            if (userPermissionBigerThan(this.user, UP.user)) {
                throw errorStore.notAuthed()
            }

            return keys.map(key => ({path: ['user', key], value: this.user[key]}))
        }
    },
    {
        route: "usersById[{keys:ids}]['email', 'phone', 'external', 'active', 'permission']",
        get: async function (pathSet) {
            console.log("CALL usersById")
            const userKeys = pathSet[2]
            if(userPermissionBigerThan(this.user, UP.admin)) {
                let projection = {}
                userKeys.forEach((name) => {
                    projection[name] = true
                })

                let query = {_id: {$in: pathSet.ids}}

                let users = await models.User.find(query, projection)

                let response = {}
                let jsonGraphResponse = response['jsonGraph'] = {}
                let usersById = jsonGraphResponse['usersById'] = {}

                users.forEach(user => {
                    let responseUser = {}

                    userKeys.forEach(key => responseUser[key] = user[key])
                    usersById[user._id] = responseUser
                })
                return response
            }

            throw errorStore.notAuthed()
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