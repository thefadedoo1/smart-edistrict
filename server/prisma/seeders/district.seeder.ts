import { PrismaClient } from "@prisma/client";
import { districts } from "../data/districts";

export async function seedDistricts(prisma: PrismaClient) {
  console.log("🌱 Seeding districts...");

  await prisma.district.createMany({
    data: districts,
    skipDuplicates: true,
  });

  console.log(`✅ Seeded ${districts.length} districts`);
}