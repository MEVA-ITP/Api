import {ArgumentParser} from 'argparse'
import bcrypt from 'bcrypt'
import {database, User} from "../database";
import {userPermissions} from "../config/userPermissions";

const run = async (args) => {
    if (args.external) {
        if (args.fname === null) {
            throw new Error("Fname not given")
        }
        if (args.lname === null) {
            throw new Error("Lname not given")
        }
        if (args.password === null) {
            throw new Error("Password not given")
        }

        args.password = await bcrypt.hash(args.password, 10)
    } else {
        delete args['fname']
        delete args['lname']
        delete args['password']
    }
    args.active = true

    await new User(args).save()
}

let parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: "Adds an user to the mongodb"
})

parser.addArgument(
    ["-m", "--mail"],
    {help: "Email for the user", required: true, dest: "email"}
)

parser.addArgument(
    ["-p", "--phone"],
    {help: "Phone-number for the user", required: true}
)

parser.addArgument(
    ["-e", "--external"],
    {help: "If the user is external (default: false)", defaultValue: false, action: "storeTrue"}
)

parser.addArgument(
    ["--permission"],
    {
        help: "Permission level of the user (default: admin)",
        choices: Object.keys(userPermissions),
        defaultValue: "admin"
    }
)

parser.addArgument(
    ["-f", "--fname"],
    {help: "Firstname of the user (only if external)"}
)

parser.addArgument(
    ["-l", "--lname"],
    {help: "Lastname of the user (only if external)"}
)

parser.addArgument(
    ["--password"],
    {help: "Password of the user (only if external)"}
)

run(parser.parseArgs())
    .then(() => console.log("Finished execution"))
    .catch((e) => console.error(e.message))
    .finally(() => {
        database.close()
    })