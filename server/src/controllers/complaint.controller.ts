import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../config/prisma";

const createComplaintSchema = z.object({
  applicationId: z.string().uuid(),
  message: z.string().min(10, "Complaint message is too short"),
});

export const createComplaint = async (req: Request, res: Response) => {
  try {
    const data = createComplaintSchema.parse(req.body);
    const citizenId = req.user?.id; // Assuming auth middleware attaches user

    if (!citizenId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const application = await prisma.application.findUnique({
      where: { id: data.applicationId },
      select: { 
        applicantId: true, 
        currentStage: true,
        assignedDAId: true,
        assignedPatwariId: true,
        assignedTehsildarId: true
      }
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.applicantId !== citizenId) {
      return res.status(403).json({ message: "You can only complain about your own applications" });
    }

    // Determine the current officer holding the application
    let officerId = null;
    if (application.currentStage === "DA" || application.currentStage === "DA_REVIEW") officerId = application.assignedDAId;
    else if (application.currentStage === "PATWARI") officerId = application.assignedPatwariId;
    else if (application.currentStage === "TEHSILDAR") officerId = application.assignedTehsildarId;

    const complaint = await prisma.complaint.create({
      data: {
        applicationId: data.applicationId,
        citizenId,
        officerId,
        message: data.message,
        status: "OPEN",
      },
    });

    return res.status(201).json({ message: "Complaint submitted successfully", data: complaint });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Bad Request" });
  }
};

export const getAllComplaints = async (req: Request, res: Response) => {
  try {
    const complaints = await prisma.complaint.findMany({
      include: {
        citizen: { select: { fullName: true, email: true, phone: true } },
        officer: { select: { fullName: true, role: true } },
        application: { select: { applicationNumber: true, status: true, currentStage: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ data: complaints });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateComplaintSchema = z.object({
  status: z.enum(["OPEN", "INVESTIGATING", "RESOLVED", "DISMISSED"]),
  resolution: z.string().optional(),
});

export const updateComplaintStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = updateComplaintSchema.parse(req.body);

    const complaint = await prisma.complaint.update({
      where: { id },
      data,
    });

    return res.status(200).json({ message: "Complaint updated successfully", data: complaint });
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Bad Request" });
  }
};
