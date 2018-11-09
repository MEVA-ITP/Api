import mongoose from "mongoose"
import validator from "validator"
import phone from "phone"

// Using validator for email, and other validation
// Not using validator for phone, because Austrian phone number are not recognized
// Using phone for that purpose. plus for phone, also gives us normalized phone numbers. For sms or something

export const userPermissions = {
    "none": 0,
    "user": 100,
    "teacher": 200,
    "admin": 300,
    "owner": 400,
    "herobrine": 999,
}

export const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: (value) => {
            let rest = phone(value)
            if(rest.lenght <= 1) throw Error("Invalid phone number")
            return rest[0]
        }
    },
    message_tokens: {type: [String], required: true},
    external: {type: Boolean, required: true},
    active: {type: Boolean, required: true}, // externale == false => auto on
    permission: {type: Object.keys(userPermissions), default: "user", required: true},
    fname: String, // Only required if external
    lname: String, // Only required if external
    password: String, // Only required if external
})