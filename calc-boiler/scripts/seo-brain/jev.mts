/**
 * Thin wrapper over the TypeSafe SDK (Jev, System One).
 *
 * - Reads TYPESAFE_API_KEY from the environment, else ~/.config/typesafe/env.
 * - Caches every answered request on disk (docs/seo/seo-brain/.cache) keyed by
 *   a hash of {model, state, questions}, so re-running a stage is free and
 *   deterministic. Delete the cache dir to force fresh judgments.
 * - Runs requests with bounded concurrency and tallies token usage.
 *
 * Code owns the workflow; Jev answers narrow, typed questions. Never ask it to
 * count, do arithmetic, compare dates, or generate text (model-jaggedness docs).
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { TypeSafeClient, choice, noul, score, type Questions, type SystemOneResult } from "@typesafe-ai/sdk";

export { choice, noul, score };

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../../..");
const cacheDir = join(repo, "docs/seo/seo-brain/.cache");

function loadKey(): string {
  if (process.env.TYPESAFE_API_KEY?.trim()) return process.env.TYPESAFE_API_KEY.trim();
  const envFile = join(homedir(), ".config/typesafe/env");
  if (existsSync(envFile)) {
    const m = readFileSync(envFile, "utf8").match(/TYPESAFE_API_KEY=(\S+)/);
    if (m) return m[1];
  }
  throw new Error("TYPESAFE_API_KEY not set (env or ~/.config/typesafe/env)");
}

export const MODEL = process.env.JEV_MODEL ?? "jev-1.13.0";
let client: TypeSafeClient | null = null;
const getClient = () => (client ??= new TypeSafeClient({ apiKey: loadKey(), defaultModel: MODEL, timeout: 60_000 }));

export const usage = { requests: 0, cached: 0, inputTokens: 0, outputTokens: 0 };
export const costUsd = () => (usage.inputTokens / 1e6) * 0.042;

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

export async function ask<Q extends Questions>(state: JsonValue, questions: Q): Promise<SystemOneResult<Q>["answers"]> {
  const key = createHash("sha256").update(JSON.stringify({ m: MODEL, state, questions })).digest("hex").slice(0, 40);
  const file = join(cacheDir, key + ".json");
  if (existsSync(file)) { usage.cached++; return JSON.parse(readFileSync(file, "utf8")).answers; }
  const res = await getClient().systemOne({ state: state as never, questions });
  usage.requests++;
  usage.inputTokens += res.usage?.input_tokens ?? 0;
  usage.outputTokens += res.usage?.output_tokens ?? 0;
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(file, JSON.stringify({ model: res.model, state, questions, answers: res.answers, usage: res.usage }));
  return res.answers;
}

/** Run `fn` over `items` with at most `limit` in flight. Preserves order. */
export async function pool<T, R>(items: T[], limit: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) { const i = next++; out[i] = await fn(items[i], i); }
  });
  await Promise.all(workers);
  return out;
}

export function report(label: string) {
  console.log(`[jev] ${label}: ${usage.requests} requests (${usage.cached} cached), ${usage.inputTokens.toLocaleString()} input tokens ≈ $${costUsd().toFixed(3)}`);
}
