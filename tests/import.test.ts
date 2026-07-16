import { beforeEach, describe, expect, it, vi } from "vitest";
import { createClient } from "@/lib/supabase/client";
import type { FakeSupabaseClient } from "./mocks/supabase";

vi.mock("@/lib/supabase/client", async () => {
  const { createFakeSupabaseClient } = await import("./mocks/supabase");
  const client = createFakeSupabaseClient();
  return { createClient: () => client };
});

import { getEvaluations, importData, saveEvaluation } from "@/lib/storage";
import { APP_VERSION, DEFAULT_SETTINGS } from "@/lib/constants";
import type { ClientEvaluation } from "@/types/evaluation";
import type { ExportFormat } from "@/types/evaluation";

function buildEvaluation(overrides: Partial<ClientEvaluation> = {}): ClientEvaluation {
  const now = new Date().toISOString();
  return {
    id: `eval_${Math.random().toString(36).slice(2, 8)}`,
    clientName: "Nova Commerce",
    projectName: "Shopify Raporlama Otomasyonu",
    currency: "USD",
    inquiryDate: now,
    answers: [],
    standardScore: 0,
    weightedScore: 0,
    confidenceLevel: "low",
    decision: "yellow_flag",
    criticalFailures: [],
    isDraft: false,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function buildExport(evaluations: ClientEvaluation[]): ExportFormat {
  return {
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    settings: DEFAULT_SETTINGS,
    evaluations,
  };
}

beforeEach(() => {
  window.localStorage.clear();
  (createClient() as unknown as FakeSupabaseClient).reset();
});

describe("importData", () => {
  it("reports a descriptive error for invalid JSON", async () => {
    const result = await importData("{not valid json");
    expect(result.success).toBe(false);
    expect(result.errors[0]).toMatch(/JSON/i);
  });

  it("reports a descriptive error when the JSON does not match the export schema", async () => {
    const result = await importData(JSON.stringify({ hello: "world" }));
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("imports valid evaluations and merges them with existing data", async () => {
    const existing = buildEvaluation();
    await saveEvaluation(existing);

    const incoming = buildEvaluation();
    const result = await importData(JSON.stringify(buildExport([incoming])), "merge");

    expect(result.success).toBe(true);
    expect(result.importedCount).toBe(1);
    expect(await getEvaluations()).toHaveLength(2);
  });

  it("detects duplicate records by id and skips them", async () => {
    const existing = buildEvaluation();
    await saveEvaluation(existing);

    const result = await importData(JSON.stringify(buildExport([existing])), "merge");

    expect(result.duplicateCount).toBe(1);
    expect(result.importedCount).toBe(0);
    expect(await getEvaluations()).toHaveLength(1);
  });

  it("overwrites existing data when mode is overwrite", async () => {
    await saveEvaluation(buildEvaluation());
    const incoming = buildEvaluation();

    const result = await importData(JSON.stringify(buildExport([incoming])), "overwrite");

    expect(result.success).toBe(true);
    const evaluations = await getEvaluations();
    expect(evaluations).toHaveLength(1);
    expect(evaluations[0].id).toBe(incoming.id);
  });
});
