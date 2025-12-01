import * as chirpService from "../services/chripService.js";
export async function postChirp(req, res) {
    const { body } = req.body;
    const cleanedBody = chirpService.validatechirp(body);
    const chirp = await chirpService.postChirp(cleanedBody, req.userID);
    res.status(201).json(chirp);
}
export async function listChirps(req, res) {
    const chirps = await chirpService.listAllChirps();
    res.status(200).json(chirps);
}
export async function getChirp(req, res) {
    const { id } = req.params;
    const chirp = await chirpService.getChirpByID(id);
    res.status(200).send(chirp);
}
