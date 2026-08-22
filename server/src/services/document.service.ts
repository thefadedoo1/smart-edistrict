import prisma from "../config/prisma";

export async function uploadDocument(
  applicationId: string,
  requiredDocumentId: string,
  file: Express.Multer.File
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
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  const requiredDocument =
    application.certificateService.requiredDocuments.find(
      (document) => document.id === requiredDocumentId
    );

  if (!requiredDocument) {
    throw new Error(
      "Invalid required document for this application"
    );
  }

  const fileUrl = `/uploads/${file.filename}`;

  const existing =
    await prisma.applicationDocument.findUnique({
      where: {
        applicationId_requiredDocumentId: {
          applicationId,
          requiredDocumentId,
        },
      },
    });

  if (existing) {
    return prisma.applicationDocument.update({
      where: {
        id: existing.id,
      },
      data: {
        originalFileName: file.originalname,
        fileUrl,
        mimeType: file.mimetype,
        fileSize: file.size,
      },
      include: {
        requiredDocument: true,
      },
    });
  }

  return prisma.applicationDocument.create({
    data: {
      applicationId,
      requiredDocumentId,
      originalFileName: file.originalname,
      fileUrl,
      mimeType: file.mimetype,
      fileSize: file.size,
    },
    include: {
      requiredDocument: true,
    },
  });
}

export async function getDocuments(applicationId: string) {
  return prisma.applicationDocument.findMany({
    where: {
      applicationId,
    },
    include: {
      requiredDocument: true,
    },
    orderBy: {
      uploadedAt: "asc",
    },
  });
}

export async function getDocumentById(documentId: string) {
  return prisma.applicationDocument.findUnique({
    where: { id: documentId },
    include: { requiredDocument: true },
  });
}