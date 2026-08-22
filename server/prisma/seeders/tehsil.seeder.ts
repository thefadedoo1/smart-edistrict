import path from "path";
import { PrismaClient } from "@prisma/client";
import { readCSV } from "../utils/csv";
import { extractDistrict } from "../utils/extractDistrict";

interface TehsilCSVRow {
  "Sub-District LGD Code": string;
  "Sub-District Name (In English)": string;
  Hierarchy: string;
}

export async function seedTehsils(prisma: PrismaClient) {
  console.log("🌱 Seeding tehsils...");

  const filePath = path.join(
    __dirname,
    "..",
    "datasets",
    "tehsils.csv"
  );

  const rows = await readCSV<TehsilCSVRow>(filePath);

  // Load all districts once
  const districts = await prisma.district.findMany();

  const districtMap = new Map(
    districts.map((district) => [
      district.name.toLowerCase().trim(),
      district.id,
    ])
  );

  let inserted = 0;
  let skipped = 0;

  for (const row of rows) {
    const districtName = extractDistrict(row.Hierarchy)
      .toLowerCase()
      .trim();

    const districtId = districtMap.get(districtName);

    if (!districtId) {
      skipped++;

      console.warn(
        `⚠️ District '${districtName}' not found. Skipping '${row["Sub-District Name (In English)"]}'.`
      );

      continue;
    }

    await prisma.tehsil.upsert({
      where: {
        lgdCode: Number(row["Sub-District LGD Code"]),
      },
      update: {},
      create: {
        lgdCode: Number(row["Sub-District LGD Code"]),
        name: row["Sub-District Name (In English)"].trim(),
        districtId,
      },
    });

    inserted++;
  }

  console.log(`✅ Seeded/Verified ${inserted} tehsils`);
  console.log(`⚠️ Skipped ${skipped} tehsils`);
}