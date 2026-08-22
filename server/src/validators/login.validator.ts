import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),

  password: z.string().min(1, "Password is required"),

  portal: z.enum([
    "CITIZEN",
    "OFFICER",
    "ADMIN",
  ]),
});

export type LoginInput = z.infer<typeof loginSchema>;