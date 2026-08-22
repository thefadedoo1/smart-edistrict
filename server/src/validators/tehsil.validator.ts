import { z } from "zod";

export const createTehsilSchema = z.object({
  name: z.string().min(2, "Tehsil name is required"),
  districtId: z.string().min(1, "District ID is required"),
  lgdCode: z.number().int().positive().optional(),
});

export type CreateTehsilInput = z.infer<typeof createTehsilSchema>;