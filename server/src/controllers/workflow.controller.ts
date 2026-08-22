import { Request, Response } from "express";
import { workflowActionSchema } from "../validators/workflow.validator";
import {
  getPendingApplications,
  getWorkflowHistory,
  processWorkflowAction,
  getWorkflowDashboard,
} from "../services/workflow.service";
import { checkEscalations } from "../services/escalation.service";

export async function pending(req: Request, res: Response) {
  try {
    await checkEscalations();

    const user = (req as any).user!;
    const applications = await getPendingApplications(user.role, user.id);

    return res.json({
      success: true,
      data: applications,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function dashboard(req: Request, res: Response) {
  try {
    await checkEscalations();

    const user = (req as any).user!;
    const data = await getWorkflowDashboard(user.role, user.id);

    return res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function history(req: Request, res: Response) {
  try {
    const applicationId = req.params.applicationId as string;
    const data = await getWorkflowHistory(applicationId);

    return res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

export async function officerHistory(req: Request, res: Response) {
  try {
    const user = (req as any).user!;
    const data = await require("../services/workflow.service").getOfficerHistoryList(user.id);

    return res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function process(req: Request, res: Response) {
  try {
    const { action, remarks } = workflowActionSchema.parse(req.body);
    const applicationId = req.params.applicationId as string;
    const user = (req as any).user!;

    const application = await processWorkflowAction(
      applicationId,
      user.id,
      user.role,
      action,
      remarks
    );

    return res.json({
      success: true,
      message: `Application ${action.toLowerCase()} successfully`,
      data: application,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}