import {TEACHER, USER, userPermissionBigerThan} from "../config/userPermissions";
import {Device} from "../database";
import {errorStore} from "../general/errorStore";
import jsonGraph from "falcor-json-graph";
import {logger} from "../general/loger";
const $ref = jsonGraph.ref
const $error = jsonGraph.error
const $atom = jsonGraph.atom

export const route = [
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
        set: async function (jsonEnvelope) {
            logger.debug(`Set ${jsonEnvelope}`)
            let id = Object.keys(jsonEnvelope.devicesById)[0]
            return {
                path: ["devicesById", id, 'name'],
                value: jsonEnvelope.devicesById[id].name
            }
        }
    }
]