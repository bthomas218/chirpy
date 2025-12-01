import { BadRequestError, ForbiddenError, NotFoundError, } from "../utils/errorClasses.js";
import { PROFANITIES } from "../config.js";
import { createNewPost, deletePostbyID, getAllPosts, getPostById, } from "../db/queries/posts.js";
export function validatechirp(body) {
    if (body.length <= 140) {
        const cleanedBody = body
            .split(" ")
            .map((word) => {
            if (PROFANITIES.includes(word.toLowerCase())) {
                return "****";
            }
            return word;
        })
            .join(" ");
        return cleanedBody;
    }
    else {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
}
/**
 * Posts a chirp to chirpy app
 * @param body the body of the chirp
 * @param userID the user posting the chirp
 * @returns the created chirp
 */
export async function postChirp(body, userID) {
    return await createNewPost({ body: body, userId: userID });
}
/**
 * list all chirps from the database
 * @returns an array of post objects
 */
export async function listAllChirps() {
    return await getAllPosts();
}
/**
 * Get a chirp by its id
 * @param chirpID id of the chirp to get
 * @returns a post object
 */
export async function getChirpByID(chirpID) {
    const chirp = await getPostById(chirpID);
    if (!chirp)
        throw new NotFoundError("Chirp not found");
    return chirp;
}
/**
 * Deletes chirp in the db if it exists and the user is the author of the chirp
 */
export async function unpostChirp(chirpID, userID) {
    const chirp = await getChirpByID(chirpID);
    const authorID = chirp.userId;
    if (authorID !== userID)
        throw new ForbiddenError("Forbidden");
    await deletePostbyID(chirp.id);
}
