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

export async function listChirps(
  req: Request<{ authorId: string; sort: string }>,
  res: Response
) {
  let { authorId } = req.query;
  const sortQuery = req.query.sort;
  let sort: "asc" | "desc" | undefined;
  let chirps;
  if (typeof authorId === "string") {
    chirps = await chirpService.listAllChirpsByAuthor(authorId);
  } else {
    chirps = await chirpService.listAllChirps();
  }
  if (typeof sortQuery === "string") {
    switch (sortQuery) {
      case "asc":
        sort = sortQuery;
        break;
      case "desc":
        sort = sortQuery;
        break;
      default:
        break;
    }
  }
  chirps = chirpService.sortChirps(sort, chirps);
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
