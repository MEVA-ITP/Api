// Import all schemas
const User = require("./user")
const Device = require("./device")
const Reservation = require("./reservation")
const Damage = require("./damage")

// Save all schemas into dict for easier working in createModels
const schemas = {
    User,
    Device,
    Reservation,
    Damage
}

// Function to map the model to the connection.
module.exports = (connection) => {
    let ret = {}

    for(let key in schemas) {
        ret[key] = connection.model(key, schemas[key])
    }

    return ret
}