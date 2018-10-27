import mongoose from "mongoose"

const root = "/public/images/"

export const deviceSchema = new mongoose.Schema({
    name: {type: String, required: true},
    serial: {type: String, required: true},
    image: {
        type: String,
        get: v => `${root}${v}`
    },
    description: {type: String, required: true},
    status: {type: ["ok", "broken", "not available"], required: true}, // Other?
    attributes: {type: Map, required: true},
    tags: [String]
})