import prisma from "../config/prisma";
import { CreateCertificateServiceInput } from "../validators/certificateService.validator";

export async function createCertificateService(
  data: CreateCertificateServiceInput
) {
  const existing = await prisma.certificateService.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existing) {
    throw new Error("Certificate service already exists");
  }

  // Get default department if not provided
  let departmentId = data.departmentId;
  if (!departmentId) {
    const revDept = await prisma.department.findFirst({ where: { code: "REV" } });
    departmentId = revDept?.id;
    if (!departmentId) {
      const anyDept = await prisma.department.findFirst();
      departmentId = anyDept?.id;
    }
  }

  if (!departmentId) {
    throw new Error("Please provide a valid departmentId");
  }

  const code = data.code || data.name.toUpperCase().replace(/[^A-Z0-9]/g, "_").slice(0, 20);

  return prisma.certificateService.create({
    data: {
      name: data.name,
      code,
      departmentId,
      description: data.description,
      processingDays: data.processingDays,
      isActive: data.isActive ?? true,
    },
  });
}

export async function getAllCertificateServices() {
  return prisma.certificateService.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      department: true,
    },
  });
}

export async function updateCertificateService(
  id: string,
  data: Partial<CreateCertificateServiceInput>
) {
  const service = await prisma.certificateService.findUnique({
    where: { id },
  });

  if (!service) {
    throw new Error("Certificate service not found");
  }

  return prisma.certificateService.update({
    where: { id },
    data: {
      ...(data.name ? { name: data.name } : {}),
      ...(data.code ? { code: data.code } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.processingDays ? { processingDays: data.processingDays } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
    },
  });
}

export async function deleteCertificateService(id: string) {
  const service = await prisma.certificateService.findUnique({
    where: { id },
  });

  if (!service) {
    throw new Error("Certificate service not found");
  }

  return prisma.certificateService.delete({
    where: { id },
  });
}

export async function getCertificateServiceByCode(code: string) {
  const service = await prisma.certificateService.findUnique({
    where: {
      code,
    },
    include: {
      department: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
      requiredDocuments: {
        select: {
          id: true,
          name: true,
          isMandatory: true,
          displayOrder: true,
        },
        orderBy: {
          displayOrder: "asc",
        },
      },
      form: {
        select: {
          id: true,
          title: true,
          description: true,
          fields: {
            orderBy: {
              displayOrder: "asc",
            },
            select: {
              id: true,
              label: true,
              fieldKey: true,
              fieldType: true,
              placeholder: true,
              defaultValue: true,
              isRequired: true,
              displayOrder: true,
              options: true,
            },
          },
        },
      },
    },
  });

  if (!service) {
    throw new Error("Certificate service not found");
  }

  return service;
}