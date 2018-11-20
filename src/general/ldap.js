import ldapjs from 'ldapjs'
import {config} from "../config/config";

export const authentikateLdapUser = (email, password) => {
    // Create new Promise to be promise bases.
    return new Promise(((resolve, reject) => {
        // Create new client to connect to ldap
        let client = ldapjs.createClient(config.ldap.client)
        // Try to bind with username and password
        client.bind(email, password, (err) => {
            // Destroy the client to not keep the connection open all the time.
            client.destroy()
            // Check if an error occoured
            if (err) {
                // Checkk if that error was an InvalidCredentialsError. If it was the wrong credentials where supplied
                if (err instanceof ldapjs.InvalidCredentialsError) {
                    return resolve(false)
                }
                // If it is not an instance of InvalidCredentialsError there happened a other error. Reject
                return reject(err)
            }
            // If no error occurred the user was successfully authenticated
            return resolve(true)
        })
    }))
}

export const doesLdapUserExist = (email) => {
    // Create new Promise to be promise bases.
    return new Promise(((resolve, reject) => {
        // Create new client to connect to ldap
        let client = ldapjs.createClient(config.ldap.client)
        // Try to bind with username and password
        client.bind(config.ldap.user, config.ldap.password, () => {

            const opts = {
                filter: `(mail=${email})`,
                scope: 'sub',
                attributes: ['sn', 'givenName', 'mail', 'employeeType']
            }

            client.search(config.ldap.base, opts, (err, res) => {
                if (err) {
                    return reject(err)
                }

                let found = false

                res.on('searchEntry', function (entry) {
                    found = true
                    resolve(entry.object)
                });
                res.on('error', function (err) {
                    reject(err)
                });
                res.on('end', function (result) {
                    if(!found) {
                        resolve(false)
                    }
                });
            })
        })
    }))
}