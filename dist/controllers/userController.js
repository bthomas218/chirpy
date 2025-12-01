import * as userService from "../services/userService.js";
export async function registerUser(req, res) {
    const { email, password } = req.body;
    const user = await userService.createUser(email, password);
    res.status(201).json(user);
}
export async function updateUser(req, res) {
    const { email, password } = req.body;
    const user = await userService.updateUserCredentials(email, password, req.userID);
    res.status(200).json(user);
}
