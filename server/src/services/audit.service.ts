import prisma from "../config/prisma";

export async function logAuditEvent({
  applicationId,
  userId,
  userName,
  userRole,
  action,
  stage,
  details,
  ipAddress,
}: {
  applicationId?: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  action: string;
  stage?: string;
  details?: string;
  ipAddress?: string;
}) {
  try {
    return await prisma.auditLog.create({
      data: {
        applicationId,
        userId,
        userName,
        userRole,
        action,
        stage,
        details,
        ipAddress,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
    return null;
  }
}

export async function getApplicationAuditLogs(applicationId: string) {
  return prisma.auditLog.findMany({
    where: { applicationId },
    orderBy: { createdAt: "desc" },
  });
}
