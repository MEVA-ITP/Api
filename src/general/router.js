import Router from 'falcor-router'
import jsonGraph from 'falcor-json-graph'
import {userPermissionBigerThan, USER, ADMIN} from "../config/userPermissions";
import {User} from "../database";

const $ref = jsonGraph.ref
const $error = jsonGraph.error

const errorStore = {
    notAuthed: () => new Error("not authorized"),
    notFound: () => new Error("not found"),
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
        get: async function () {
            console.log('CALL user')

            let ret = [{
                path: ['user'],
                //value: $ref(['usersById', this.user._id.toString()])
                value: $ref(`usersById[${this.user._id.toString()}]`)
            }]

            console.log(JSON.stringify(ret))
            console.log("TEST")

            return ret
            //return keys.map(key => ({path: ['user', key], value: this.user[key]}))
        }
    },
    {
        route: "usersById[{keys:ids}]['email', 'phone', 'external', 'active', 'permission']",
        get: async function (pathSet) {
            console.log("CALL usersById")
            const userKeys = pathSet[2]
            if (userPermissionBigerThan(this.user, ADMIN)) {
                let projection = {}
                userKeys.forEach((name) => {
                    projection[name] = true
                })

                let query = {_id: {$in: pathSet.ids}}

                let users = await User.find(query, projection)

                let response = {}
                let jsonGraphResponse = response['jsonGraph'] = {}
                let usersById = jsonGraphResponse['usersById'] = {}

                users.forEach(user => {
                    let responseUser = {}

                    userKeys.forEach(key => responseUser[key] = user[key])
                    usersById[user._id] = responseUser
                })
                return response
            } else if (userPermissionBigerThan(this.user, USER)) {
                let response = {}
                let jsonGraphResponse = response['jsonGraph'] = {}
                let usersById = jsonGraphResponse['usersById'] = {}

                let projection = {}
                userKeys.forEach((name) => {
                    projection[name] = true
                })

                let getUsers = pathSet.ids.filter(id => {
                    if (!this.user._id.equals(id)) {
                        usersById[id] = $error(errorStore.notAuthed())
                    }
                    return this.user._id.equals(id)
                })

                if (getUsers.length !== 1) {
                    return response
                }

                getUser = getUsers[0]

                let query = {_id: getUser}

                let users = await User.find(query, projection)

                if (users.length !== 1) {
                    usersById[getUser] = $error(errorStore.notFound())
                } else {
                    usersById[getUser] = users
                }

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