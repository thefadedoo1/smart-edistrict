
import { z } from "zod";
import { Role } from "@prisma/client";

export const createOfficerSchema = z
  .object({
    fullName: z.string().min(3),
    email: z.string().email(),
    phone: z.string().min(10).max(15),
    password: z.string().min(6),

    role: z.nativeEnum(Role).refine(
      (role) => role !== Role.CITIZEN,
      {
        message: "Officer role is required",
      }
    ),

    districtId: z.string().uuid(),

    tehsilId: z.string().uuid().optional(),

    villageId: z.string().uuid().optional(),

    isActive: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.role === Role.DA ||
      data.role === Role.TEHSILDAR ||
      data.role === Role.PATWARI
    ) {
      if (!data.tehsilId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["tehsilId"],
          message: "Tehsil is required.",
        });
      }
    }

    if (data.role === Role.PATWARI && !data.villageId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["villageId"],
        message: "Village is required for Patwari.",
      });
    }
  });

export type CreateOfficerInput = z.infer<
  typeof createOfficerSchema
>;
