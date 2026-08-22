import prisma from "../config/prisma";
import { Role } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { RegisterInput } from "../validators/auth.validator";
import { LoginInput } from "../validators/login.validator";

export async function registerUser(data: RegisterInput) {
  const { fullName, email, phone, password } = data;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: Role.CITIZEN,
    },
  });

  return user;
}

export async function loginUser(data: LoginInput) {
  const { identifier, password, portal } = data;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { phone: identifier }],
    },
    include: {
      district: true,
      tehsil: true,
      village: true,
      profile: true,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  if (portal === "CITIZEN" && user.role !== Role.CITIZEN) {
    throw new Error("This account is not allowed to login as Citizen.");
  }

  if (portal === "ADMIN" && user.role !== Role.ADMIN) {
    throw new Error("This account is not allowed to login as Admin.");
  }

  const officerRoles: Role[] = [Role.DA, Role.PATWARI, Role.TEHSILDAR];
  if (portal === "OFFICER" && !officerRoles.includes(user.role)) {
    throw new Error("This account is not allowed to login as Officer.");
  }

  const token = generateToken(user.id, user.role);
  const { password: _, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
}

import { sendEmailNotification } from "./email.service";

// Temporary in-memory store for OTPs (For production, use Redis or add a field in DB)
const otpCache = new Map<string, { otp: string, expiresAt: number }>();

export async function forgotPasswordUser(email: string) {
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    // Return silently to avoid email enumeration
    return;
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP in cache, expires in 10 minutes
  otpCache.set(email, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000
  });
  
  const message = `Hello ${user.fullName},\n\nYou have requested to reset your password. Your One-Time Password (OTP) is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.`;

  await sendEmailNotification(email, "Password Reset OTP", message);
}

export async function resetPasswordUser(email: string, otp: string, newPassword: string) {
  const record = otpCache.get(email);

  if (!record) {
    throw new Error("No OTP request found for this email, or it has expired.");
  }

  if (Date.now() > record.expiresAt) {
    otpCache.delete(email);
    throw new Error("OTP has expired. Please request a new one.");
  }

  if (record.otp !== otp) {
    throw new Error("Invalid OTP.");
  }

  // Hash the new password
  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  // Clear OTP from cache after successful reset
  otpCache.delete(email);
}