import { UnauthorizedError } from "../utils/errorClasses.js";
/**
 * Extracts info like tokens and api keys from authorization header
 * @param req The request object now with the token attached
 * @param res The response object
 * @param next The next function
 */
const extractAuthorizationMiddleware = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader)
        throw new UnauthorizedError("Unauthorized");
    req.auth = authHeader.replace("Bearer", "").trim();
    next();
};
export default extractAuthorizationMiddleware;
