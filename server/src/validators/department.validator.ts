import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, "Department name is required")
    .max(100),

  code: z
    .string()
    .min(2)
    .max(20)
    .transform((v) => v.toUpperCase()),

  description: z
    .string()
    .max(500)
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export type CreateDepartmentInput = z.infer<
  typeof createDepartmentSchema
>;