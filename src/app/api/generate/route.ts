import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { NextResponse } from "next/server";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/spec-gen/prompt";
import { RequestSchema, ResponseSchema } from "@/lib/spec-gen/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    const system = buildSystemPrompt(detail, language);
    const user = buildUserPrompt(input);

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
