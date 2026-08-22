import { Request, Response } from "express";
import {
  generateCertificate,
  verifyCertificateDetails,
  getCitizenCertificates,
} from "../services/certificate.service";
import path from "path";
import fs from "fs";
import { CERTIFICATES_DIR } from "../config/paths";

export async function generate(req: Request, res: Response) {
  try {
    const applicationId = req.params.applicationId as string;
    const result = await generateCertificate(applicationId);

    return res.status(200).json({
      success: true,
      message: "Certificate generated successfully.",
      data: result,
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
    const certificates = await getCitizenCertificates(userId);

    return res.status(200).json({
      success: true,
      data: certificates,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function viewInline(req: Request, res: Response) {
  try {
    const certParam = req.params.certificateNumber as string;
    const cleanNumber = certParam.replace(".pdf", "");
    const fileName = `${cleanNumber}.pdf`;
    const filePath = path.resolve(CERTIFICATES_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Certificate file not found on server.",
      });
    }

    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(fileName)}"`
    );

    return res.sendFile(filePath);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function download(req: Request, res: Response) {
  try {
    const fileName = req.params.fileName as string;
    const safeName = path.basename(fileName);
    const filePath = path.resolve(CERTIFICATES_DIR, safeName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Certificate file not found on server.",
      });
    }

    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.download(filePath, safeName);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function verify(req: Request, res: Response) {
  try {
    const certificateNumber = req.params.certificateNumber as string;
    const details = await verifyCertificateDetails(certificateNumber);

    if (!details) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found or invalid certificate number.",
      });
    }

    return res.status(200).json({
      success: true,
      data: details,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}