import "babel-polyfill"
import express from "express"
import falcorExpress from "falcor-express"
import passport from "passport"
import {Strategy as LocalStrategy} from "passport-local"
import session from 'express-session'
import bodyParser from 'body-parser'
import MEVARouter from './general/router'

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
    }))

app.use('/', express.static(__dirname + '/public'))

app.listen(3000, () => console.log('Server started'))