export const config = {
    // Mongo db database configuration
    db: {
        uri: 'mongodb://localhost:27017/onquip',
    },
    // Path configuration.
    paths: {
        // Where the public directory lies (aka public webpage)
        public: "../public",
        // Where the 'extension' of the server lies
        server: './server'
    },
    ldap: {
        // Object directly passed to ldapjs.createClient()
        client: {
            url: 'ldap://tgm.ac.at',
        }
    }
}