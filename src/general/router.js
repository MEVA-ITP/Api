import Router from 'falcor-router'
import jsonGraph from 'falcor-json-graph'
import {ADMIN, TEACHER, USER, userPermissionBigerThan} from "../config/userPermissions";
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
        route: "user",
        get: async function () {
            console.log('CALL user')
            if (!userPermissionBigerThan(this.user, USER)) {
                throw errorStore.notAuthed()
            }

            return [{path: ['user'], value: $ref(["userById", this.user._id])}]
        }
    },
    {
        route: "user.addToken",
        call: function () {
            return {}
        }
    },
    {
        route: "userById[{keys:ids}]['email', 'phone', 'fname', 'lname', 'external', 'active', 'permission']",
        get: async function (pathSet) {
            console.log("CALL userById")
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
                let userById = jsonGraphResponse['userById'] = {}

                users.forEach(user => {
                    let responseUser = {}

                    userKeys.forEach(key => responseUser[key] = user[key])
                    userById[user._id] = responseUser
                })
                return response
            } else if (userPermissionBigerThan(this.user, USER)) {
                let response = {}
                let jsonGraphResponse = response['jsonGraph'] = {}
                let userById = jsonGraphResponse['userById'] = {}

                let projection = {}
                userKeys.forEach((name) => {
                    projection[name] = true
                })

                let getUsers = pathSet.ids.filter(id => {
                    if (!this.user._id.equals(id)) {
                        userById[id] = $error(errorStore.notAuthed())
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
                    userById[getUser] = $error(errorStore.notFound())
                } else {
                    userById[getUser] = users
                }

                return response
            }

            throw errorStore.notAuthed()
        }
    },
    {
        route: "devices[{ranges}]",
        get: async function (pathSet) {
            if (!userPermissionBigerThan(this.user, USER)) {
                throw errorStore.notAuthed()
            }
            let ret = []
            for (let range of pathSet[1]) {
                let got = await Device.find({}, {_id: 1}).skip(range.from).limit((range.to - range.from) + 1)

                let i = range.from
                for (let g of got) {
                    ret.push({path: ['devices', i], value: $ref(['devicesById', g._id.toString()])})
                    i++
                }
            }

            return ret
        }
    },
    {
        route: "devices.length",
        get: async function () {
            if (!userPermissionBigerThan(this.user, USER)) {
                throw errorStore.notAuthed()
            }
            return [{path: ["devices", "length"], value: await Device.estimatedDocumentCount()}]
        }
    },
    {
        route: "devices.create",
        call: async function (path, args) {
            if (!userPermissionBigerThan(this.user, TEACHER)) {
                throw errorStore.notAuthed()
            }
            console.log(args)
            return [
                {path: ["devicesById", "xxx"], value: {test: "hallo"}},
                {path: ["devices", "length"], value: await Device.estimatedDocumentCount()}
            ]
        }
    },
    {
        route: "devicesById[{keys:id}]['id', 'name', 'serial', 'invnr', 'room', 'image', 'description', 'status', 'attributes', 'tags']",
        get: async function (pathSet) {
            if (!userPermissionBigerThan(this.user, USER)) {
                throw errorStore.notAuthed()
            }
            const deviceKeys = pathSet[1]
            const getAttributes = pathSet[2]

            let response = {}
            let jsonGraphResponse = response['jsonGraph'] = {}
            let devicesById = jsonGraphResponse['devicesById'] = {}

            // Load all from database
            const got = await Device.find({_id: {$in: deviceKeys}}, getAttributes)
            for (let g of got) {
                let id = g._id
                let set = {}
                devicesById[id] = {}

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

                devicesById[id] = set
            }

            return response;
        },
        set: async function(jsonEnvelope) {
            console.log(jsonEnvelope)
            let id = Object.keys(jsonEnvelope.devicesById)[0]
            return {
                path: ["devicesById", id, 'name'],
                value: jsonEnvelope.devicesById[id].name
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