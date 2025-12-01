import type { Request, Response } from "express";
import * as authService from "../services/authService.js";

export async function loginUser(
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
) {
  const { email, password } = req.body;

  const user = await authService.loginUser(email, password);

  res.status(200).json(user);
}

export async function refreshUser(req: Request, res: Response) {
  const token = await authService.getAcessToken(req.auth as string);
  res.status(200).json({ token: token });
}

export async function revokeToken(req: Request, res: Response) {
  await authService.revokeUserToken(req.auth as string);
  res.status(204).send();
}
