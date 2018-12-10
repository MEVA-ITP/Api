import mongoose from "mongoose"

const root = "/public/images/"

export const deviceSchema = new mongoose.Schema({
    name: {type: String, required: true},
    serial: {type: String, required: true},
    invnr: {type: String, required: true},
    room: {type: String, default: "unknown"},
    image: {
        type: String,
        get: v => `${root}${v}`
    },
    description: {type: String, required: true},
    status: {type: String, enum: ["ok", "broken", "not available"], required: true}, // Other?
    attributes: {type: Map, required: true},
    tags: [String]
})