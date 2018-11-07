export const isThisLocalhost = (req) => {
    let ip = req.connection.remoteAddress;
    let host = req.get('host');

    return ip === "127.0.0.1" || ip === "::ffff:127.0.0.1" || ip === "::1" || host.indexOf("localhost") !== -1;
}