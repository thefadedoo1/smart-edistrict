import prisma from "../config/prisma";
import { CreateCitizenProfileInput } from "../validators/citizenProfile.validator";

export async function createProfile(
  userId: string,
  data: CreateCitizenProfileInput
) {
  const existing = await prisma.citizenProfile.findUnique({
    where: {
      userId,
    },
  });

  if (existing) {
    throw new Error("Profile already exists");
  }

  return prisma.citizenProfile.create({
    data: {
      userId,
      ...data,
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth)
        : undefined,
    },
    include: {
      district: true,
      tehsil: true,
      village: true,
      user: true,
    },
  });
}

export async function getProfile(userId: string) {
  return prisma.citizenProfile.findUnique({
    where: {
      userId,
    },
    include: {
      district: true,
      tehsil: true,
      village: true,
      user: true,
    },
  });
}

export async function updateProfile(
  userId: string,
  data: Partial<CreateCitizenProfileInput>
) {
  const profile = await prisma.citizenProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw new Error("Profile not found");
  }

  return prisma.citizenProfile.update({
    where: {
      userId,
    },
    data: {
      ...data,
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth)
        : undefined,
    },
    include: {
      district: true,
      tehsil: true,
      village: true,
      user: true,
    },
  });
}