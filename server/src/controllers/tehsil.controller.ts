import { Request, Response } from "express";
import {
  createTehsil,
  getAllTehsils,
  getTehsilsByDistrict,
} from "../services/tehsil.service";
import { createTehsilSchema } from "../validators/tehsil.validator";

export async function create(req: Request, res: Response) {
  try {
    const data = createTehsilSchema.parse(req.body);
    const tehsil = await createTehsil(data);

    return res.status(201).json({
      success: true,
      message: "Tehsil created successfully",
      data: tehsil,
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
    const tehsils = await getAllTehsils();
    return res.status(200).json({
      success: true,
      data: tehsils,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getByDistrict(req: Request, res: Response) {
  try {
    const districtId = req.params.districtId as string;
    const tehsils = await getTehsilsByDistrict(districtId);

    return res.status(200).json({
      success: true,
      data: tehsils,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}