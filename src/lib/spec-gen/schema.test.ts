import { describe, expect, it } from "vitest";
import { z } from "zod";

const GeneratedFilesSchema = z.object({
  "requirements.md": z.string().min(1),
  "acceptance.md": z.string().min(1),
  "spec.md": z.string().min(1),
  "tasks.md": z.string().min(1),
  "test-plan.md": z.string().min(1),
});

const ResponseSchema = z.object({
  projectName: z.string().min(1),
  files: GeneratedFilesSchema,
  questions: z.array(z.string()).default([]),
});

describe("spec bundle schema", () => {
  it("accepts minimal valid payload", () => {
    const parsed = ResponseSchema.parse({
      projectName: "my-project",
      files: {
        "requirements.md": "# Requirements\n",
        "acceptance.md": "# Acceptance\n",
        "spec.md": "# Spec\n",
        "tasks.md": "# Tasks\n",
        "test-plan.md": "# Test Plan\n",
      },
      questions: [],
    });
    expect(parsed.projectName).toBe("my-project");
  });

  it("rejects missing files", () => {
    expect(() =>
      ResponseSchema.parse({
        projectName: "x",
        files: { "requirements.md": "a" },
      }),
    ).toThrow();
  });
});

