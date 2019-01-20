import {logger} from "../general/loger";
import validatejs from 'validate.js'
import phone from "phone"
import bcrypt from 'bcryptjs'
import {User} from "../database/Models";

validatejs.validators.phone = (value, options) => {
    const val = phone(value, options)
    if (val.length === 0) {
        return "is not a valid phone number."
    }
}

/**
 *
 * @param value
 * @param options
 *      model: Mongoose Model
 *      message: String Custom error message
 *      key: String/[String] overrides default key(s)
 * @param key Key of the
 * @return {Promise<void>}
 */
validatejs.validators.notInDb = async (value, options, key) => {
    key = [key]
    if (options.key) {
        key = Array.isArray(options.key) ? options.key : [options.key]
    }

    let or = key.map(k => ({[k]: value}))
    const found = await options.model.findOne({$or: or})
    if (found) {
        return options.message ? options.message : "does already exist"
    }
}

export const init = (app) => {
    app.post('/register', async (req, res) => {
        logger.debug(JSON.stringify(req.body))

        let constraints = {
            type: {
                presence: true,
                inclusion: ['internal', 'external'],
            },
            email: {
                presence: true,
                email: true,
                notInDb: {model: User},
            },
            phone: {
                presence: true,
                phone: true,
                notInDb: {model: User},
            }
        }

        if (req.body.type === 'external') {
            constraints = {
                ...constraints,
                fname: {
                    presence: true,
                },
                lname: {
                    presence: true,
                },
                password: {
                    presence: true,
                }
            }
        }

        try {
            await validatejs.async(req.body, constraints)

            req.body.active = req.body.type === 'internal'
            req.body.external = req.body.type !== 'internal'

            if (req.body.type === 'external') {
                req.body.password = await bcrypt.hash(req.body.password, 10)
            }

            let user = new User(req.body)
            await user.save()
            logger.log('silly', 'created new user ' + user.email)

            res.send(JSON.stringify({ok: true, error: null}))
        } catch (e) {
            logger.log('warn', "Register error: " + e)
            res.send(JSON.stringify({ok: false, error: e}))
        }
    })
}