import { describe, expect, it } from "vitest";
import {
  buildSystemPrompt,
  buildUserPrompt,
  detailInstruction,
  languageInstruction,
} from "./prompt";

describe("prompt helpers", () => {
  it("returns instruction for each detail level", () => {
    expect(detailInstruction("low")).toContain("minimal");
    expect(detailInstruction("medium")).toContain("Moderate detail");
    expect(detailInstruction("high")).toContain("edge cases");
  });

  it("returns instruction for each language", () => {
    expect(languageInstruction("ja")).toBe("Write in Japanese.");
    expect(languageInstruction("en")).toBe("Write in English.");
  });

  it("builds system prompt with detail and language", () => {
    const prompt = buildSystemPrompt("high", "en");
    expect(prompt).toContain("product-focused specification assistant");
    expect(prompt).toContain("Write in English.");
    expect(prompt).toContain("edge cases");
  });

  it("builds user prompt from trimmed input", () => {
    const prompt = buildUserPrompt("  build todo app  ");
    expect(prompt).toContain("User request:");
    expect(prompt).toContain("build todo app");
    expect(prompt).toContain("Project name should be short");
  });
});
