import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const { openAICtorMock, parseMock, zodResponseFormatMock } = vi.hoisted(() => {
  const parse = vi.fn();
  const ctor = vi.fn(() => ({
    chat: {
      completions: {
        parse,
      },
    },
  }));
  const zodFormat = vi.fn(() => ({ type: "json_schema" }));
  return { openAICtorMock: ctor, parseMock: parse, zodResponseFormatMock: zodFormat };
});

vi.mock("openai", () => ({
  default: openAICtorMock,
}));

vi.mock("openai/helpers/zod", () => ({
  zodResponseFormat: zodResponseFormatMock,
}));

import { POST, dynamic, runtime } from "./route";

const originalApiKey = process.env.OPENAI_API_KEY;
const originalModel = process.env.OPENAI_MODEL;

const bundle = {
  projectName: "my-app",
  files: {
    "requirements.md": "# Requirements",
    "acceptance.md": "# Acceptance",
    "spec.md": "# Spec",
    "tasks.md": "# Tasks",
    "test-plan.md": "# Test Plan",
  },
  questions: ["q1"],
};

function makeRequest(payload: unknown) {
  return new Request("http://localhost/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

describe("POST /api/generate", () => {
  beforeEach(() => {
    process.env.OPENAI_API_KEY = "test-key";
    delete process.env.OPENAI_MODEL;
    parseMock.mockReset();
    zodResponseFormatMock.mockClear();
    openAICtorMock.mockClear();
  });

  afterAll(() => {
    if (originalApiKey === undefined) {
      delete process.env.OPENAI_API_KEY;
    } else {
      process.env.OPENAI_API_KEY = originalApiKey;
    }
    if (originalModel === undefined) {
      delete process.env.OPENAI_MODEL;
    } else {
      process.env.OPENAI_MODEL = originalModel;
    }
  });

  it("exports runtime settings", () => {
    expect(runtime).toBe("nodejs");
    expect(dynamic).toBe("force-dynamic");
  });

  it("returns 500 when api key is missing", async () => {
    delete process.env.OPENAI_API_KEY;
    const res = await POST(makeRequest({ input: "x" }));
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      error: "OPENAI_API_KEY is not set on the server",
    });
  });

  it("returns 400 for invalid request", async () => {
    const res = await POST(makeRequest({ input: "" }));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "invalid request" });
  });

  it("returns generated bundle", async () => {
    process.env.OPENAI_MODEL = "gpt-test";
    parseMock.mockResolvedValue({
      choices: [{ message: { parsed: bundle } }],
    });

    const res = await POST(
      makeRequest({
        input: "  Build a todo app  ",
        detail: "high",
        language: "en",
      }),
    );

    expect(openAICtorMock).toHaveBeenCalledWith({ apiKey: "test-key" });
    expect(parseMock).toHaveBeenCalledTimes(1);
    expect(parseMock.mock.calls[0][0]).toMatchObject({
      model: "gpt-test",
      temperature: 0.2,
    });
    expect(parseMock.mock.calls[0][0].messages[1].content).toContain("Build a todo app");

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual(bundle);
  });

  it("returns 502 when parsed output is empty", async () => {
    parseMock.mockResolvedValue({
      choices: [{ message: {} }],
    });

    const res = await POST(makeRequest({ input: "build app" }));
    expect(res.status).toBe(502);
    await expect(res.json()).resolves.toEqual({
      error: "model returned no parsed output",
    });
  });

  it("returns 500 with error message on known error", async () => {
    parseMock.mockRejectedValue(new Error("openai failed"));

    const res = await POST(makeRequest({ input: "build app" }));
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: "openai failed" });
  });

  it("returns 500 unknown error for non-Error throw", async () => {
    parseMock.mockRejectedValue("bad");

    const res = await POST(makeRequest({ input: "build app" }));
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: "unknown error" });
  });
});
