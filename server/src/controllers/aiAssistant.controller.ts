import { Request, Response } from "express";
import { handleAssistantQuery } from "../services/aiAssistant.service";

export async function askAssistant(req: Request, res: Response) {
  try {
    const { message, applicationId } = req.body;
    const userId = (req as any).user ? (req as any).user.id : "anonymous";

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const reply = await handleAssistantQuery(userId, message, applicationId);

    return res.status(200).json({
      success: true,
      data: reply,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
