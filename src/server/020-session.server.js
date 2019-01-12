import session from 'express-session'
import uuid from 'uuid/v4'
import connectMongo from 'connect-mongo'
import {config} from "../config/defaultConfig"
import {database} from "../database"

const MongoStore = connectMongo(session)

export const init = (app) => {
    app.use(session({
        genid: () => {
            return uuid()
        },
        store: new MongoStore({
            ...config.session.store,
            mongooseConnection: database,
        }),
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
    }))
}