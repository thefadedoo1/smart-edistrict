import { z } from "zod";
import { WorkflowAction } from "@prisma/client";

export const workflowActionSchema = z.object({
  action: z.nativeEnum(WorkflowAction),
  remarks: z.string().optional(),
});

export type WorkflowActionInput = z.infer<
  typeof workflowActionSchema
>;