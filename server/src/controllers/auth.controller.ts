import { Request, Response } from "express";
import { registerSchema } from "../validators/auth.validator";
import { ZodError } from "zod";
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
    let message = error.message;
    if (error instanceof ZodError) {
      message = (error as any).errors.map((e: any) => e.message).join(", ");
    }
    return res.status(400).json({
      success: false,
      message,
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
    let message = error.message;
    if (error instanceof ZodError) {
      message = (error as any).errors.map((e: any) => e.message).join(", ");
    }
    return res.status(401).json({
      success: false,
      message,
    });
  }
}

// =======================
// Forgot Password Controller
// =======================
export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // We don't import forgotPasswordUser dynamically, wait, we need to import it at the top or we can just require it here or update the top imports. 
    // I will use require here for simplicity, or I can update the top import using another tool call later if needed.
    const { forgotPasswordUser } = require("../services/auth.service");
    await forgotPasswordUser(email);

    return res.status(200).json({
      success: true,
      message: "Password reset instructions sent",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// =======================
// Reset Password Controller
// =======================
export async function resetPassword(req: Request, res: Response) {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and newPassword are required",
      });
    }

    const { resetPasswordUser } = require("../services/auth.service");
    await resetPasswordUser(email, otp, newPassword);

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to reset password",
    });
  }
}