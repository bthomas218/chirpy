import * as userService from "../services/userService.js";
export async function registerUser(req, res) {
    const { email, password } = req.body;
    const user = await userService.createUser(email, password);
    res.status(201).json(user);
}
