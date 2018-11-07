import {Strategy as LocalStrategy} from 'passport-local'
import bcrypt from "bcrypt";
import {authentikateLdapUser} from "./ldap";
import {models} from "../database";

const getUserByMail = async (email) => {
    return models.User.find({email})
}

export const errorMsgs = {
    invalidCredentials: "Invalid credentials.",
    disabled: "This user is disabled.",
}

export const AuthStrategy = new LocalStrategy(
    {usernameField: 'email'},
    async (email, password, done) => {
        let user = await getUserByMail(email)
        // Check if we got exactly one user. if less there was no user with this mail.
        // if more. we have got an error (email = unique)
        if (user.length !== 1) {
            done(null, false, {message: errorMsgs.invalidCredentials})
            return
        }

        // Get the one user
        user = user[0]

        if (user.active === false) {
            return done(null, false, {message: errorMsgs.disabled})
        }

        // Check if the user is external and check password
        if (user.external === true && await bcrypt.compare(password, user.password)) {
            return done(null, user)
        }

        // Check if user is internal. Aka not external
        if (user.external === false) {
            if (await authentikateLdapUser(email, password)) {
                return done(null, user)
            }
        }

        done(null, false, {message: errorMsgs.invalidCredentials})
    }
)