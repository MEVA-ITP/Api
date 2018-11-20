import validator from "validator"
import phone from "phone"
import {User} from '../database'
import {doesLdapUserExist} from "../general/ldap";

export const init = (app) => {
    app.post('/register', async (req, res) => {
        let ret = "<h1>Register</h1>"

        let error = []
        if (req.body.email && req.body.phone) {
            let userExists = null

            if (!validator.isEmail(req.body.email)) {
                error.push("Email is not valid")
            } else if (!req.body.email.endsWith("tgm.ac.at")) {
                error.push("Email is not valid tgm email")
            } else {
                userExists = await doesLdapUserExist(req.body.email)

                if(!userExists) {
                    error.push("Email was not found in tgm.")
                }
            }

            if (!(phone(req.body.phone).length > 0)) {
                error.push("Phone is not valid")
            } else {
                req.body.phone = phone(req.body.phone)[0]
            }

            if (error.length > 0) {
                res.send("<h1>Error's</h1>" + error.join(", "))
                return
            }

            console.log(userExists)

            /*let newUser = new User({
                email: req.body.email,
                phone: req.body.phone,
                external: 'false',
                active: true,
            })
            await newUser.save()*/

            ret += "<h1>Try register</h1>"
        } else {
            res.redirect('/register')
        }

        res.send(ret)
    })
}