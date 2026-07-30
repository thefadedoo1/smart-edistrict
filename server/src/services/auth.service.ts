import prisma from "../config/prisma";
import { Role } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { RegisterInput } from "../validators/auth.validator";
import { LoginInput } from "../validators/login.validator";

// =======================
// Register User
// =======================
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

// =======================
// Login User
// =======================
export async function loginUser(data: LoginInput) {
  const { identifier, password } = data;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { phone: identifier }],
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await comparePassword(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user.id, user.role);

  const { password: _, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
}