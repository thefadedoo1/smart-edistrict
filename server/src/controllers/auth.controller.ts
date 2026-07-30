import { Request, Response } from "express";
import { registerSchema } from "../validators/auth.validator";
import { loginSchema } from "../validators/login.validator";

import {
  registerUser,
  loginUser,
} from "../services/auth.service";

// =======================
// Register Controller
// =======================
export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data);

    const { password, ...result } = user;

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// =======================
// Login Controller
// =======================
export async function login(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body);

    const result = await loginUser(data);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
}