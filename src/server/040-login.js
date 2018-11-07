import passport from "passport";

export const init = (app) => {
    app.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login'}))
}