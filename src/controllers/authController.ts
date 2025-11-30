// TODO: make auth controllers
import type { Request, Response } from "express";
import * as authService from "../services/authService.js";

export async function loginUser(
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
) {
  const { email, password } = req.body;

  const { user, token, refreshToken } = await authService.loginUser(
    email,
    password
  );

  res.status(200).json({ user, token, refreshToken });
}
