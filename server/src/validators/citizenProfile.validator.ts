import { z } from "zod";
import { Gender } from "@prisma/client";

export const createCitizenProfileSchema = z.object({
  aadhaarNumber: z.string().length(12).optional(),

  gender: z.nativeEnum(Gender).optional(),

  dateOfBirth: z.string().optional(),

  fatherName: z.string().min(2).optional(),

  motherName: z.string().min(2).optional(),

  address: z.string().min(5).optional(),

  pincode: z.string().length(6).optional(),

  districtId: z.string().uuid().optional(),

  tehsilId: z.string().uuid().optional(),

  villageId: z.string().uuid().optional(),
});

export type CreateCitizenProfileInput =
  z.infer<typeof createCitizenProfileSchema>;