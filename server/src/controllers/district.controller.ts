import { Request, Response } from "express";
import {
  createDistrict,
  getAllDistricts,
} from "../services/district.service";
import { createDistrictSchema } from "../validators/district.validator";

export async function create(req: Request, res: Response) {
  try {
    const data = createDistrictSchema.parse(req.body);

    const district = await createDistrict(data);

    return res.status(201).json({
      success: true,
      message: "District created successfully",
      data: district,
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
    const districts = await getAllDistricts();

    return res.status(200).json({
      success: true,
      data: districts,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}