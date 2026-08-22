import { PrismaClient } from "@prisma/client";
import { departments } from "../data/departments";

export async function seedDepartments(
  prisma: PrismaClient
) {
  console.log("🏢 Seeding Departments...");

  for (const department of departments) {
    await prisma.department.upsert({
      where: {
        code: department.code,
      },
      update: {
        name: department.name,
        description: department.description,
        isActive: true,
      },
      create: {
        ...department,
        isActive: true,
      },
    });
  }

  console.log("✅ Departments Seeded");
}