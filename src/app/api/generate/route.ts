import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RequestSchema = z.object({
  input: z.string().min(1),
  detail: z.enum(["low", "medium", "high"]).default("medium"),
  language: z.enum(["ja", "en"]).default("ja"),
});

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

function detailInstruction(detail: "low" | "medium" | "high") {
  if (detail === "low") return "Keep it minimal. Prefer short lists.";
  if (detail === "high")
    return "Be detailed. Include edge cases, errors, and concrete acceptance criteria.";
  return "Moderate detail. Enough to implement without guessing.";
}

function languageInstruction(language: "ja" | "en") {
  return language === "ja" ? "Write in Japanese." : "Write in English.";
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not set on the server" },
        { status: 500 },
      );
    }

    const json = await req.json();
    const parsedReq = RequestSchema.safeParse(json);
    if (!parsedReq.success) {
      return NextResponse.json({ error: "invalid request" }, { status: 400 });
    }

    const { input, detail, language } = parsedReq.data;

    const openai = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const system = [
      "You are a product-focused specification assistant.",
      "Turn a vague user request into spec-driven Markdown files used for development.",
      "Output must be valid JSON matching the given schema.",
      "Keep file contents self-contained and consistent across files.",
      languageInstruction(language),
      detailInstruction(detail),
    ].join("\n");

    const user = [
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

    const completion = await openai.chat.completions.parse({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: zodResponseFormat(ResponseSchema, "spec_bundle"),
      temperature: 0.2,
    });

    const bundle = completion.choices[0]?.message?.parsed;
    if (!bundle) {
      return NextResponse.json(
        { error: "model returned no parsed output" },
        { status: 502 },
      );
    }

    return NextResponse.json(bundle);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown error" },
      { status: 500 },
    );
  }
}

