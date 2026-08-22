import { z } from "zod";

export const createApplicationSchema = z.object({
  certificateServiceId: z.string().min(1, "Certificate Service ID is required"),
  formData: z.record(z.string(), z.any()),
  remarks: z.string().optional(),
});

export const updateApplicationSchema = z.object({
  formData: z.record(z.string(), z.any()).optional(),
  remarks: z.string().optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;