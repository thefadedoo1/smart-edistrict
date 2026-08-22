import prisma from "../config/prisma";
import { CreateVillageInput } from "../validators/village.validator";

export async function createVillage(data: CreateVillageInput) {
  const tehsil = await prisma.tehsil.findUnique({
    where: {
      id: data.tehsilId,
    },
  });

  if (!tehsil) {
    throw new Error("Tehsil not found");
  }

  const existing = await prisma.village.findFirst({
    where: {
      tehsilId: data.tehsilId,
      name: data.name,
    },
  });

  if (existing) {
    throw new Error("Village already exists in this Tehsil");
  }

  const lgdCode = data.lgdCode || Math.floor(100000 + Math.random() * 900000);

  return prisma.village.create({
    data: {
      name: data.name,
      tehsilId: data.tehsilId,
      lgdCode,
    },
    include: {
      tehsil: {
        include: {
          district: true,
        },
      },
    },
  });
}

export async function getAllVillages() {
  return prisma.village.findMany({
    include: {
      tehsil: {
        include: {
          district: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getVillagesByTehsil(tehsilId: string) {
  return prisma.village.findMany({
    where: {
      tehsilId,
    },
    orderBy: {
      name: "asc",
    },
  });
}