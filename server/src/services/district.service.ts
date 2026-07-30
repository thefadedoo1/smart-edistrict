import prisma from "../config/prisma";
import { CreateDistrictInput } from "../validators/district.validator";

export async function createDistrict(data: CreateDistrictInput) {
  const existingDistrict = await prisma.district.findFirst({
    where: {
      OR: [
        { name: data.name },
        { code: data.code }
      ]
    }
  });

  if (existingDistrict) {
    throw new Error("District already exists");
  }

  return prisma.district.create({
    data,
  });
}

export async function getAllDistricts() {
  return prisma.district.findMany({
    orderBy: {
      name: "asc",
    },
  });
}