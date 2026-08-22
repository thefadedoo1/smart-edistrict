import { Request, Response } from "express";
import {
  createCertificateService,
  deleteCertificateService,
  getAllCertificateServices,
  getCertificateServiceByCode,
  updateCertificateService,
} from "../services/certificateService.service";
import { createCertificateServiceSchema } from "../validators/certificateService.validator";

export async function create(req: Request, res: Response) {
  try {
    const data = createCertificateServiceSchema.parse(req.body);
    const service = await createCertificateService(data);

    return res.status(201).json({
      success: true,
      message: "Certificate service created successfully",
      data: service,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAll(req: Request, res: Response) {
  const services = await getAllCertificateServices();
  return res.json({
    success: true,
    data: services,
  });
}

export async function getByCode(req: Request, res: Response) {
  try {
    const code = req.params.code as string;
    const service = await getCertificateServiceByCode(code);

    return res.json({
      success: true,
      data: service,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const service = await updateCertificateService(id, req.body);

    return res.json({
      success: true,
      message: "Certificate service updated successfully",
      data: service,
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
    await deleteCertificateService(id);

    return res.json({
      success: true,
      message: "Certificate service deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}