import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getOverallReport = async (req: Request, res: Response) => {
  try {
    const totalApplications = await prisma.application.count();
    const approved = await prisma.application.count({ where: { status: "APPROVED" } });
    const rejected = await prisma.application.count({ where: { status: "REJECTED" } });
    const pending = await prisma.application.count({ where: { status: "IN_PROGRESS" } });
    const escalated = await prisma.application.count({ where: { isEscalated: true } });
    const complaints = await prisma.complaint.count();

    return res.status(200).json({
      data: {
        totalApplications,
        approved,
        rejected,
        pending,
        escalated,
        complaints
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getDistrictReport = async (req: Request, res: Response) => {
  try {
    const districts = await prisma.district.findMany({
      include: {
        citizenProfiles: {
          select: {
            user: {
              select: { applications: true }
            }
          }
        }
      }
    });

    const report = districts.map(d => {
      let total = 0;
      let approved = 0;
      let pending = 0;
      let escalated = 0;

      d.citizenProfiles.forEach(p => {
        p.user?.applications.forEach(app => {
          total++;
          if (app.status === "APPROVED") approved++;
          if (app.status === "IN_PROGRESS") pending++;
          if (app.isEscalated) escalated++;
        });
      });

      return {
        id: d.id,
        name: d.name,
        total,
        approved,
        pending,
        escalated
      };
    });

    return res.status(200).json({ data: report });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTehsilReport = async (req: Request, res: Response) => {
  try {
    const { districtId } = req.query;
    
    const tehsils = await prisma.tehsil.findMany({
      where: districtId ? { districtId: String(districtId) } : {},
      include: {
        district: true,
        citizenProfiles: {
          select: {
            user: {
              select: { applications: true }
            }
          }
        }
      }
    });

    const report = tehsils.map(t => {
      let total = 0;
      let approved = 0;
      let pending = 0;
      let escalated = 0;

      t.citizenProfiles.forEach(p => {
        p.user?.applications.forEach(app => {
          total++;
          if (app.status === "APPROVED") approved++;
          if (app.status === "IN_PROGRESS") pending++;
          if (app.isEscalated) escalated++;
        });
      });

      return {
        id: t.id,
        name: t.name,
        districtName: t.district.name,
        total,
        approved,
        pending,
        escalated
      };
    });

    return res.status(200).json({ data: report });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOfficerReport = async (req: Request, res: Response) => {
  try {
    const officers = await prisma.user.findMany({
      where: { role: { in: ["DA", "PATWARI", "TEHSILDAR"] } },
      include: {
        assignedAsDA: { select: { id: true, status: true, isEscalated: true } },
        assignedAsPatwari: { select: { id: true, status: true, isEscalated: true } },
        assignedAsTehsildar: { select: { id: true, status: true, isEscalated: true } },
        officerComplaints: { select: { id: true } }
      }
    });

    const report = officers.map(officer => {
      let apps = officer.role === "DA" ? officer.assignedAsDA :
                 officer.role === "PATWARI" ? officer.assignedAsPatwari :
                 officer.assignedAsTehsildar;

      const totalAssigned = apps.length;
      const completed = apps.filter(a => a.status === "APPROVED" || a.status === "REJECTED").length;
      const pending = apps.filter(a => a.status === "IN_PROGRESS").length;
      const escalated = apps.filter(a => a.isEscalated).length;
      const complaints = officer.officerComplaints.length;

      return {
        id: officer.id,
        fullName: officer.fullName,
        role: officer.role,
        email: officer.email,
        totalAssigned,
        completed,
        pending,
        escalated,
        complaints
      };
    });

    return res.status(200).json({ data: report });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
