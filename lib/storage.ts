import { APP_VERSION, DEFAULT_SETTINGS, EVALUATIONS_STORAGE_KEY, SETTINGS_STORAGE_KEY } from "@/lib/constants";
import { nowISODate } from "@/lib/dates";
import { getDemoModeSnapshot, setDemoModeValue } from "@/lib/demo-mode-store";
import { agencySettingsSchema, clientEvaluationSchema, exportFormatSchema } from "@/lib/validation";
import type { ClientEvaluation, ExportFormat, ImportResult } from "@/types/evaluation";
import type { AgencySettings } from "@/types/settings";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readRaw(key: string): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeParseJSON(raw: string): unknown | null {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

// --- Evaluations ---------------------------------------------------------

// Records created by the original single-record sample loader predate the
// isDemo field. Recognize that exact signature once and flag it as demo data
// so it separates cleanly from real evaluations without user action.
const LEGACY_DEMO_CLIENT_NAME = "Nova Commerce";
const LEGACY_DEMO_PROJECT_NAME = "Shopify Raporlama Otomasyonu";

function migrateLegacyDemoEvaluations(
  evaluations: ClientEvaluation[]
): { evaluations: ClientEvaluation[]; changed: boolean } {
  let changed = false;
  const migrated = evaluations.map((evaluation) => {
    if (
      !evaluation.isDemo &&
      evaluation.clientName === LEGACY_DEMO_CLIENT_NAME &&
      evaluation.projectName === LEGACY_DEMO_PROJECT_NAME
    ) {
      changed = true;
      return { ...evaluation, isDemo: true };
    }
    return evaluation;
  });
  return { evaluations: migrated, changed };
}

export function getEvaluations(): ClientEvaluation[] {
  const raw = readRaw(EVALUATIONS_STORAGE_KEY);
  if (!raw) return [];
  const parsed = safeParseJSON(raw);
  if (!Array.isArray(parsed)) return [];

  const evaluations: ClientEvaluation[] = [];
  for (const item of parsed) {
    const validated = clientEvaluationSchema.safeParse(item);
    if (validated.success) {
      evaluations.push(validated.data as ClientEvaluation);
    }
  }

  const { evaluations: migrated, changed } = migrateLegacyDemoEvaluations(evaluations);
  if (changed) {
    persistEvaluations(migrated);
  }
  return migrated;
}

function persistEvaluations(evaluations: ClientEvaluation[]): void {
  writeRaw(EVALUATIONS_STORAGE_KEY, JSON.stringify(evaluations));
}

export function getEvaluationById(id: string): ClientEvaluation | undefined {
  return getEvaluations().find((evaluation) => evaluation.id === id);
}

export function saveEvaluation(evaluation: ClientEvaluation): ClientEvaluation {
  const evaluations = getEvaluations();
  evaluations.push(evaluation);
  persistEvaluations(evaluations);
  return evaluation;
}

export function updateEvaluation(
  id: string,
  updates: Partial<Omit<ClientEvaluation, "id">>
): ClientEvaluation | undefined {
  const evaluations = getEvaluations();
  const index = evaluations.findIndex((evaluation) => evaluation.id === id);
  if (index === -1) return undefined;

  const updated: ClientEvaluation = {
    ...evaluations[index],
    ...updates,
    id,
    updatedAt: nowISODate(),
  };
  evaluations[index] = updated;
  persistEvaluations(evaluations);
  return updated;
}

export function deleteEvaluation(id: string): boolean {
  const evaluations = getEvaluations();
  const next = evaluations.filter((evaluation) => evaluation.id !== id);
  if (next.length === evaluations.length) return false;
  persistEvaluations(next);
  return true;
}

export function deleteEvaluations(ids: string[]): number {
  const idSet = new Set(ids);
  const evaluations = getEvaluations();
  const next = evaluations.filter((evaluation) => !idSet.has(evaluation.id));
  persistEvaluations(next);
  return evaluations.length - next.length;
}

export function archiveEvaluation(id: string, isArchived = true): ClientEvaluation | undefined {
  return updateEvaluation(id, { isArchived });
}

export function duplicateEvaluation(id: string): ClientEvaluation | undefined {
  const original = getEvaluationById(id);
  if (!original) return undefined;

  const now = nowISODate();
  const copy: ClientEvaluation = {
    ...original,
    id: generateId(),
    clientName: `${original.clientName} (Kopya)`,
    isDraft: true,
    isArchived: false,
    isDemo: false,
    createdAt: now,
    updatedAt: now,
  };
  saveEvaluation(copy);
  return copy;
}

// --- Demo mode --------------------------------------------------------------
// Delegates to lib/demo-mode-store.ts so every consumer (including hooks
// using useSyncExternalStore) observes the same value and gets notified of
// changes made from anywhere in the app, not just their own component.

export function getDemoMode(): boolean {
  return getDemoModeSnapshot();
}

export function setDemoMode(enabled: boolean): void {
  setDemoModeValue(enabled);
}

export function seedDemoEvaluations(demoEvaluations: ClientEvaluation[]): void {
  const existing = getEvaluations().filter((evaluation) => !evaluation.isDemo);
  persistEvaluations([...existing, ...demoEvaluations]);
}

// --- Settings -------------------------------------------------------------

export function getSettings(): AgencySettings {
  const raw = readRaw(SETTINGS_STORAGE_KEY);
  if (!raw) return DEFAULT_SETTINGS;

  const parsed = safeParseJSON(raw);
  const validated = agencySettingsSchema.safeParse(parsed);
  if (!validated.success) return DEFAULT_SETTINGS;
  return validated.data as AgencySettings;
}

export function saveSettings(settings: AgencySettings): void {
  writeRaw(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function resetSettings(): AgencySettings {
  saveSettings(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

// --- Export / Import -------------------------------------------------------

export function exportData(): ExportFormat {
  return {
    appVersion: APP_VERSION,
    exportedAt: nowISODate(),
    settings: getSettings(),
    evaluations: getEvaluations(),
  };
}

export function importData(raw: string, mode: "merge" | "overwrite" = "merge"): ImportResult {
  const parsed = safeParseJSON(raw);
  if (parsed === null) {
    return {
      success: false,
      importedCount: 0,
      skippedCount: 0,
      duplicateCount: 0,
      errors: ["Dosya geçerli bir JSON içermiyor."],
    };
  }

  const validated = exportFormatSchema.safeParse(parsed);
  if (!validated.success) {
    return {
      success: false,
      importedCount: 0,
      skippedCount: 0,
      duplicateCount: 0,
      errors: validated.error.issues.map(
        (issue) => `${issue.path.join(".") || "kök"}: ${issue.message}`
      ),
    };
  }

  const incoming = validated.data.evaluations;
  const existing = mode === "overwrite" ? [] : getEvaluations();
  const existingIds = new Set(existing.map((evaluation) => evaluation.id));

  let importedCount = 0;
  let duplicateCount = 0;
  const merged = [...existing];

  for (const evaluation of incoming) {
    if (existingIds.has(evaluation.id)) {
      duplicateCount += 1;
      continue;
    }
    merged.push(evaluation);
    existingIds.add(evaluation.id);
    importedCount += 1;
  }

  persistEvaluations(merged);
  if (mode === "overwrite") {
    saveSettings(validated.data.settings);
  }

  return {
    success: true,
    importedCount,
    skippedCount: 0,
    duplicateCount,
    errors: [],
  };
}
