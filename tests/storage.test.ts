import { beforeEach, describe, expect, it } from "vitest";
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
import { DEFAULT_SETTINGS, EVALUATIONS_STORAGE_KEY, SETTINGS_STORAGE_KEY } from "@/lib/constants";
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
});

describe("evaluations storage", () => {
  it("returns an empty array when nothing has been stored", () => {
    expect(getEvaluations()).toEqual([]);
  });

  it("saves and retrieves an evaluation", () => {
    const evaluation = buildEvaluation();
    saveEvaluation(evaluation);
    expect(getEvaluations()).toHaveLength(1);
    expect(getEvaluationById(evaluation.id)?.clientName).toBe("Nova Commerce");
  });

  it("updates an evaluation and bumps updatedAt", () => {
    const evaluation = buildEvaluation();
    saveEvaluation(evaluation);
    const updated = updateEvaluation(evaluation.id, { clientName: "Nova Retail" });
    expect(updated?.clientName).toBe("Nova Retail");
    expect(getEvaluationById(evaluation.id)?.clientName).toBe("Nova Retail");
  });

  it("deletes an evaluation", () => {
    const evaluation = buildEvaluation();
    saveEvaluation(evaluation);
    expect(deleteEvaluation(evaluation.id)).toBe(true);
    expect(getEvaluations()).toHaveLength(0);
  });

  it("archives an evaluation", () => {
    const evaluation = buildEvaluation();
    saveEvaluation(evaluation);
    const archived = archiveEvaluation(evaluation.id);
    expect(archived?.isArchived).toBe(true);
  });

  it("duplicates an evaluation with a new id and draft status", () => {
    const evaluation = buildEvaluation({ isDraft: false });
    saveEvaluation(evaluation);
    const copy = duplicateEvaluation(evaluation.id);
    expect(copy?.id).not.toBe(evaluation.id);
    expect(copy?.isDraft).toBe(true);
    expect(getEvaluations()).toHaveLength(2);
  });

  it("ignores corrupted JSON and returns an empty list instead of crashing", () => {
    window.localStorage.setItem(EVALUATIONS_STORAGE_KEY, "{not valid json");
    expect(getEvaluations()).toEqual([]);
  });

  it("drops entries that fail schema validation instead of loading corrupt data", () => {
    window.localStorage.setItem(
      EVALUATIONS_STORAGE_KEY,
      JSON.stringify([{ id: "bad", clientName: "" }])
    );
    expect(getEvaluations()).toEqual([]);
  });
});

describe("settings storage", () => {
  it("returns default settings when nothing has been stored", () => {
    expect(getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("persists and retrieves custom settings", () => {
    const customSettings = { ...DEFAULT_SETTINGS, agencyName: "Acme Ajans" };
    saveSettings(customSettings);
    expect(getSettings().agencyName).toBe("Acme Ajans");
  });

  it("falls back to defaults when stored settings are corrupted", () => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, "not json");
    expect(getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("resets settings back to defaults", () => {
    saveSettings({ ...DEFAULT_SETTINGS, agencyName: "Custom" });
    resetSettings();
    expect(getSettings()).toEqual(DEFAULT_SETTINGS);
  });
});
