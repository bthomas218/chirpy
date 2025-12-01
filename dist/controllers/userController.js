import * as userService from "../services/userService.js";
export async function registerUser(req, res) {
    const { email, password } = req.body;
    const user = await userService.createUser(email, password);
    res.status(201).json(user);
}
export async function updateUser(req, res) {
    const { email, password } = req.body;
    const user = await userService.updateUserAccount(req.userID, {
        email: email,
        password: password,
    });
    res.status(200).json(user);
}
export async function upgradeUser(req, res) {
    const { event, data } = req.body;
    if (event !== "user.upgraded") {
        res.status(204).send();
    }
    else {
        await userService.updateUserAccount(data.userId, {
            isChirpyRed: true,
        });
        res.status(204).send();
    }
}
