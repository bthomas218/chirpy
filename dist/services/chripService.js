import { BadRequestError } from "../utils/errorClasses.js";
import { PROFANITIES } from "../config.js";
import { createNewPost, getAllPosts } from "../db/queries/posts.js";
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
 * Returns all chirps from the database
 */
export async function listAllChirps() {
    return await getAllPosts();
}
