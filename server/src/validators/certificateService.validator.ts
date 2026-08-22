import { z } from "zod";

export const createCertificateServiceSchema = z.object({
  name: z.string().min(3, "Service name must be at least 3 characters").max(100),
  code: z.string().min(2, "Service code is required").max(50).optional(),
  departmentId: z.string().min(1, "Department ID is required").optional(),
  description: z.string().max(500).optional(),
  processingDays: z.number().int().min(1, "Processing days must be at least 1"),
  isActive: z.boolean().optional(),
});

export type CreateCertificateServiceInput = z.infer<typeof createCertificateServiceSchema>;