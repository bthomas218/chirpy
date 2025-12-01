import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUserInDb(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function updateUserByID(userID: string, user: NewUser) {
  const [result] = await db
    .update(users)
    .set(user)
    .where(eq(users.id, userID))
    .returning();
  return result;
}

export async function getUserByEmail(email: string) {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
}

//TODO: add query to mark users as chirpy red members
