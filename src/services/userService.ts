import { hashPassword } from "../utils/auth.js";
import { createUserInDb, updateUserByID } from "../db/queries/users.js";
import { omit } from "../utils/typing.js";
import { NewUser } from "src/db/schema.js";
import { updateUser } from "src/controllers/userController.js";

/**
 * Creates a new user for the database
 * @param email Email of the new user to create
 * @param password Password of the new user to create
 * @returns The new user object without the password
 */
export async function createUser(email: string, password: string) {
  const passwordHash = await hashPassword(password);
  const user = await createUserInDb({ email: email, password: passwordHash });
  return omit(user, ["password"]);
}

/**
 * Updates any fields of a user in the database
 * @param userID The id of the user to update
 * @returns The updated user object without the password
 */
export async function updateUserAccount(userID: string, data: NewUser) {
  if (data.password) {
    data.password = await hashPassword(data.password);
  }
  const user = await updateUserByID(userID, data);
  return omit(user, ["password"]);
}
