import { z } from "zod";

export const officerRoles = ["DA", "PATWARI", "TEHSILDAR"] as const;

export const createOfficerSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is too short").max(15, "Phone number is too long"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(officerRoles, { message: "Officer role is required" }),
  districtId: z.string().min(1, "District is required"),
  tehsilId: z.string().optional(),
  villageId: z.string().optional(),
  isActive: z.boolean(),
});

export type CreateOfficerForm = z.infer<typeof createOfficerSchema>;
