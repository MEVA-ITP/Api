import {ldapPw} from "./passwords";

export const config = {
    // Mongo db database configuration
    db: {
        uri: 'mongodb://localhost:27017/onquip',
        // See https://mongoosejs.com/docs/api.html#mongoose_Mongoose-createConnection for details.
        // Example: adding user + pwd for login
        options: {
            useNewUrlParser: true
        },
    },
    server: {
        port: process.env.PORT || 3000,
        headers: {
            "Access-Control-Allow-Origin": ["https://meva.thekingdave.com", "http://localhost:*"],
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        },
    },
    // Path configuration.
    paths: {
        // Where the public directory lies (aka public webpage). Relative path to main.js
        public: "../public",
        defaultFile: '../public/index.html',
        // Where the 'extension' of the server lies. Relative path to main.js
        server: './server',
        // Where the routes for the falcor router are stored
        routes: './routes'
    },
    ldap: {
        // Object directly passed to ldapjs.createClient()
        client: {
            url: 'ldap://tgm.ac.at',
        },
        base: 'OU=People,OU=identity,DC=tgm,DC=ac,DC=at',
        user: 'dlangheiter@tgm.ac.at',
        password: ldapPw,
    },
    session: {
        store: {
            collection: 'sessions',
            // True/False = wanted fallback to memory storage
            fallbackMemory: process.env.NODE_ENV === "development" && false
        }
    }
}