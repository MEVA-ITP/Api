import Router from 'falcor-router'
import jsonGraph from 'falcor-json-graph'
import {ADMIN, USER, userPermissionBigerThan} from "../config/userPermissions";
import {Device, User} from "../database";

const $ref = jsonGraph.ref
const $error = jsonGraph.error
const $atom = jsonGraph.atom

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
        get: async function (pathSet) {
            console.log('CALL user')
            const keys = pathSet[1]

            return keys.map(key => ({path: ['user', key], value: this.user[key]}))
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
    },
    {
        route: "devices[{ranges}]",
        get: async function (pathSet) {
            let ret = []
            for(let range of pathSet[1]) {
                let got = await Device.find({}, {_id: 1}).skip(range.from).limit((range.to - range.from)+1)

                let i = range.from
                for(let g of got) {
                    ret.push({path: ['devices', i], value: $ref(['deviceById', g._id.toString()])})
                    i++
                }
            }

            return ret
        }
    },
    {
        route: "devices.length",
        get: async function () {
            return [{path: ["devices", "length"], value: await Device.estimatedDocumentCount()}]
        }
    },
    {
        route: "deviceById[{keys:id}]['id', 'name', 'serial', 'invnr', 'room', 'image', 'description', 'status', 'attributes', 'tags']",
        get: async function (pathSet) {
            const deviceKeys = pathSet[1]
            const getAttributes = pathSet[2]

            let response = {}
            let jsonGraphResponse = response['jsonGraph'] = {}
            let deviceById = jsonGraphResponse['deviceById'] = {}

            // Load all from database
            const got = await Device.find({_id: {$in: deviceKeys}}, getAttributes)
            for(let g of got) {
                let id = g._id
                let set = {}
                deviceById[id] = {}

                // Go through all required attributes
                getAttributes.forEach((key) => {
                    // Check if attribute needs to be an atom
                    if (["attributes", "tags"].includes(key)) {
                        // Transpose Map to json object
                        let attr = {}
                        g[key].forEach((val, key) => {
                            attr[key] = val
                        })
                        return set[key] = $atom(attr)
                    }
                    set[key] = g[key]
                })

                deviceById[id] = set
            }

            return response;
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