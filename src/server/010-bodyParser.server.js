import bodyParser from 'body-parser'

export const init = (app) => {
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
}