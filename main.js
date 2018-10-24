let express = require('express')
let path = require('path')
let falcorExpress = require('falcor-express')
let Router = require('falcor-router')
let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy
let session = require('express-session')
let bodyParser = require('body-parser')
let MEVARouter = require('./router')

passport.use(new LocalStrategy((username, password, done) => {
    if (username === password) {
        done(null, username)
    } else {
        done(null, false)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((id, done) => {
    done(null, id)
})

let app = express()

app.use('/', express.static(__dirname + '/public'))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(passport.initialize())
app.use(passport.session())

app.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login'}))

app.use('/model.json',
    falcorExpress.dataSourceRoute((req, res) => {
        return new MEVARouter(req.user)

        /*return new Router([
            {
                route: 'user',
                get: () => {
                    return {path: ['user'], value: req.user}
                }
            },
            {
                route: 'status',
                get: () => {
                    return {path: ['status'], value: 'OK'}
                }
            }
        ])*/

    }))

app.listen(3000, () => console.log('Server started'))