import prisma from "../config/prisma";
import { CreateDistrictInput } from "../validators/district.validator";

export async function createDistrict(data: CreateDistrictInput) {
  const existingDistrict = await prisma.district.findFirst({
    where: { name: data.name },
  });

  if (existingDistrict) {
    throw new Error("District already exists");
  }

  const lgdCode = data.lgdCode || Math.floor(100 + Math.random() * 900);

  return prisma.district.create({
    data: {
      name: data.name,
      lgdCode,
    },
  });
}

export async function getAllDistricts() {
  return prisma.district.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      tehsils: {
        select: { id: true, name: true, lgdCode: true },
      },
    },
  });
}