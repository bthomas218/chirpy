import { getUserByEmail } from "../db/queries/users.js";
import { createRefreshToken } from "../db/queries/refreshTokens.js";
import { makeJWT, verifyPassword, makeRefreshToken, } from "../services/auth.js";
import { UnauthorizedError, NotFoundError } from "../utils/errorClasses.js";
import config from "../config.js";
export async function loginUser(req, res) {
    const user = await getUserByEmail(req.body.email);
    if (user) {
        if (await verifyPassword(req.body.password, user.password)) {
            const userResponse = user;
            userResponse.token = makeJWT(user.id, 3600, config.jwtSecret);
            userResponse.refreshToken = makeRefreshToken();
            createRefreshToken({
                userId: user.id,
                token: userResponse.refreshToken,
                expiresAt: new Date(new Date(Date.now() + 1000 * 60 * 60 * 24 * 60)),
            });
            res.status(200).json(userResponse);
        }
        else {
            throw new UnauthorizedError("Invalid Username or Password");
        }
    }
    else {
        throw new NotFoundError("User not found");
    }
}
