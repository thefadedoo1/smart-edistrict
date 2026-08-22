import { PrismaClient } from "@prisma/client";
import { seedDistricts } from "./seeders/district.seeder";
import { seedTehsils } from "./seeders/tehsil.seeder";
import { seedVillages } from "./seeders/village.seeder";
import { seedDepartments } from "./seeders/department.seeder";
import { seedCertificateServices } from "./seeders/certificateService.seeder";
import { seedRequiredDocuments } from "./seeders/requiredDocument.seeder";
import { seedServiceForms } from "./seeders/serviceForm.seeder";
import { seedAdmin } from "./seeders/admin.seeder";
import { seedDemoData } from "./seeders/demo.seeder";
import process from "process";


const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  await seedDistricts(prisma);
  await seedTehsils(prisma);
  await seedVillages(prisma);
  await seedDepartments(prisma);
  await seedCertificateServices(prisma);
  await seedRequiredDocuments(prisma);
  await seedServiceForms(prisma);
  await seedAdmin(prisma);
  await seedDemoData(prisma);

  console.log("🎉 Database seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });