import prisma from "../config/prisma";
import { WorkflowStage, Role } from "@prisma/client";

export async function checkEscalations() {
  const now = new Date();

  // Find all submitted applications that are not approved/rejected and whose stage deadline is in the past
  const overdueApplications = await prisma.application.findMany({
    where: {
      isSubmitted: true,
      status: {
        notIn: ["APPROVED", "REJECTED"],
      },
      stageDeadline: {
        lt: now,
      },
      isEscalated: false,
    },
    include: {
      assignedDA: true,
      assignedPatwari: true,
      assignedTehsildar: true,
      certificateService: true,
      applicant: true,
    },
  });

  let escalatedCount = 0;

  for (const app of overdueApplications) {
    const stageName = app.currentStage;
    let officerName = "Officer";
    if (stageName === WorkflowStage.DA || stageName === WorkflowStage.DA_REVIEW) {
      officerName = app.assignedDA?.fullName || "Dealing Assistant";
    } else if (stageName === WorkflowStage.PATWARI) {
      officerName = app.assignedPatwari?.fullName || "Patwari";
    } else if (stageName === WorkflowStage.TEHSILDAR) {
      officerName = app.assignedTehsildar?.fullName || "Tehsildar";
    }

    const reason = `SLA Limit Exceeded at ${stageName} stage (${officerName}). Auto-escalated to Supervisor & District Administration.`;

    await prisma.application.update({
      where: { id: app.id },
      data: {
        isEscalated: true,
        escalatedAt: now,
        escalationReason: reason,
        priorityScore: Math.min(100, (app.priorityScore || 20) + 40),
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        applicationId: app.id,
        action: "AUTOMATIC_SLA_ESCALATION",
        stage: String(stageName),
        details: reason,
      },
    });

    // Create In-App Notification for Applicant
    await prisma.notification.create({
      data: {
        userId: app.applicantId,
        title: `File Escalated: ${app.applicationNumber || "Application"}`,
        message: `Your file has exceeded the processing limit at the ${stageName} stage and has been automatically escalated to senior authorities for expedited action.`,
        type: "WARNING",
        link: `/applications/${app.id}`,
      },
    });

    // Create Notification for Tehsildar/Admin
    if (app.assignedTehsildarId) {
      await prisma.notification.create({
        data: {
          userId: app.assignedTehsildarId,
          title: `⚠️ Overdue File Alert: ${app.applicationNumber}`,
          message: `Application ${app.applicationNumber} is delayed at ${stageName} stage. Please review immediately.`,
          type: "URGENT",
          link: `/officer/applications/${app.id}`,
        },
      });
    }

    escalatedCount++;
  }

  return {
    checkedAt: now,
    escalatedCount,
    totalOverdueFound: overdueApplications.length,
  };
}

let schedulerTimer: NodeJS.Timeout | null = null;

export function startEscalationScheduler(intervalMinutes: number = 10) {
  if (schedulerTimer) return;
  console.log(`⏱️ Background SLA Escalation Scheduler initialized (Runs every ${intervalMinutes} minutes)`);
  // Run once on start
  checkEscalations().catch((err) => console.error("Escalation initial run error:", err));

  schedulerTimer = setInterval(() => {
    checkEscalations().catch((err) => console.error("Escalation check error:", err));
  }, intervalMinutes * 60 * 1000);
}