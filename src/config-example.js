export const config = {
    db: {
        uri: 'mongodb://localhost:27017/onquip',
    },
    paths: {
        public: "../public",
        server: './server'
    },
    ldap: {
        url: 'ldap://tgm.ac.at',
        user: 'dlangheiter@tgm.ac.at',
        pw: '',
    }
}