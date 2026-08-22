import { Request, Response } from "express";
import {
  createApplication,
  getApplicationById,
  getMyApplications,
  submitApplication,
  updateApplicationData,
  resubmitApplicationCorrection,
} from "../services/application.service";
import {
  createApplicationSchema,
  updateApplicationSchema,
} from "../validators/application.validator";

export async function create(req: Request, res: Response) {
  try {
    const data = createApplicationSchema.parse(req.body);
    const userId = (req as any).user!.id;

    const application = await createApplication(userId, data);

    return res.status(201).json({
      success: true,
      message: "Application draft saved successfully",
      data: application,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const userId = (req as any).user!.id;
    const data = updateApplicationSchema.parse(req.body);

    const application = await updateApplicationData(id, userId, data);

    return res.json({
      success: true,
      message: "Application updated successfully",
      data: application,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function resubmit(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const userId = (req as any).user!.id;
    const { remarks } = req.body || {};

    const application = await resubmitApplicationCorrection(id, userId, remarks);

    return res.json({
      success: true,
      message: "Corrected application resubmitted successfully",
      data: application,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getMy(req: Request, res: Response) {
  try {
    const userId = (req as any).user!.id;
    const applications = await getMyApplications(userId);

    return res.json({
      success: true,
      data: applications,
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
    const application = await getApplicationById(id);

    return res.json({
      success: true,
      data: application,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

export async function submit(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const userId = (req as any).user!.id;

    const application = await submitApplication(id, userId);

    return res.json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}