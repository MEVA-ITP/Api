import {pw} from '../pw'
import passport from 'passport'
import {models} from "../database/index";
import {AuthStrategy} from "../general/AuthStrategy";

const getUserByMail = async (email) => {
    return models.User.find({email})
}

const getUserById = async (id) => {
    return models.User.findById(id)
}

export const init = (app) => {
    passport.use(AuthStrategy)

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
