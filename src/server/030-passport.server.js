import passport from 'passport'
import {User} from "../database";
import {AuthStrategy} from "../general/AuthStrategy";

export const init = (app) => {
    // Setup AuthStrategy
    passport.use('auth', AuthStrategy)

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        // Load user from database by id
        let user = await User.findById(id)
        // If user not found => error
        if (!user) {
            return done(null, false, {message: "Id not known"})
        }

        done(null, user);
    })

    app.use(passport.initialize())
    app.use(passport.session())
}
