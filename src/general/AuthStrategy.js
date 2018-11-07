import {Strategy as LocalStrategy} from 'passport-local'
import bcrypt from "bcrypt";
import ldapjs from "ldapjs";
import {bind, search} from "./ldapsearchpromise";

export const AuthStrategy = new LocalStrategy(
    {usernameField: 'email'},
    async (email, password, done) => {
        let user = await getUserByMail(email)
        // Check if we got exactly one user. if less there was no user with this mail.
        // if more. we have got an error (email = unique)
        if (user.length !== 1) {
            done(null, false, {message: "Email not founds\n"})
            return
        }

        // Get the one user
        user = user[0]
        // Check if external and check password
        if (user.external === true && await bcrypt.compare(password, user.password)) {
            console.log(`AUTHED user ${user}`)
            done(null, user)
            return
        }

        // Check if user is internal. Aka not external
        if (user.external === false) {
            let client = ldapjs.createClient({
                url: 'ldap://tgm.ac.at'
            })
            await bind(client, 'mfletzberger@tgm.ac.at', pw)
            let opts = {
                filter: `(mail=${email})`,
                scope: 'sub'
            }
            let res = await search(client, opts)
            try {
                await bind(client, res.object.dn, password)
                return done(null, user)
            } catch (e) {
                console.log("No auth user")
            }
        }

        done(null, false, 'invalid credentials\n')
    }
)