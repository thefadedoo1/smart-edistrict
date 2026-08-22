import prisma from "../config/prisma";
import { generateCertificate } from "./certificate.service";
import {
  ApplicationStatus,
  Role,
  WorkflowAction,
  WorkflowStage,
} from "@prisma/client";
import { calculatePriorityDetailed } from "./priority.service";
import {
  calculateStageDeadline,
  getStageSLAInfo,
  isOverdue,
  isDueToday,
  getRemainingHours,
} from "./sla.service";
import { getAssignedOfficers } from "./routing.service";
import { logAuditEvent } from "./audit.service";
import { predictApplicationCompletion } from "./aiPrediction.service";
import { sendEmailNotification } from "./email.service";

function generateApplicationNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `HP-${year}-${random}`;
}

export async function startWorkflow(applicationId: string) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      applicant: true,
      certificateService: true,
    },
  });

  if (!application) {
    throw new Error("Application not found.");
  }

  if (application.isSubmitted) {
    throw new Error("Workflow already started.");
  }

  const formData = (application.formData as Record<string, any>) || {};
  const officers = await getAssignedOfficers(application.applicantId, {
    districtId: formData.districtId,
    tehsilId: formData.tehsilId,
    villageId: formData.villageId,
    districtName: formData.district,
    tehsilName: formData.tehsil,
  });

  const updatedApplication = await prisma.application.update({
    where: { id: applicationId },
    data: {
      applicationNumber: generateApplicationNumber(),
      isSubmitted: true,
      status: ApplicationStatus.SUBMITTED,
      currentStage: WorkflowStage.DA,
      assignedDAId: officers.da.id,
      assignedPatwariId: officers.patwari.id,
      assignedTehsildarId: officers.tehsildar.id,
      stageStartedAt: new Date(),
      stageDeadline: calculateStageDeadline(WorkflowStage.DA),
      isEscalated: false,
      escalatedAt: null,
    },
    include: {
      assignedDA: { select: { id: true, fullName: true } },
      assignedPatwari: { select: { id: true, fullName: true } },
      assignedTehsildar: { select: { id: true, fullName: true } },
    },
  });

  await prisma.applicationHistory.create({
    data: {
      applicationId,
      officerId: application.applicantId,
      fromStage: WorkflowStage.DA,
      toStage: WorkflowStage.DA,
      action: WorkflowAction.FORWARD,
      remarks: "Application submitted online.",
    },
  });

  await logAuditEvent({
    applicationId,
    userId: application.applicantId,
    userName: application.applicant.fullName,
    userRole: "CITIZEN",
    action: "APPLICATION_SUBMITTED",
    stage: "DA",
    details: `Application submitted for ${application.certificateService.name}. Assigned to DA: ${officers.da.fullName}`,
  });

  // Notify citizen via Email
  if (application.applicant.email) {
    await sendEmailNotification(
      application.applicant.email,
      `Application Submitted: ${application.certificateService.name}`,
      `Your application for ${application.certificateService.name} (App No: ${updatedApplication.applicationNumber}) has been submitted successfully and forwarded to the Dealing Assistant.`
    );
  }

  return updatedApplication;
}

export async function processWorkflowAction(
  applicationId: string,
  officerId: string,
  role: Role,
  action: WorkflowAction,
  remarks?: string
) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      assignedDA: true,
      assignedPatwari: true,
      assignedTehsildar: true,
      applicant: true,
      certificateService: true,
    },
  });

  if (!application) {
    throw new Error("Application not found.");
  }

  const officer = await prisma.user.findUnique({ where: { id: officerId } });

  // Verification stage checks
  if (role === Role.DA) {
    if (
      application.currentStage !== WorkflowStage.DA &&
      application.currentStage !== WorkflowStage.DA_REVIEW
    ) {
      throw new Error(`Application is currently at ${application.currentStage} stage.`);
    }
  } else if (role === Role.PATWARI) {
    if (application.currentStage !== WorkflowStage.PATWARI) {
      throw new Error(`Application is currently at ${application.currentStage} stage.`);
    }
  } else if (role === Role.TEHSILDAR) {
    if (application.currentStage !== WorkflowStage.TEHSILDAR) {
      throw new Error(`Application is currently at ${application.currentStage} stage.`);
    }
  } else {
    throw new Error("You are not authorized to perform workflow actions.");
  }

  let nextStage = application.currentStage;
  let status = application.status;

  switch (action) {
    case WorkflowAction.FORWARD:
      if (role === Role.DA) {
        if (application.currentStage === WorkflowStage.DA) {
          nextStage = WorkflowStage.PATWARI;
        } else if (application.currentStage === WorkflowStage.DA_REVIEW) {
          nextStage = WorkflowStage.TEHSILDAR;
        }
      } else if (role === Role.PATWARI) {
        nextStage = WorkflowStage.DA_REVIEW;
      }
      status = ApplicationStatus.IN_PROGRESS;
      break;

    case WorkflowAction.APPROVE:
      if (role !== Role.TEHSILDAR) {
        throw new Error("Only Tehsildar can approve applications and issue certificates.");
      }
      nextStage = WorkflowStage.TEHSILDAR;
      status = ApplicationStatus.APPROVED;
      break;

    case WorkflowAction.REJECT:
      if (role !== Role.TEHSILDAR) {
        throw new Error("Only Tehsildar can reject applications.");
      }
      nextStage = WorkflowStage.TEHSILDAR;
      status = ApplicationStatus.REJECTED;
      break;

    case WorkflowAction.CORRECTION_REQUIRED:
      status = ApplicationStatus.CORRECTION_REQUIRED;
      break;

    default:
      throw new Error("Invalid workflow action.");
  }

  const isForwarding = action === WorkflowAction.FORWARD;

  await prisma.application.update({
    where: { id: applicationId },
    data: {
      currentStage: nextStage,
      stageStartedAt: isForwarding ? new Date() : application.stageStartedAt,
      stageDeadline: isForwarding ? calculateStageDeadline(nextStage!) : application.stageDeadline,
      isEscalated: isForwarding ? false : application.isEscalated,
      escalatedAt: isForwarding ? null : application.escalatedAt,
      status,
      remarks: remarks || application.remarks,
    },
  });

  await prisma.applicationHistory.create({
    data: {
      applicationId,
      officerId,
      fromStage: application.currentStage!,
      toStage: nextStage!,
      action,
      remarks: remarks || "",
    },
  });

  await logAuditEvent({
    applicationId,
    userId: officerId,
    userName: officer?.fullName || "Officer",
    userRole: role,
    action: `WORKFLOW_${action}`,
    stage: String(nextStage),
    details: remarks || `Action ${action} executed by ${officer?.fullName || role}`,
  });

  // If approved by Tehsildar, generate certificate automatically
  if (action === WorkflowAction.APPROVE) {
    await generateCertificate(applicationId);

    // Notify citizen
    await prisma.notification.create({
      data: {
        userId: application.applicantId,
        title: `🎉 Certificate Issued: ${application.certificateService.name}`,
        message: `Your ${application.certificateService.name} application (${application.applicationNumber}) has been approved. Your certificate is now ready for download!`,
        type: "SUCCESS",
        link: `/applications/${applicationId}`,
      },
    });

    if (application.applicant.email) {
      await sendEmailNotification(
        application.applicant.email,
        `Application Approved: ${application.certificateService.name}`,
        `Good news! Your ${application.certificateService.name} (App No: ${application.applicationNumber}) is APPROVED. You can now download your certificate.`
      );
    }
  } else if (action === WorkflowAction.CORRECTION_REQUIRED) {
    await prisma.notification.create({
      data: {
        userId: application.applicantId,
        title: `⚠️ Correction Required: ${application.applicationNumber}`,
        message: `Officer requested corrections on your application: "${remarks || 'Please review and re-submit'}".`,
        type: "WARNING",
        link: `/applications/${applicationId}`,
      },
    });

    if (application.applicant.email) {
      await sendEmailNotification(
        application.applicant.email,
        `Correction Required: ${application.applicationNumber}`,
        `Action Required: Your application (App No: ${application.applicationNumber}) needs correction. Please login to the portal and re-submit.`
      );
    }
  } else if (action === WorkflowAction.FORWARD) {
    if (application.applicant.email) {
      await sendEmailNotification(
        application.applicant.email,
        `Application Forwarded: ${application.applicationNumber}`,
        `Update: Your application (App No: ${application.applicationNumber}) has been forwarded to ${nextStage} for further processing.`
      );
    }
  } else if (action === WorkflowAction.REJECT) {
    if (application.applicant.email) {
      await sendEmailNotification(
        application.applicant.email,
        `Application Rejected: ${application.applicationNumber}`,
        `Update: Your application (App No: ${application.applicationNumber}) has been REJECTED. Please check the portal for details.`
      );
    }
  }

  return prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      applicant: {
        include: { profile: true },
      },
      certificateService: true,
      documents: {
        include: { requiredDocument: true },
      },
      history: {
        include: {
          officer: {
            select: { id: true, fullName: true, role: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      clarifications: {
        include: {
          sender: { select: { id: true, fullName: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      auditLogs: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getPendingApplications(role: Role, officerId: string) {
  let stageCondition: any = {};

  if (role === Role.DA) {
    stageCondition = { in: [WorkflowStage.DA, WorkflowStage.DA_REVIEW] };
  } else if (role === Role.PATWARI) {
    stageCondition = WorkflowStage.PATWARI;
  } else if (role === Role.TEHSILDAR) {
    stageCondition = WorkflowStage.TEHSILDAR;
  } else {
    throw new Error("Invalid role.");
  }

  const where: any = {
    currentStage: stageCondition,
    status: {
      notIn: [ApplicationStatus.APPROVED, ApplicationStatus.REJECTED],
    },
  };

  if (role === Role.DA) {
    where.assignedDAId = officerId;
  } else if (role === Role.PATWARI) {
    where.assignedPatwariId = officerId;
  } else if (role === Role.TEHSILDAR) {
    where.assignedTehsildarId = officerId;
  }

  const applications = await prisma.application.findMany({
    where,
    include: {
      applicant: {
        include: { profile: true },
      },
      certificateService: true,
      clarifications: true,
    },
    orderBy: {
      stageStartedAt: "asc",
    },
  });

  return applications.map((app) => {
    const slaInfo = getStageSLAInfo(app.stageDeadline, app.stageStartedAt);
    const priorityBreakdown = calculatePriorityDetailed({
      application: app,
      remainingHours: slaInfo.remainingHours,
      isOverdue: slaInfo.isOverdue,
    });

    return {
      ...app,
      slaInfo,
      priority: priorityBreakdown.score,
      priorityTags: priorityBreakdown.tags,
    };
  }).sort((a, b) => b.priority - a.priority);
}

export async function getWorkflowDashboard(role: Role, officerId: string) {
  const applications = await getPendingApplications(role, officerId);

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const completedToday = await prisma.application.count({
    where: {
      status: ApplicationStatus.APPROVED,
      updatedAt: { gte: startOfDay },
      ...(role === Role.DA ? { assignedDAId: officerId } : {}),
      ...(role === Role.PATWARI ? { assignedPatwariId: officerId } : {}),
      ...(role === Role.TEHSILDAR ? { assignedTehsildarId: officerId } : {}),
    },
  });

  const overdue = applications.filter((a) => a.slaInfo.isOverdue).length;
  const dueToday = applications.filter((a) => a.slaInfo.remainingHours <= 24 && !a.slaInfo.isOverdue).length;

  const averageProcessingDays =
    applications.length === 0
      ? 0
      : Number(
          (
            applications.reduce((sum, app) => {
              return (
                sum +
                (Date.now() - new Date(app.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              );
            }, 0) / applications.length
          ).toFixed(1)
        );

  const slaCompliance =
    applications.length === 0
      ? 100
      : Math.round(((applications.length - overdue) / applications.length) * 100);

  return {
    summary: {
      pending: applications.length,
      dueToday,
      overdue,
      completedToday,
      averageProcessingDays,
      slaCompliance,
    },
    applications,
  };
}

export async function getWorkflowHistory(applicationId: string) {
  return prisma.applicationHistory.findMany({
    where: { applicationId },
    include: {
      officer: {
        select: {
          id: true,
          fullName: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getOfficerHistoryList(officerId: string) {
  // Find all distinct application IDs this officer has interacted with
  const histories = await prisma.applicationHistory.findMany({
    where: { officerId },
    select: { applicationId: true },
    distinct: ['applicationId'],
  });

  const appIds = histories.map(h => h.applicationId);

  // Return those applications
  return prisma.application.findMany({
    where: { id: { in: appIds } },
    include: {
      applicant: {
        select: { fullName: true }
      },
      certificateService: {
        select: { name: true }
      }
    },
    orderBy: { updatedAt: "desc" }
  });
}
