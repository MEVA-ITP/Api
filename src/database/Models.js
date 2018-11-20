import {userSchema} from "./models/user";
import {deviceSchema} from "./models/device";
import {reservationSchema} from "./models/reservation";
import {damageSchema} from "./models/damage";
import {database} from "./database";

export const User = database.model("User", userSchema)
export const Device = database.model("Device", deviceSchema)
export const Reservation = database.model("Reservation", reservationSchema)
export const Damage = database.model("Damage", damageSchema)