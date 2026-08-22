import prisma from "../config/prisma";
import { Role } from "@prisma/client";

export async function createClarificationQuery(
  applicationId: string,
  senderId: string,
  senderRole: Role,
  message: string
) {
  const query = await prisma.clarificationQuery.create({
    data: {
      applicationId,
      senderId,
      senderRole,
      message,
      status: "PENDING",
    },
    include: {
      sender: {
        select: {
          id: true,
          fullName: true,
          role: true,
        },
      },
    },
  });

  // Get application applicant
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { applicantId: true, applicationNumber: true },
  });

  if (app) {
    await prisma.notification.create({
      data: {
        userId: app.applicantId,
        title: `Clarification Requested on ${app.applicationNumber}`,
        message: `${query.sender.fullName} requested: "${message}"`,
        type: "WARNING",
        link: `/applications/${applicationId}`,
      },
    });
  }

  return query;
}

export async function replyClarificationQuery(
  queryId: string,
  replyMessage: string,
  replyFileUrl?: string
) {
  const query = await prisma.clarificationQuery.update({
    where: { id: queryId },
    data: {
      replyMessage,
      replyFileUrl,
      repliedAt: new Date(),
      status: "RESOLVED",
    },
    include: {
      application: true,
      sender: true,
    },
  });

  // Notify the officer who asked
  await prisma.notification.create({
    data: {
      userId: query.senderId,
      title: `Citizen Replied: ${query.application.applicationNumber}`,
      message: `Applicant provided clarification: "${replyMessage}"`,
      type: "INFO",
      link: `/officer/applications/${query.applicationId}`,
    },
  });

  return query;
}

export async function getApplicationClarifications(applicationId: string) {
  return prisma.clarificationQuery.findMany({
    where: { applicationId },
    include: {
      sender: {
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
