import ldapjs from 'ldapjs'
import {config} from "../config";

export const authentikateLdapUser = (email, password) => {
    return new Promise(((resolve, reject) => {
        let client = ldapjs.createClient(config.ldap.client)
        client.bind(email, password, (err) => {
            client.destroy()
            if (err) {
                if (err instanceof ldapjs.InvalidCredentialsError) {
                    return resolve(false)
                }
                return reject(err)
            }
            return resolve(true)
        })
    }))
}