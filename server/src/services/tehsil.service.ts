import prisma from "../config/prisma";
import { CreateTehsilInput } from "../validators/tehsil.validator";

export async function createTehsil(data: CreateTehsilInput) {
  const district = await prisma.district.findUnique({
    where: { id: data.districtId },
  });

  if (!district) {
    throw new Error("District not found");
  }

  const existing = await prisma.tehsil.findFirst({
    where: {
      districtId: data.districtId,
      name: data.name,
    },
  });

  if (existing) {
    throw new Error("Tehsil already exists in this district");
  }

  const lgdCode = data.lgdCode || Math.floor(1000 + Math.random() * 9000);

  return prisma.tehsil.create({
    data: {
      name: data.name,
      districtId: data.districtId,
      lgdCode,
    },
    include: {
      district: true,
    },
  });
}

export async function getAllTehsils() {
  return prisma.tehsil.findMany({
    include: {
      district: true,
      villages: {
        select: { id: true, name: true, lgdCode: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getTehsilsByDistrict(districtId: string) {
  return prisma.tehsil.findMany({
    where: {
      districtId,
    },
    orderBy: {
      name: "asc",
    },
  });
}