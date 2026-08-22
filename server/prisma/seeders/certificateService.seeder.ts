import { PrismaClient } from "@prisma/client";
import { certificateServices } from "../data/certificateServices";

export async function seedCertificateServices(
  prisma: PrismaClient
) {
  console.log("📄 Seeding Certificate Services...");

  for (const departmentGroup of certificateServices) {
    const department = await prisma.department.findUnique({
      where: {
        code: departmentGroup.departmentCode,
      },
    });

    if (!department) {
      console.warn(
        `⚠️ Department with code ${departmentGroup.departmentCode} not found. Skipping...`
      );
      continue;
    }

    for (const service of departmentGroup.services) {
      await prisma.certificateService.upsert({
        where: {
          code: service.code,
        },
        update: {
          name: service.name,
          description: service.description,
          processingDays: service.processingDays,
          departmentId: department.id,
          isActive: true,
        },
        create: {
          code: service.code,
          name: service.name,
          description: service.description,
          processingDays: service.processingDays,
          departmentId: department.id,
          isActive: true,
        },
      });
    }
  }

  console.log("✅ Certificate Services Seeded");
}