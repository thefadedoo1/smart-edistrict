import path from "path";
import { PrismaClient } from "@prisma/client";
import { readCSV } from "../utils/csv";

interface DistrictCSVRow {
  "District LGD Code": string;
  "District Name (In English)": string;
}

export async function seedDistricts(prisma: PrismaClient) {
  console.log("🌱 Seeding districts...");

  const filePath = path.join(__dirname, "..", "datasets", "districts.csv");
  const rows = await readCSV<DistrictCSVRow>(filePath);

  let inserted = 0;

  for (const row of rows) {
    await prisma.district.upsert({
      where: {
        lgdCode: Number(row["District LGD Code"]),
      },
      update: {},
      create: {
        lgdCode: Number(row["District LGD Code"]),
        name: row["District Name (In English)"].trim(),
      },
    });

    inserted++;
  }

  console.log(`✅ Seeded/Verified ${inserted} districts`);
}