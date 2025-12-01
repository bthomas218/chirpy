import { UnauthorizedError } from "../utils/errorClasses.js";
/**
 * Extracts bearer token from authorization header
 * @param req The request object now with the token attached
 * @param res The response object
 * @param next The next function
 */
const extractTokenMiddleware = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader)
        throw new UnauthorizedError("Unauthorized");
    req.token = authHeader.replace("Bearer", "").trim();
    next();
};
export default extractTokenMiddleware;
