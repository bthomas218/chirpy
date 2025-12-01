import { validateJWT } from "../utils/auth.js";
import config from "../config.js";
/**
 * Extracts user from JWT (only use on routes you know the bearertoken will be jwt)
 * @param req The request object now with the usedID from the JWT attached
 * @param res The response object
 * @param next The nextfunction
 */
const extractUserMiddleware = (req, res, next) => {
    const userID = validateJWT(req.token, config.jwtSecret);
    req.userID = userID;
    next();
};
export default extractUserMiddleware;
