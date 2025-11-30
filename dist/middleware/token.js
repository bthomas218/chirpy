import { UnauthorizedError } from "../utils/errorClasses.js";
const extractTokenMiddleware = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader)
        throw new UnauthorizedError("Unauthorized");
    req.token = authHeader.replace("Bearer", "").trim();
    next();
};
export default extractTokenMiddleware;
