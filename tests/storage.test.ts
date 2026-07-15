import { beforeEach, describe, expect, it, vi } from "vitest";
import { createClient } from "@/lib/supabase/client";
import type { FakeSupabaseClient } from "./mocks/supabase";

vi.mock("@/lib/supabase/client", async () => {
  const { createFakeSupabaseClient } = await import("./mocks/supabase");
  const client = createFakeSupabaseClient();
  return { createClient: () => client };
});

import {
  archiveEvaluation,
  deleteEvaluation,
  duplicateEvaluation,
  getEvaluationById,
  getEvaluations,
  getSettings,
  resetSettings,
  saveEvaluation,
  saveSettings,
  updateEvaluation,
} from "@/lib/storage";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import type { ClientEvaluation } from "@/types/evaluation";

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

beforeEach(() => {
  window.localStorage.clear();
  (createClient() as unknown as FakeSupabaseClient).reset();
});

describe("evaluations storage", () => {
  it("returns an empty array when nothing has been stored", async () => {
    expect(await getEvaluations()).toEqual([]);
  });

  it("saves and retrieves an evaluation", async () => {
    const evaluation = buildEvaluation();
    await saveEvaluation(evaluation);
    expect(await getEvaluations()).toHaveLength(1);
    expect((await getEvaluationById(evaluation.id))?.clientName).toBe("Nova Commerce");
  });

  it("updates an evaluation and bumps updatedAt", async () => {
    const evaluation = buildEvaluation();
    await saveEvaluation(evaluation);
    const updated = await updateEvaluation(evaluation.id, { clientName: "Nova Retail" });
    expect(updated?.clientName).toBe("Nova Retail");
    expect((await getEvaluationById(evaluation.id))?.clientName).toBe("Nova Retail");
  });

  it("deletes an evaluation", async () => {
    const evaluation = buildEvaluation();
    await saveEvaluation(evaluation);
    expect(await deleteEvaluation(evaluation.id)).toBe(true);
    expect(await getEvaluations()).toHaveLength(0);
  });

  it("archives an evaluation", async () => {
    const evaluation = buildEvaluation();
    await saveEvaluation(evaluation);
    const archived = await archiveEvaluation(evaluation.id);
    expect(archived?.isArchived).toBe(true);
  });

  it("duplicates an evaluation with a new id and draft status", async () => {
    const evaluation = buildEvaluation({ isDraft: false });
    await saveEvaluation(evaluation);
    const copy = await duplicateEvaluation(evaluation.id);
    expect(copy?.id).not.toBe(evaluation.id);
    expect(copy?.isDraft).toBe(true);
    expect(await getEvaluations()).toHaveLength(2);
  });
});

describe("settings storage", () => {
  it("returns default settings when nothing has been stored", async () => {
    expect(await getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("persists and retrieves custom settings", async () => {
    const customSettings = { ...DEFAULT_SETTINGS, agencyName: "Acme Ajans" };
    await saveSettings(customSettings);
    expect((await getSettings()).agencyName).toBe("Acme Ajans");
  });

  it("resets settings back to defaults", async () => {
    await saveSettings({ ...DEFAULT_SETTINGS, agencyName: "Custom" });
    await resetSettings();
    expect(await getSettings()).toEqual(DEFAULT_SETTINGS);
  });
});
