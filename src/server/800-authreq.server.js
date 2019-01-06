export const init = (app) => {
    // Testing endpoint if user is authenticated
    app.use('/authreq', (req, res) => {
        console.log(`AUTHREQ ${req.isAuthenticated()}`)
        if (req.isAuthenticated()) {
            res.send(`you hit the auth endpoint ${req.user}`)
        } else {
            res.redirect('/')
        }
    })
}