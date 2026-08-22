import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { readCSV } from "../utils/csv";
import { extractTehsil } from "../utils/extractTehsil";

interface VillageCSVRow {
  "Village LGD Code": string;
  "Village Name (In English)": string;
  Hierarchy: string;
}

export async function seedVillages(prisma: PrismaClient) {
  console.log("🌱 Seeding villages...");

  const villagesFolder = path.join(
    __dirname,
    "..",
    "datasets",
    "villages"
  );

  // Load all tehsils once
  const tehsils = await prisma.tehsil.findMany();

  const tehsilMap = new Map(
    tehsils.map((t) => [t.name.toLowerCase().trim(), t.id])
  );

  const files = fs
    .readdirSync(villagesFolder)
    .filter((file) => file.endsWith(".csv"));

  let processed = 0;
  let skipped = 0;

  for (const file of files) {
    console.log(`📄 Processing ${file}`);

    const rows = await readCSV<VillageCSVRow>(
      path.join(villagesFolder, file)
    );

    for (const row of rows) {
      const tehsilName = extractTehsil(row.Hierarchy)
        .toLowerCase()
        .trim();

      const tehsilId = tehsilMap.get(tehsilName);

      if (!tehsilId) {
        skipped++;

        console.warn(
          `⚠️ Tehsil '${tehsilName}' not found. Skipping village '${row["Village Name (In English)"]}'.`
        );

        continue;
      }

      try {
  await prisma.village.upsert({
    where: {
      lgdCode: Number(row["Village LGD Code"]),
    },
    update: {},
    create: {
      lgdCode: Number(row["Village LGD Code"]),
      name: row["Village Name (In English)"].trim(),
      tehsilId,
    },
  });

  processed++;
} catch (error) {
  console.error("Duplicate village found:");
  console.error({
    lgdCode: row["Village LGD Code"],
    village: row["Village Name (In English)"],
    tehsil: tehsilName,
    file,
  });

  throw error;
}

      processed++;
    }
  }

  console.log(`✅ Processed ${processed} villages`);
  console.log(`⚠️ Skipped ${skipped} villages`);
}