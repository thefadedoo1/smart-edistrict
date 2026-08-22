import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

export async function seedAdmin(
  prisma: PrismaClient
) {
  console.log("👤 Seeding Admin...");

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await prisma.user.upsert({
    where: {
      email: "admin@edistrict.gov.in",
    },
    update: {
      phone: "9317736200",
      password: hashedPassword,
    },
    create: {
      fullName: "System Administrator",
      email: "admin@edistrict.gov.in",
      phone: "9317736200",
      password: hashedPassword,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  console.log("✅ Admin credentials ensured.");
}