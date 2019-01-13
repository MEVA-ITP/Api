import {ADMIN, USER, userPermissionBigerThan} from "../general/userPermissions";
import {User} from "../database";
import {errorStore} from "../general/errorStore";
import jsonGraph from "falcor-json-graph";
const $ref = jsonGraph.ref
const $error = jsonGraph.error

export const route = [
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
            // TODO: Implement!
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
]