import { Role } from "@prisma/client";
import prisma from "../config/prisma";

export async function getAssignedOfficers(
  citizenId: string,
  customLocation?: { districtId?: string; tehsilId?: string; villageId?: string; districtName?: string; tehsilName?: string }
) {
  const citizen = await prisma.user.findUnique({
    where: { id: citizenId },
    include: { profile: true },
  });

  let tehsilId = customLocation?.tehsilId || citizen?.profile?.tehsilId || undefined;
  let villageId = customLocation?.villageId || citizen?.profile?.villageId || undefined;
  let districtId = customLocation?.districtId || citizen?.profile?.districtId || undefined;

  // Try to find IDs by name if only names were supplied
  if (!tehsilId && customLocation?.tehsilName) {
    const foundTehsil = await prisma.tehsil.findFirst({
      where: { name: { contains: customLocation.tehsilName, mode: "insensitive" } },
    });
    if (foundTehsil) {
      tehsilId = foundTehsil.id;
      districtId = foundTehsil.districtId;
    }
  }

  /*
   * 1. Find Patwari (by village, tehsil, district, or fallback to any active Patwari)
   */
  let patwari = null;
  if (villageId) {
    patwari = await prisma.user.findFirst({
      where: { role: Role.PATWARI, villageId, isActive: true },
      select: { id: true, fullName: true, phone: true },
    });
  }
  if (!patwari && tehsilId) {
    patwari = await prisma.user.findFirst({
      where: { role: Role.PATWARI, tehsilId, isActive: true },
      select: { id: true, fullName: true, phone: true },
    });
  }

  /*
   * 2. Find Dealing Assistant (DA)
   */
  let da = null;
  if (tehsilId) {
    da = await prisma.user.findFirst({
      where: { role: Role.DA, tehsilId, isActive: true },
      select: { id: true, fullName: true, phone: true },
    });
  }
  if (!da && districtId) {
    da = await prisma.user.findFirst({
      where: { role: Role.DA, districtId, isActive: true },
      select: { id: true, fullName: true, phone: true },
    });
  }

  /*
   * 3. Find Tehsildar
   */
  let tehsildar = null;
  if (tehsilId) {
    tehsildar = await prisma.user.findFirst({
      where: { role: Role.TEHSILDAR, tehsilId, isActive: true },
      select: { id: true, fullName: true, phone: true },
    });
  }
  if (!tehsildar && districtId) {
    tehsildar = await prisma.user.findFirst({
      where: { role: Role.TEHSILDAR, districtId, isActive: true },
      select: { id: true, fullName: true, phone: true },
    });
  }

  if (!da || !patwari || !tehsildar) {
    throw new Error("Routing Error: Could not find assigned officers (DA, Patwari, or Tehsildar) for the applicant's specific Village/Tehsil/District.");
  }

  return {
    da,
    patwari,
    tehsildar,
  };
}