import { Request, Response } from "express";
import {
  getAdminAnalytics,
  getOfficerLeaderboard,
  getWorkloadBalancingRecommendations,
  reassignApplications,
} from "../services/admin.service";
import { checkEscalations } from "../services/escalation.service";

export async function getAnalytics(req: Request, res: Response) {
  try {
    const analytics = await getAdminAnalytics();
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getLeaderboard(req: Request, res: Response) {
  try {
    const leaderboard = await getOfficerLeaderboard();
    return res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getWorkloadRecommendations(req: Request, res: Response) {
  try {
    const result = await getWorkloadBalancingRecommendations();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function reassign(req: Request, res: Response) {
  try {
    const { fromOfficerId, toOfficerId, count } = req.body;
    const adminId = (req as any).user.id;

    const result = await reassignApplications({
      fromOfficerId,
      toOfficerId,
      count: Number(count) || 1,
      adminId,
    });

    return res.status(200).json({
      success: true,
      message: `Successfully transferred ${result.transferredCount} files from ${result.fromOfficer} to ${result.toOfficer}`,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function triggerEscalationCheck(req: Request, res: Response) {
  try {
    const result = await checkEscalations();
    return res.status(200).json({
      success: true,
      message: `Escalation scan complete. Escalated ${result.escalatedCount} overdue applications.`,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
