import passport from "passport";

export const init = (app) => {
    // Use auth strategy
    app.post('/login', passport.authenticate('auth', {successRedirect: '/', failureRedirect: '/login'}))
}