import session from 'express-session'
import uuid from 'uuid/v4'
import sessionFileStore from 'session-file-store'
const FileStore = sessionFileStore(session)

export const init = (app) => {
    app.use(session({
        genid: (req) => {
            return uuid()
        },
        store: new FileStore(),
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
    }))
}