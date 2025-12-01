import { Request, Response } from "express";
import * as chirpService from "../services/chripService.js";

export async function postChirp(
  req: Request<{}, {}, { body: string }>,
  res: Response
) {
  const { body } = req.body;
  const cleanedBody = chirpService.validatechirp(body);
  const chirp = await chirpService.postChirp(cleanedBody, req.userID as string);
  res.status(201).json(chirp);
}

export async function listChirps(req: Request, res: Response) {
  const chirps = await chirpService.listAllChirps();
  res.status(200).json(chirps);
}

export async function getChirp(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;
  const chirp = await chirpService.getChirpByID(id);
  res.status(200).send(chirp);
}

export async function deleteChirp(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;
  await chirpService.unpostChirp(id, req.userID as string);
  res.status(204).send();
}
