import { hashPassword } from "../utils/auth.js";
import { createUserInDb, updateUserByID } from "../db/queries/users.js";
import { omit } from "../utils/typing.js";
/**
 * Creates a new user for the database
 * @param email Email of the new user to create
 * @param password Password of the new user to create
 * @returns The new user object without the password
 */
export async function createUser(email, password) {
    const passwordHash = await hashPassword(password);
    const user = await createUserInDb({ email: email, password: passwordHash });
    return omit(user, ["password"]);
}
/**
 * Updates the email and password values of a user in the database
 * @param email The new email
 * @param password The new password
 * @param userID The id of the user to update
 * @returns The updated user object without the password
 */
export async function updateUserCredentials(email, password, userID) {
    const passwordHash = await hashPassword(password);
    const user = await updateUserByID(userID, {
        email: email,
        password: passwordHash,
    });
    return omit(user, ["password"]);
}
