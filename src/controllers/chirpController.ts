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

export async function listChirps(req: Request, res: Response) {}

export async function getChirp(req: Request, res: Response) {}
