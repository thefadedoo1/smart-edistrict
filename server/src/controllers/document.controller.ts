import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
} from "../services/document.service";
import { UPLOADS_DIR } from "../config/paths";

export async function upload(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { requiredDocumentId } = req.body;

    if (!requiredDocumentId) {
      return res.status(400).json({
        success: false,
        message: "Required document is missing",
      });
    }

    const applicationId = req.params.applicationId as string;

    const document = await uploadDocument(
      applicationId,
      requiredDocumentId,
      req.file
    );

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const applicationId = req.params.applicationId as string;
    const documents = await getDocuments(applicationId);

    return res.json({
      success: true,
      data: documents,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function viewFile(req: Request, res: Response) {
  try {
    const documentId = req.params.id as string;
    const doc = await getDocumentById(documentId);

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Document record not found.",
      });
    }

    // Extract filename from fileUrl or fallback
    const rawFileName = doc.fileUrl.startsWith("/uploads/")
      ? doc.fileUrl.replace("/uploads/", "")
      : doc.fileUrl;

    const filePath = path.resolve(UPLOADS_DIR, rawFileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File does not exist on storage disk.",
      });
    }

    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", doc.mimeType || "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(doc.originalFileName)}"`
    );

    return res.sendFile(filePath);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function viewFileByName(req: Request, res: Response) {
  try {
    const fileName = req.params.fileName as string;
    // prevent directory traversal
    const safeName = path.basename(fileName);
    const filePath = path.resolve(UPLOADS_DIR, safeName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    const ext = path.extname(safeName).toLowerCase();
    let mime = "application/pdf";
    if (ext === ".jpg" || ext === ".jpeg") mime = "image/jpeg";
    if (ext === ".png") mime = "image/png";

    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", mime);
    res.setHeader("Content-Disposition", `inline; filename="${safeName}"`);

    return res.sendFile(filePath);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}