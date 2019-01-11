import passport from "passport";
import {logger} from "../general/loger";

export const init = (app) => {
    // Use auth strategy
    app.post('/login', (req, res, next) => {
        passport.authenticate('auth', (err, user, info) => {
            if (err) {
                logger.error(err)
                return res.send(JSON.stringify({ok: false, error: "Internal error."}))
            }
            if (!user) {
                logger.warn(`Unsuccessful login. Info: ${JSON.stringify(info)}`)
                return res.send(JSON.stringify({ok: false, error: "Invalid Credentials. Please try again."}))
            }
            req.login(user, (err) => {
                if (err) {
                    logger.error(err)
                    return res.send(JSON.stringify({ok: false, error: "Internal error."}))
                }
                logger.info(`Successful login.`)
                return res.send(JSON.stringify({ok: true, error: null}))
            })
        })(req, res, next)
    })
}