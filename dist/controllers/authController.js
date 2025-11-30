import * as authService from "../services/authService.js";
export async function loginUser(req, res) {
    const { email, password } = req.body;
    const { user, token, refreshToken } = await authService.loginUser(email, password);
    res.status(200).json({ user, token, refreshToken });
}
export async function refreshUser(req, res) {
    const token = await authService.getAcessToken(req.token);
    res.status(200).json({ token: token });
}
