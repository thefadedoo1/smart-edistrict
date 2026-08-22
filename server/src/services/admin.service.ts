import prisma from "../config/prisma";
import { ApplicationStatus, Role, WorkflowStage } from "@prisma/client";
import { isOverdue, getStageSLAInfo } from "./sla.service";
import { checkEscalations } from "./escalation.service";
import { logAuditEvent } from "./audit.service";

export async function getAdminAnalytics() {
  const [
    totalUsers,
    totalOfficers,
    totalApplications,
    approvedApplications,
    rejectedApplications,
    inProgressApplications,
    escalatedApplications,
    servicesCount,
    districtsCount,
  ] = await Promise.all([
    prisma.user.count({ where: { role: Role.CITIZEN } }),
    prisma.user.count({
      where: {
        role: { in: [Role.DA, Role.PATWARI, Role.TEHSILDAR] },
        isActive: true,
      },
    }),
    prisma.application.count({ where: { isSubmitted: true } }),
    prisma.application.count({ where: { status: ApplicationStatus.APPROVED } }),
    prisma.application.count({ where: { status: ApplicationStatus.REJECTED } }),
    prisma.application.count({
      where: {
        status: { in: [ApplicationStatus.SUBMITTED, ApplicationStatus.IN_PROGRESS] },
      },
    }),
    prisma.application.count({
      where: { isEscalated: true, status: { notIn: [ApplicationStatus.APPROVED, ApplicationStatus.REJECTED] } },
    }),
    prisma.certificateService.count({ where: { isActive: true } }),
    prisma.district.count(),
  ]);

  // SLA Compliance
  const activeApps = await prisma.application.findMany({
    where: {
      isSubmitted: true,
      status: { notIn: [ApplicationStatus.APPROVED, ApplicationStatus.REJECTED] },
    },
    select: { stageDeadline: true, stageStartedAt: true },
  });

  const overdueCount = activeApps.filter((a) => isOverdue(a.stageDeadline)).length;
  const slaCompliance =
    activeApps.length === 0
      ? 100
      : Math.round(((activeApps.length - overdueCount) / activeApps.length) * 100);

  // Tehsil breakdown
  const tehsils = await prisma.tehsil.findMany({
    take: 8,
    include: {
      district: true,
      users: {
        where: { role: { in: [Role.DA, Role.PATWARI, Role.TEHSILDAR] } },
      },
    },
  });

  const tehsilPerformance = await Promise.all(
    tehsils.map(async (t) => {
      const pendingCount = await prisma.application.count({
        where: {
          OR: [
            { assignedDA: { tehsilId: t.id } },
            { assignedPatwari: { tehsilId: t.id } },
            { assignedTehsildar: { tehsilId: t.id } },
          ],
          status: { in: [ApplicationStatus.SUBMITTED, ApplicationStatus.IN_PROGRESS] },
        },
      });

      const approvedCount = await prisma.application.count({
        where: {
          OR: [
            { assignedDA: { tehsilId: t.id } },
            { assignedPatwari: { tehsilId: t.id } },
            { assignedTehsildar: { tehsilId: t.id } },
          ],
          status: ApplicationStatus.APPROVED,
        },
      });

      return {
        id: t.id,
        tehsilName: t.name,
        districtName: t.district.name,
        officersCount: t.users.length,
        pendingFiles: pendingCount,
        approvedFiles: approvedCount,
        healthStatus: pendingCount > 15 ? "CRITICAL" : pendingCount > 8 ? "WARNING" : "HEALTHY",
      };
    })
  );

  return {
    overview: {
      totalUsers,
      totalOfficers,
      totalApplications,
      approvedApplications,
      rejectedApplications,
      inProgressApplications,
      escalatedApplications,
      overdueCount,
      slaCompliance,
      servicesCount,
      districtsCount,
    },
    tehsilPerformance,
  };
}

export async function getOfficerLeaderboard() {
  const officers = await prisma.user.findMany({
    where: {
      role: { in: [Role.DA, Role.PATWARI, Role.TEHSILDAR] },
      isActive: true,
    },
    include: {
      district: true,
      tehsil: true,
      village: true,
      workflowHistory: {
        take: 50,
      },
    },
  });

  const leaderboard = await Promise.all(
    officers.map(async (officer) => {
      // Pending applications
      const pendingCount = await prisma.application.count({
        where: {
          OR: [
            { assignedDAId: officer.id, currentStage: { in: [WorkflowStage.DA, WorkflowStage.DA_REVIEW] } },
            { assignedPatwariId: officer.id, currentStage: WorkflowStage.PATWARI },
            { assignedTehsildarId: officer.id, currentStage: WorkflowStage.TEHSILDAR },
          ],
          status: { in: [ApplicationStatus.SUBMITTED, ApplicationStatus.IN_PROGRESS] },
        },
      });

      // Resolved / processed applications count
      const processedCount = officer.workflowHistory.length;

      // Calculate SLA compliance for this officer
      const overdueFiles = await prisma.application.count({
        where: {
          OR: [
            { assignedDAId: officer.id, currentStage: { in: [WorkflowStage.DA, WorkflowStage.DA_REVIEW] } },
            { assignedPatwariId: officer.id, currentStage: WorkflowStage.PATWARI },
            { assignedTehsildarId: officer.id, currentStage: WorkflowStage.TEHSILDAR },
          ],
          stageDeadline: { lt: new Date() },
          status: { in: [ApplicationStatus.SUBMITTED, ApplicationStatus.IN_PROGRESS] },
        },
      });

      const compliance =
        pendingCount === 0 ? 100 : Math.max(0, Math.round(((pendingCount - overdueFiles) / pendingCount) * 100));

      const ratingScore = Number(
        (4.0 + (compliance / 100) * 0.9 - (pendingCount > 10 ? 0.4 : 0)).toFixed(1)
      );

      return {
        id: officer.id,
        name: officer.fullName,
        role: officer.role,
        district: officer.district?.name || "Shimla",
        tehsil: officer.tehsil?.name || "Shimla Urban",
        village: officer.village?.name || null,
        pendingFiles: pendingCount,
        processedFiles: processedCount,
        overdueFiles,
        slaCompliance: compliance,
        rating: Math.min(5.0, ratingScore),
        speedBadge: compliance >= 95 ? "Speedster ⚡" : compliance >= 80 ? "Efficient 👍" : "Needs Attention ⚠️",
      };
    })
  );

  return leaderboard.sort((a, b) => b.slaCompliance - a.slaCompliance || a.pendingFiles - b.pendingFiles);
}

export async function getWorkloadBalancingRecommendations() {
  const officers = await getOfficerLeaderboard();

  // Find overloaded vs underloaded officers by role
  const roles = [Role.DA, Role.PATWARI, Role.TEHSILDAR];
  const recommendations: any[] = [];

  for (const r of roles) {
    const roleOfficers = officers.filter((o) => o.role === r);
    if (roleOfficers.length >= 2) {
      const sorted = [...roleOfficers].sort((a, b) => b.pendingFiles - a.pendingFiles);
      const overloaded = sorted[0];
      const underloaded = sorted[sorted.length - 1];

      if (overloaded && underloaded && overloaded.pendingFiles - underloaded.pendingFiles >= 3) {
        const transferCount = Math.floor((overloaded.pendingFiles - underloaded.pendingFiles) / 2);
        recommendations.push({
          role: r,
          fromOfficer: overloaded,
          toOfficer: underloaded,
          recommendedTransferCount: transferCount,
          reason: `${overloaded.name} has ${overloaded.pendingFiles} files pending while ${underloaded.name} has only ${underloaded.pendingFiles} files.`,
        });
      }
    }
  }

  return {
    officerWorkloads: officers,
    recommendations,
  };
}

export async function reassignApplications({
  fromOfficerId,
  toOfficerId,
  count,
  adminId,
}: {
  fromOfficerId: string;
  toOfficerId: string;
  count: number;
  adminId: string;
}) {
  const fromOfficer = await prisma.user.findUnique({ where: { id: fromOfficerId } });
  const toOfficer = await prisma.user.findUnique({ where: { id: toOfficerId } });

  if (!fromOfficer || !toOfficer) {
    throw new Error("Officer not found");
  }

  if (fromOfficer.role !== toOfficer.role) {
    throw new Error("Cannot transfer files between different roles");
  }

  const role = fromOfficer.role;
  let whereClause: any = {
    status: { in: [ApplicationStatus.SUBMITTED, ApplicationStatus.IN_PROGRESS] },
  };

  if (role === Role.DA) {
    whereClause.assignedDAId = fromOfficerId;
    whereClause.currentStage = { in: [WorkflowStage.DA, WorkflowStage.DA_REVIEW] };
  } else if (role === Role.PATWARI) {
    whereClause.assignedPatwariId = fromOfficerId;
    whereClause.currentStage = WorkflowStage.PATWARI;
  } else if (role === Role.TEHSILDAR) {
    whereClause.assignedTehsildarId = fromOfficerId;
    whereClause.currentStage = WorkflowStage.TEHSILDAR;
  }

  const appsToTransfer = await prisma.application.findMany({
    where: whereClause,
    take: count,
    orderBy: { createdAt: "desc" },
  });

  const updateData: any = {};
  if (role === Role.DA) updateData.assignedDAId = toOfficerId;
  if (role === Role.PATWARI) updateData.assignedPatwariId = toOfficerId;
  if (role === Role.TEHSILDAR) updateData.assignedTehsildarId = toOfficerId;

  for (const app of appsToTransfer) {
    await prisma.application.update({
      where: { id: app.id },
      data: updateData,
    });

    await logAuditEvent({
      applicationId: app.id,
      userId: adminId,
      userRole: "ADMIN",
      action: "WORKLOAD_REBALANCING_REASSIGNMENT",
      stage: String(app.currentStage),
      details: `Reassigned from ${fromOfficer.fullName} (${role}) to ${toOfficer.fullName} (${role}) via Workload Balancer`,
    });
  }

  return {
    transferredCount: appsToTransfer.length,
    fromOfficer: fromOfficer.fullName,
    toOfficer: toOfficer.fullName,
  };
}
