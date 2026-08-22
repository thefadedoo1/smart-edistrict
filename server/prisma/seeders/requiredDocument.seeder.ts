import { PrismaClient } from "@prisma/client";
import { requiredDocuments } from "../data/requiredDocuments";

export async function seedRequiredDocuments(
  prisma: PrismaClient
) {
  console.log("📑 Seeding Required Documents...");

  for (const serviceGroup of requiredDocuments) {
    const service = await prisma.certificateService.findUnique({
      where: {
        code: serviceGroup.serviceCode,
      },
    });

    if (!service) {
      console.warn(
        `⚠️ Certificate Service with code ${serviceGroup.serviceCode} not found. Skipping...`
      );
      continue;
    }

    for (const document of serviceGroup.documents) {
      await prisma.requiredDocument.upsert({
        where: {
          serviceId_name: {
            serviceId: service.id,
            name: document.name,
          },
        },
        update: {
          isMandatory: document.isMandatory,
          displayOrder: document.displayOrder,
        },
        create: {
          name: document.name,
          isMandatory: document.isMandatory,
          displayOrder: document.displayOrder,
          serviceId: service.id,
        },
      });
    }
  }

  console.log("✅ Required Documents Seeded");
}