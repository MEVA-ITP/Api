export const userPermissions = {
    "none": 0,
    "user": 100,
    "student": 200,
    "teacher": 300,
    "admin": 400,
    "owner": 500,
    "herobrine": 999,
}

for(let key of Object.keys(userPermissions)) {
    module.exports[key.toUpperCase()] = key
}

export const ldapTypeMapping = {
    schueler: module.exports.STUDENT,
    lehrer: module.exports.TEACHER,
}

export const getUserPermissionByLdapType = (ldapType) => {
    if(ldapType in ldapTypeMapping) {
        return ldapTypeMapping[ldapType]
    }
    return undefined
}

export const getPermissionLevel = (level) => {
    if (isNaN(level)) {
        return userPermissions[level]
    } else {
        return level
    }
}

export const getPermissionLevelOfUser = (user) => {
    if(user === undefined || !("permission" in user)) {
        return userPermissions.none
    }
    return getPermissionLevel(user.permission)
}

export const userPermissionBigerThan = (user, level) => {
    if(process.env.NODE_ENV === "development") {
        return true
    }
    return getPermissionLevelOfUser(user) >= getPermissionLevel(level)
}