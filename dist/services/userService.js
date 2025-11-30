import { hashPassword } from "../utils/auth.js";
import { createUserInDb } from "../db/queries/users.js";
import { omit } from "../utils/typing.js";
/**
 * Creates a new user for the database
 * @param email Email of the new user to create
 * @param password Password of the new user to create
 * @returns The information about the new user without the password
 */
export async function createUser(email, password) {
    const passwordHash = await hashPassword(password);
    const user = await createUserInDb({ email: email, password: passwordHash });
    return omit(user, ["password"]);
}
