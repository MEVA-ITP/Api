export const search = (client, opts) => {
    return new Promise((resolve, reject) => {
        client.search('OU=People,OU=identity,DC=tgm,DC=ac,DC=at', opts, function (err, res) {
            if (err) {
                reject(err)
            }
            res.on('searchEntry', function (entry) {
                resolve(entry)
            });
            res.on('searchReference', function (referral) {
                // IDK what is
                reject(new Error("Don't know how to handle reference"))
                console.log('referral: ' + referral.uris.join());
            });
            res.on('error', function (err) {
                reject(err)
            });
        });
    })
}

export const bind = (client, dn, pw) => {
    return new Promise(((resolve, reject) => {
        client.bind(dn, pw, function (err) {
            if(err) return reject(err)
            resolve()
        })
    }))
}