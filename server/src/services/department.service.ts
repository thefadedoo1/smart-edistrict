import prisma from "../config/prisma";
import { CreateDepartmentInput } from "../validators/department.validator";

export async function createDepartment(
  data: CreateDepartmentInput
) {
  const existing = await prisma.department.findFirst({
    where: {
      OR: [
        { name: data.name },
        { code: data.code },
      ],
    },
  });

  if (existing) {
    throw new Error("Department already exists");
  }

  return prisma.department.create({
    data,
  });
}

export async function getAllDepartments() {
  return prisma.department.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function updateDepartment(
  id: string,
  data: Partial<CreateDepartmentInput>
) {
  const department = await prisma.department.findUnique({
    where: { id },
  });

  if (!department) {
    throw new Error("Department not found");
  }

  return prisma.department.update({
    where: { id },
    data,
  });
}

export async function deleteDepartment(id: string) {
  const department = await prisma.department.findUnique({
    where: { id },
  });

  if (!department) {
    throw new Error("Department not found");
  }

  return prisma.department.delete({
    where: { id },
  });
}

export async function getDepartmentCatalog() {
  return prisma.department.findMany({
    where: {
      isActive: true,
      certificateServices: {
        some: {
          isActive: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      code: true,
      certificateServices: {
        where: {
          isActive: true,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          code: true, // ✅ Added
          name: true,
          description: true,
          processingDays: true,
        },
      },
    },
  });
}