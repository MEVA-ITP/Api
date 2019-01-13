import convict from 'convict'
import fs from "fs";
import path from "path";

const envs = ['production', 'development', 'test']

export const config = convict({
    env: {
        doc: "The application enviroment.",
        format: envs,
        default: 'production',
        env: 'NODE_ENV',
    },
    db: {
        uri: {
            doc: "Mongo db uri. See https://docs.mongodb.com/manual/reference/connection-string/",
            format: String,
            default: 'mongodb://localhost:27017/onquip',
            env: 'dbUri'
        },
        options: {
            doc: "Settings for the mongo connector. See https://mongoosejs.com/docs/api.html#mongoose_Mongoose-createConnection",
            format: Object,
            default: {
                useNewUrlParser: true,
            },
        }
    },
    server: {
        port: {
            doc: 'Port to listen to',
            format: 'port',
            default: 3000,
            env: 'PORT'
        },
        headers: {
            doc: 'Headers to always send. Form: Header: Value',
            format: Object,
            default: {
                "Access-Control-Allow-Origin": '*',
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            },
        }
    },
    paths: {
        public: {
            doc: 'Path to the directory to server files from.',
            format: String,
            default: '../public',
        },
        defaultFile: {
            doc: 'Path to the file to serve if no file to serve was found.',
            format: String,
            default: '../public/index.html',
        },
        server: {
            doc: 'The files to load for the express server (*.server.js)',
            format: String,
            default: './server',
        },
        routes: {
            doc: 'The files to load the falcor routes from.',
            format: String,
            default: './routes',
        },
    },
    ldap: {
        client: {
            doc: 'Object directly passed to ldapjs.createClient()',
            format: Object,
            default: {
                url: 'ldap://tgm.ac.at',
            },
        },
        base: {
            doc: 'LDAP base',
            format: String,
            default: 'OU=People,OU=identity,DC=tgm,DC=ac,DC=at',
        },
        user: {
            doc: 'LDAP user to authenticate',
            format: String,
            default: 'dlangheiter@tgm.ac.at',
        },
        password: {
            doc: 'LDAP password to authenticate',
            format: String,
            default: '',
            //sensitive: true,
        }
    },
    session: {
        store: {
            collection: {
                doc: "Collection to use in mongo to save sessions to",
                format: String,
                default: 'sessions',
            },
            fallbackMemory: {
                doc: 'If it should fall back to default file session storage',
                format: Boolean,
                default: process.env.NODE_ENV === "development" && false,
            }
        }
    }
})

let env = config.get('env')
let noCurrentEnv = envs.splice(envs.indexOf(env), 1)


const loadFiles = fs.readdirSync(path.join(__dirname, '../../config'))
    .sort()
    .filter((file) => {
        for(let e of noCurrentEnv) {
            if(new RegExp(`.*${e}\.json5?`).test(file)) {
                return false
            }
        }
        return true
    })
    .map(file => '../config/' + file)

config.loadFile(loadFiles)
config.validate({allowed: 'strict'})