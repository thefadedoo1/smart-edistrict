import { z } from "zod";

export const createDistrictSchema = z.object({
  name: z
    .string()
    .min(2, "District name must be at least 2 characters"),

  code: z
    .string()
    .min(2, "District code is required")
    .max(10, "District code cannot exceed 10 characters")
    .transform((value) => value.toUpperCase()),
});

export type CreateDistrictInput = z.infer<typeof createDistrictSchema>;