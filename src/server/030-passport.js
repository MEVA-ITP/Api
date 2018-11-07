import ldapjs from 'ldapjs'
import {pw} from '../pw'
import {search, bind} from "../general/ldapsearchpromise";
import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'
import {models} from "../database/index";
import bcrypt from 'bcrypt'

const getUserByMail = async (email) => {
    return models.User.find({email})
}

const getUserById = async (id) => {
    return models.User.findById(id)
}

export const init = (app) => {
    passport.use(new LocalStrategy(
        {usernameField: 'email'},
        async (email, password, done) => {
            let user = await getUserByMail(email)
            // Check if we got exactly one user. if less there was no user with this mail.
            // if more. we have got an error (email = unique)
            if(user.length !== 1) {
                done(null, false, {message: "Email not founds\n"})
                return
            }

            // Get the one user
            user = user[0]
            // Check if external and check password
            if(user.external === true && await bcrypt.compare(password, user.password)) {
                console.log(`AUTHED user ${user}`)
                done(null, user)
                return
            }
            if(user.external === false){
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
                } catch(e) {
                    console.log("No auth user")
                }
            }

            done(null, false, 'invalid credentials\n')
        }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await getUserById(id)
        if(!user) {
            return done(null, false, {message: "Id not known"})
        }

        done(null, user);
    })

    app.use(passport.initialize())
    app.use(passport.session())
}
