import {Strategy as LocalStrategy} from 'passport-local'
import bcrypt from "bcryptjs";
import {authenticateLdapUser} from "./ldap";
import {User} from "../database";

// Error messages "store" to always use the *same* message on the same error
export const errorMsgs = {
    invalidCredentials: "Invalid credentials.",
    disabled: "This user is disabled.",
}

export const AuthStrategy = new LocalStrategy(
    {usernameField: 'email'},
    async (email, password, done) => {
        // Search database for user with this email
        let user = await User.find({email})

        // Check if we got exactly one user. if less there was no user with this mail.
        // if more. we have got an error (email = unique)
        if (user.length !== 1) {
            done(null, false, {message: errorMsgs.invalidCredentials})
            return
        }

        // Get the one user
        user = user[0]

        // Check if the user is active
        if (user.active === false) {
            return done(null, false, {message: errorMsgs.disabled})
        }

        // Check if the user is external and check password
        if (user.external === true && await bcrypt.compare(password, user.password)) {
            return done(null, user)
        }

        // Check if user is internal. Aka not external
        if (user.external === false) {
            if (await authenticateLdapUser(email, password)) {
                return done(null, user)
            }
        }

        done(null, false, {message: errorMsgs.invalidCredentials})
    }
)