import { describe, expect, it } from "vitest";
import { RequestSchema, ResponseSchema } from "./schema";

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

  it("fills default request values", () => {
    const parsed = RequestSchema.parse({ input: "build app" });
    expect(parsed.detail).toBe("medium");
    expect(parsed.language).toBe("ja");
  });
});
