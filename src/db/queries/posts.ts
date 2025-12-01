import { db } from "../index.js";
import { posts, NewPost } from "../schema.js";
import { asc, eq } from "drizzle-orm";

export async function createNewPost(post: NewPost) {
  const [result] = await db
    .insert(posts)
    .values(post)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getAllPosts() {
  const result = await db.select().from(posts).orderBy(asc(posts.createdAt));
  return result;
}

export async function getPostById(postID: string) {
  const [result] = await db.select().from(posts).where(eq(posts.id, postID));
  return result;
}
