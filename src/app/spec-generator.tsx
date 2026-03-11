"use client";

import { useMemo, useState } from "react";
import styles from "./spec-generator.module.css";

type GeneratedFiles = {
  "requirements.md": string;
  "acceptance.md": string;
  "spec.md": string;
  "tasks.md": string;
  "test-plan.md": string;
};

type GenerateResponse = {
  projectName: string;
  files: GeneratedFiles;
  questions: string[];
};

type Detail = "low" | "medium" | "high";
type Language = "ja" | "en";

const DEFAULT_INPUT = `例:
「抽象要求」: 個人用に、毎日のタスクとメモをまとめて管理できる小さなWebアプリが欲しい。
制約: スマホでも使える/データはローカル優先/最初はログイン不要
`;

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SpecGenerator() {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [detail, setDetail] = useState<Detail>("medium");
  const [language, setLanguage] = useState<Language>("ja");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [tab, setTab] = useState<keyof GeneratedFiles>("requirements.md");

  const tabLabel = useMemo(() => {
    return {
      "requirements.md": "Requirements",
      "acceptance.md": "Acceptance",
      "spec.md": "Spec",
      "tasks.md": "Tasks",
      "test-plan.md": "Test Plan",
    } as const;
  }, []);

  async function onGenerate() {
    setBusy(true);
    setError(null);
    try {
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ input, detail, language }),
      });
      if (!resp.ok) {
        const data = (await resp.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error || `HTTP ${resp.status}`);
      }
      const data = (await resp.json()) as GenerateResponse;
      setResult(data);
      setTab("requirements.md");
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>抽象要求</div>
          <div className={styles.controls}>
            <select
              className={styles.select}
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              aria-label="language"
              disabled={busy}
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
            <select
              className={styles.select}
              value={detail}
              onChange={(e) => setDetail(e.target.value as Detail)}
              aria-label="detail"
              disabled={busy}
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
            <button
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={onGenerate}
              disabled={busy || input.trim().length === 0}
            >
              {busy ? "生成中..." : "生成"}
            </button>
          </div>
        </div>
        <textarea
          className={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="抽象要求を貼り付けてください"
          disabled={busy}
        />
        <div className={styles.meta}>
          {error ? (
            <span style={{ color: "rgba(255, 64, 64, 0.9)" }}>{error}</span>
          ) : (
            <span>
              生成結果はローカルに保存されません。必要ならmdをダウンロードして
              リポジトリへ貼り付けてください。
            </span>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.outputTop}>
          <div className={styles.tabs}>
            {(Object.keys(tabLabel) as Array<keyof GeneratedFiles>).map((k) => (
              <button
                key={k}
                className={`${styles.tab} ${tab === k ? styles.tabActive : ""}`}
                onClick={() => setTab(k)}
                disabled={!result}
              >
                {tabLabel[k]}
              </button>
            ))}
          </div>
          <button
            className={styles.button}
            onClick={() => {
              if (!result) return;
              downloadText(tab, result.files[tab]);
            }}
            disabled={!result}
          >
            このmdをDL
          </button>
          <button
            className={styles.button}
            onClick={() => {
              if (!result) return;
              for (const [name, content] of Object.entries(result.files)) {
                downloadText(name, content);
              }
            }}
            disabled={!result}
          >
            全部DL
          </button>
        </div>

        <pre className={styles.pre}>
          {result ? result.files[tab] : "まだ生成結果がありません。"}
        </pre>

        <div className={styles.meta}>
          {result ? (
            <>
              <div>project: {result.projectName}</div>
              {result.questions.length > 0 ? (
                <div>
                  未確定事項: {result.questions.slice(0, 3).join(" / ")}
                </div>
              ) : null}
            </>
          ) : (
            <span>
              ここに `requirements/spec/tasks/...` が生成されます。
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

