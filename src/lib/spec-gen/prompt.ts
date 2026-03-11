import type { DetailLevel, Language } from "./schema";

export function detailInstruction(detail: DetailLevel) {
  if (detail === "low") return "Keep it minimal. Prefer short lists.";
  if (detail === "high") {
    return "Be detailed. Include edge cases, errors, and concrete acceptance criteria.";
  }
  return "Moderate detail. Enough to implement without guessing.";
}

export function languageInstruction(language: Language) {
  return language === "ja" ? "Write in Japanese." : "Write in English.";
}

export function buildSystemPrompt(detail: DetailLevel, language: Language) {
  return [
    "You are a product-focused specification assistant.",
    "Turn a vague user request into spec-driven Markdown files used for development.",
    "Output must be valid JSON matching the given schema.",
    "Keep file contents self-contained and consistent across files.",
    languageInstruction(language),
    detailInstruction(detail),
  ].join("\n");
}

export function buildUserPrompt(input: string) {
  return [
    "User request:",
    input.trim(),
    "",
    "Generate these files:",
    "- requirements.md: Goal/Non-goals/Constraints",
    "- acceptance.md: AC-001... with Given/When/Then",
    "- spec.md: Overview/Interfaces/Data Model/Error Handling/Security/Ops",
    "- tasks.md: Backlog with tasks mapped to AC ids",
    "- test-plan.md: Scope/Strategy/Test Cases/Non-functional/CI Mapping",
    "",
    "Also output a short 'questions' list for missing info.",
    "Project name should be short and filesystem-safe (kebab-case).",
  ].join("\n");
}
