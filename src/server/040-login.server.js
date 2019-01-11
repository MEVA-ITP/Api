import passport from "passport";

export const init = (app) => {
    // Use auth strategy
    app.post('/login', (req, res, next) => {
        passport.authenticate('auth', (err, user, info) => {
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.send(JSON.stringify({ok: false, error: "Wrong credentials."}))
            }
            req.login(user, (err) => {
                if (err) {
                    return next(err)
                }
                return res.send(JSON.stringify({ok: true, error: null}))
            })
        })
    })
}