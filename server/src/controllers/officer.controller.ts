import { Request, Response } from "express";
import {
  createOfficer,
  getAllOfficers,
  getOfficerById,
  updateOfficer,
  deleteOfficer,
} from "../services/officer.service";
import { createOfficerSchema } from "../validators/officer.validator";

export async function create(req: Request, res: Response) {
  try {
    const data = createOfficerSchema.parse(req.body);
    const officer = await createOfficer(data);

    return res.status(201).json({
      success: true,
      message: "Officer created successfully",
      data: officer,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const officers = await getAllOfficers();
    return res.json({
      success: true,
      data: officers,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const officer = await getOfficerById(id);

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: "Officer not found",
      });
    }

    return res.json({
      success: true,
      data: officer,
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
    const id = req.params.id as string;
    const officer = await updateOfficer(id, req.body);

    return res.json({
      success: true,
      message: "Officer updated successfully",
      data: officer,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    await deleteOfficer(id);

    return res.json({
      success: true,
      message: "Officer deactivated successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}