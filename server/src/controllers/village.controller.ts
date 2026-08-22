import { Request, Response } from "express";
import {
  createVillage,
  getAllVillages,
  getVillagesByTehsil,
} from "../services/village.service";
import { createVillageSchema } from "../validators/village.validator";

export async function create(req: Request, res: Response) {
  try {
    const data = createVillageSchema.parse(req.body);
    const village = await createVillage(data);

    return res.status(201).json({
      success: true,
      message: "Village created successfully",
      data: village,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAll(req: Request, res: Response) {
  const villages = await getAllVillages();
  return res.json({
    success: true,
    data: villages,
  });
}

export async function getByTehsil(req: Request, res: Response) {
  try {
    const tehsilId = req.params.tehsilId as string;
    const villages = await getVillagesByTehsil(tehsilId);

    return res.json({
      success: true,
      data: villages,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}