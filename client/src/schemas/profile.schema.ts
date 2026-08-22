import { z } from "zod";

export const profileSchema = z.object({
  aadhaarNumber: z
    .string()
    .length(12, "Aadhaar must be 12 digits")
    .optional()
    .or(z.literal("")),

  gender: z
    .enum(["MALE", "FEMALE", "OTHER"])
    .optional(),

  dateOfBirth: z.string().optional(),

  fatherName: z
    .string()
    .trim()
    .min(2, "Father name must be at least 2 characters")
    .optional()
    .or(z.literal("")),

  motherName: z
    .string()
    .trim()
    .min(2, "Mother name must be at least 2 characters")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .optional()
    .or(z.literal("")),

  pincode: z
    .string()
    .length(6, "Pincode must be 6 digits")
    .optional()
    .or(z.literal("")),

  districtId: z.string().optional(),

  tehsilId: z.string().optional(),

  villageId: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;