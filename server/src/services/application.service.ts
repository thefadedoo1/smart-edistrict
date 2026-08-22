import prisma from "../config/prisma";
import { ApplicationStatus, WorkflowStage, WorkflowAction } from "@prisma/client";
import { CreateApplicationInput, UpdateApplicationInput } from "../validators/application.validator";
import { validateCitizenProfile } from "./profileValidation.service";
import { startWorkflow } from "./workflow.service";
import { getStageSLAInfo, calculateStageDeadline } from "./sla.service";
import { predictApplicationCompletion } from "./aiPrediction.service";
import { calculatePriorityDetailed } from "./priority.service";
import { logAuditEvent } from "./audit.service";
import { sendEmailNotification } from "./email.service";

export async function createApplication(
  applicantId: string,
  data: CreateApplicationInput
) {
  const service = await prisma.certificateService.findUnique({
    where: {
      id: data.certificateServiceId,
    },
  });

  if (!service) {
    throw new Error("Certificate service not found");
  }

  return prisma.application.create({
    data: {
      applicantId,
      certificateServiceId: data.certificateServiceId,
      formData: data.formData,
      remarks: data.remarks,
      status: ApplicationStatus.DRAFT,
      isSubmitted: false,
      applicationNumber: null,
      currentStage: null,
    },
    include: {
      applicant: true,
      certificateService: true,
      documents: true,
    },
  });
}

export async function updateApplicationData(
  applicationId: string,
  applicantId: string,
  data: UpdateApplicationInput
) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.applicantId !== applicantId) {
    throw new Error("Unauthorized");
  }

  if (
    application.status !== ApplicationStatus.DRAFT &&
    application.status !== ApplicationStatus.CORRECTION_REQUIRED
  ) {
    throw new Error("Application can only be edited when in Draft or Correction Required status");
  }

  const updatedFormData = data.formData
    ? { ...((application.formData as Record<string, any>) || {}), ...data.formData }
    : application.formData;

  return prisma.application.update({
    where: { id: applicationId },
    data: {
      formData: (updatedFormData as any) ?? {},
      remarks: data.remarks ?? application.remarks,
    },
    include: {
      applicant: true,
      certificateService: true,
      documents: { include: { requiredDocument: true } },
    },
  });
}

export async function getMyApplications(applicantId: string) {
  const applications = await prisma.application.findMany({
    where: {
      applicantId,
    },
    include: {
      certificateService: true,
      documents: true,
      assignedDA: { select: { id: true, fullName: true } },
      assignedPatwari: { select: { id: true, fullName: true } },
      assignedTehsildar: { select: { id: true, fullName: true } },
      clarifications: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Promise.all(
    applications.map(async (app) => {
      const slaInfo = getStageSLAInfo(app.stageDeadline, app.stageStartedAt);
      const prediction = await predictApplicationCompletion(app);

      return {
        ...app,
        slaInfo,
        prediction,
      };
    })
  );
}

export async function getApplicationById(id: string) {
  const application = await prisma.application.findUnique({
    where: {
      id,
    },
    include: {
      applicant: {
        include: {
          profile: {
            include: {
              district: true,
              tehsil: true,
              village: true,
            },
          },
        },
      },
      certificateService: {
        include: {
          requiredDocuments: {
            orderBy: {
              displayOrder: "asc",
            },
          },
        },
      },
      documents: {
        include: {
          requiredDocument: true,
        },
        orderBy: {
          uploadedAt: "asc",
        },
      },
      history: {
        include: {
          officer: {
            select: {
              id: true,
              fullName: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      assignedDA: { select: { id: true, fullName: true, phone: true } },
      assignedPatwari: { select: { id: true, fullName: true, phone: true } },
      assignedTehsildar: { select: { id: true, fullName: true, phone: true } },
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

  if (!application) {
    throw new Error("Application not found");
  }

  const slaInfo = getStageSLAInfo(application.stageDeadline, application.stageStartedAt);
  const prediction = await predictApplicationCompletion(application);
  const priorityBreakdown = calculatePriorityDetailed({
    application,
    remainingHours: slaInfo.remainingHours,
    isOverdue: slaInfo.isOverdue,
  });

  return {
    ...application,
    slaInfo,
    prediction,
    priority: priorityBreakdown.score,
    priorityTags: priorityBreakdown.tags,
  };
}

export async function submitApplication(
  applicationId: string,
  applicantId: string
) {
  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
    include: {
      certificateService: {
        include: {
          requiredDocuments: true,
        },
      },
      documents: true,
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.applicantId !== applicantId) {
    throw new Error("Unauthorized");
  }

  if (application.isSubmitted) {
    throw new Error("Application already submitted");
  }

  // Validate Citizen Profile
  const profileValidation = await validateCitizenProfile(applicantId);

  if (!profileValidation.complete) {
    throw new Error(
      `Please complete your profile before submitting.\n\nMissing:\n${profileValidation.missingFields.join(
        "\n"
      )}`
    );
  }

  // Validate Mandatory Documents
  const mandatoryDocuments = application.certificateService.requiredDocuments.filter(
    (doc) => doc.isMandatory
  );

  const uploadedIds = application.documents.map((doc) => doc.requiredDocumentId);

  const missingDocuments = mandatoryDocuments.filter(
    (doc) => !uploadedIds.includes(doc.id)
  );

  if (missingDocuments.length > 0) {
    throw new Error(
      `Please upload all mandatory documents before submitting.\n\nMissing:\n${missingDocuments
        .map((d) => d.name)
        .join("\n")}`
    );
  }

  return startWorkflow(applicationId);
}

export async function resubmitApplicationCorrection(
  applicationId: string,
  applicantId: string,
  remarks?: string
) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      applicant: true,
      certificateService: {
        include: { requiredDocuments: true },
      },
      documents: true,
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.applicantId !== applicantId) {
    throw new Error("Unauthorized");
  }

  if (application.status !== ApplicationStatus.CORRECTION_REQUIRED) {
    throw new Error("Only applications marked as 'Correction Required' can be re-submitted.");
  }

  // Validate mandatory documents
  const mandatoryDocs = application.certificateService.requiredDocuments.filter((d) => d.isMandatory);
  const uploadedDocIds = application.documents.map((d) => d.requiredDocumentId);
  const missingDocs = mandatoryDocs.filter((d) => !uploadedDocIds.includes(d.id));

  if (missingDocs.length > 0) {
    throw new Error(`Missing mandatory documents: ${missingDocs.map((d) => d.name).join(", ")}`);
  }

  const nextStage = WorkflowStage.DA;

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: ApplicationStatus.IN_PROGRESS,
      currentStage: nextStage,
      stageStartedAt: new Date(),
      stageDeadline: calculateStageDeadline(nextStage),
      isEscalated: false,
      escalatedAt: null,
      remarks: remarks || application.remarks,
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
      officerId: applicantId,
      fromStage: WorkflowStage.DA,
      toStage: nextStage,
      action: WorkflowAction.FORWARD,
      remarks: remarks || "Citizen submitted corrected application and updated documents.",
    },
  });

  await logAuditEvent({
    applicationId,
    userId: applicantId,
    userName: application.applicant.fullName,
    userRole: "CITIZEN",
    action: "CORRECTION_RESUBMITTED",
    stage: "DA",
    details: `Citizen resubmitted application after addressing correction remarks: ${remarks || "Updated fields & documents"}`,
  });

  if (application.assignedDAId) {
    await prisma.notification.create({
      data: {
        userId: application.assignedDAId,
        title: `🔄 Correction Resubmitted: ${application.applicationNumber}`,
        message: `${application.applicant.fullName} has resubmitted their application after corrections. Ready for review.`,
        type: "INFO",
        link: `/officer/applications/${applicationId}`,
      },
    });
  }

  if (application.applicant.email) {
    await sendEmailNotification(
      application.applicant.email,
      `Correction Resubmitted: ${application.applicationNumber}`,
      `Your corrected application (App No: ${application.applicationNumber}) has been submitted successfully and sent to the Dealing Assistant.`
    );
  }

  return updated;
}