import { z } from "zod";

export const RequestSchema = z.object({
  input: z.string().min(1),
  detail: z.enum(["low", "medium", "high"]).default("medium"),
  language: z.enum(["ja", "en"]).default("ja"),
});

export const GeneratedFilesSchema = z.object({
  "requirements.md": z.string().min(1),
  "acceptance.md": z.string().min(1),
  "spec.md": z.string().min(1),
  "tasks.md": z.string().min(1),
  "test-plan.md": z.string().min(1),
});

export const ResponseSchema = z.object({
  projectName: z.string().min(1),
  files: GeneratedFilesSchema,
  questions: z.array(z.string()).default([]),
});

export type DetailLevel = z.infer<typeof RequestSchema>["detail"];
export type Language = z.infer<typeof RequestSchema>["language"];
