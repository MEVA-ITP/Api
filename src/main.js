import "babel-polyfill"
import express from "express"
import falcorExpress from "falcor-express"
import passport from "passport"
import {MEVARouter} from './general/router'
import fs from 'fs'

let app = express()

fs.readdirSync(__dirname + "/server").sort().forEach(file => {
    console.log("FILE", file)
    if(file.endsWith(".js")) {
        const {init} = require(__dirname + "/server/" + file)
        if(typeof init === 'function') {
            init(app)
        }
    }
})

/*app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(passport.initialize())
app.use(passport.session())
*/

app.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login'}))

app.use('/model.json',
    falcorExpress.dataSourceRoute((req, res) => {
        return new MEVARouter(req.user)
    }))

app.get('/authreq', (req, res) => {
    if(req.isAuthenticated()) {
        res.send('you hit the auth endpoint')
    } else {
        res.redirect('/')
    }
})

app.use('/', express.static(__dirname + '/../public'))
console.log(__dirname)

app.listen(3000, () => console.log('Server started'))