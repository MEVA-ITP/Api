// Import all schemas
import {userSchema} from './user'
import {deviceSchema} from "./device";
import {reservationSchema} from "./reservation";
import {damageSchema} from "./damage";

// Save all schemas into dict for easier working in createModels
const schemas = {
    User: userSchema,
    Device: deviceSchema,
    Reservation: reservationSchema,
    Damage: damageSchema,
}

// Function to map the model to the connection.
export const makeModels = (connection) => {
    let ret = {}

    for(let key in schemas) {
        ret[key] = connection.model(key, schemas[key])
    }

    return ret
}