import {userPermissions} from "../database/models/user";

/**
 * Checks if an request (to express) came from localhost.
 * @param req Express request
 * @returns {boolean} If request came from localhost
 */
export const isThisLocalhost = (req) => {
    let ip = req.connection.remoteAddress;
    let host = req.get('host');

    return ip === "127.0.0.1" || ip === "::ffff:127.0.0.1" || ip === "::1" || host.indexOf("localhost") !== -1;
}

export const getPermissionLevel = (level) => {
    if (isNaN(level)) {
        return userPermissions[level]
    } else {
        return level
    }
}

export const getPermissionLevelOfUser = (user) => {
    return getPermissionLevel(user.permission)
}

export const userPermissionBigerThan = (user, level) => {
    console.log(user.email, getPermissionLevelOfUser(user), level, getPermissionLevel(level))
    return getPermissionLevelOfUser(user) >= getPermissionLevel(level)
}