import { Request, Response } from "express";
import {
  createClarificationQuery,
  replyClarificationQuery,
  getApplicationClarifications,
} from "../services/clarification.service";

export async function getClarifications(req: Request, res: Response) {
  try {
    const applicationId = req.params.applicationId as string;
    const list = await getApplicationClarifications(applicationId);
    return res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function createQuery(req: Request, res: Response) {
  try {
    const applicationId = req.params.applicationId as string;
    const { message } = req.body;
    const user = (req as any).user;

    const query = await createClarificationQuery(
      applicationId,
      user.id,
      user.role,
      message
    );

    return res.status(201).json({
      success: true,
      data: query,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function replyQuery(req: Request, res: Response) {
  try {
    const queryId = req.params.queryId as string;
    const { replyMessage, replyFileUrl } = req.body;
    const query = await replyClarificationQuery(
      queryId,
      replyMessage,
      replyFileUrl
    );

    return res.status(200).json({
      success: true,
      data: query,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
