import { z } from "zod";

export const createVillageSchema = z.object({
  name: z.string().min(2, "Village name is required"),
  tehsilId: z.string().min(1, "Tehsil ID is required"),
  lgdCode: z.number().int().positive().optional(),
});

export type CreateVillageInput = z.infer<typeof createVillageSchema>;