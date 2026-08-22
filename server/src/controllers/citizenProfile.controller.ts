import { Request, Response } from "express";
import {
  createProfile,
  getProfile,
  updateProfile,
} from "../services/citizenProfile.service";
import { createCitizenProfileSchema } from "../validators/citizenProfile.validator";

export async function create(req: Request, res: Response) {
  try {
    const data = createCitizenProfileSchema.parse(req.body);

    const profile = await createProfile(
      req.user!.id,
      data
    );

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: profile,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function get(req: Request, res: Response) {
  try {
    const profile = await getProfile(req.user!.id);

    return res.json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const profile = await updateProfile(
      req.user!.id,
      req.body
    );

    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}