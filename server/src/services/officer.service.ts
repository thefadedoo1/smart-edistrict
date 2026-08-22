
import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { CreateOfficerInput } from "../validators/officer.validator";
import { Role } from "@prisma/client";

export async function createOfficer(
  data: CreateOfficerInput
) {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { phone: data.phone },
      ],
    },
  });

  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    10
  );

  return prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      role: data.role,
      districtId: data.districtId,
      tehsilId: data.tehsilId,
      villageId:
        data.role === Role.PATWARI
          ? data.villageId
          : null,
      isActive: data.isActive ?? true,
    },
    include: {
      district: true,
      tehsil: true,
      village: true,
    },
  });
}

export async function getAllOfficers() {
  return prisma.user.findMany({
    where: {
      role: {
        in: [
          Role.DA,
          Role.PATWARI,
          Role.TEHSILDAR,
        ],
      },
    },
    include: {
      district: true,
      tehsil: true,
      village: true,
    },
    orderBy: {
      fullName: "asc",
    },
  });
}

export async function getOfficerById(
  id: string
) {
  const officer =
    await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        district: true,
        tehsil: true,
        village: true,
      },
    });

  if (!officer) {
    throw new Error("Officer not found");
  }

  if (
    officer.role === Role.ADMIN ||
    officer.role === Role.CITIZEN
  ) {
    throw new Error(
      "Invalid officer."
    );
  }

  return officer;
}

export async function updateOfficer(
  id: string,
  data: Partial<CreateOfficerInput>
) {
  const officer =
    await prisma.user.findUnique({
      where: {
        id,
      },
    });

  if (!officer) {
    throw new Error("Officer not found");
  }

  if (
    officer.role === Role.ADMIN ||
    officer.role === Role.CITIZEN
  ) {
    throw new Error(
      "Administrator or Citizen cannot be modified here."
    );
  }

  const updateData: any = {
    ...data,
  };

  if (data.password) {
    updateData.password =
      await bcrypt.hash(
        data.password,
        10
      );
  }

  if (
    data.role &&
    data.role !== Role.PATWARI
  ) {
    updateData.villageId = null;
  }

  return prisma.user.update({
    where: {
      id,
    },
    data: updateData,
    include: {
      district: true,
      tehsil: true,
      village: true,
    },
  });
}

export async function deleteOfficer(
  id: string
) {
  const officer =
    await prisma.user.findUnique({
      where: {
        id,
      },
    });

  if (!officer) {
    throw new Error("Officer not found");
  }

  if (
    officer.role === Role.ADMIN ||
    officer.role === Role.CITIZEN
  ) {
    throw new Error(
      "Administrator or Citizen cannot be deactivated."
    );
  }

  return prisma.user.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
}
