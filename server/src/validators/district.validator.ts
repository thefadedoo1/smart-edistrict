import { z } from "zod";

export const createDistrictSchema = z.object({
  name: z.string().min(2, "District name must be at least 2 characters"),
  lgdCode: z.number().int().positive("Valid LGD code required").optional(),
});

export type CreateDistrictInput = z.infer<typeof createDistrictSchema>;