export const init = (app) => {
    app.use('/logout', (req, res) => {
        req.logout()
        res.redirect('/')
    })
}