import {httpLogger} from "../general/loger";

export const init = (app) => {
    app.use(httpLogger)
}