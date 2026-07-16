import * as demoStorage from "@/lib/demo-storage";
import { APP_VERSION, DEFAULT_SETTINGS } from "@/lib/constants";
import { nowISODate } from "@/lib/dates";
import { getDemoModeSnapshot, setDemoModeValue } from "@/lib/demo-mode-store";
import { generateId } from "@/lib/ids";
import { createClient } from "@/lib/supabase/client";
import { agencySettingsSchema, clientEvaluationSchema, exportFormatSchema } from "@/lib/validation";
import type { ClientEvaluation, ExportFormat, ImportResult } from "@/types/evaluation";
import type { AgencySettings } from "@/types/settings";

export { generateId };

// --- Evaluations -------------------------------------------------------
// Every function here checks demo mode first and, if it's on, delegates to
// lib/demo-storage.ts (a local-only sandbox) instead of touching Supabase.
// This keeps demo data fully separate from real user data, and means every
// caller of these functions (hooks, wizard, scenario simulator, etc.) stays
// completely unaware demo mode exists — the branch lives in one place.

interface EvaluationRow {
  id: string;
  payload: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

function rowToEvaluation(row: EvaluationRow): ClientEvaluation | null {
  const validated = clientEvaluationSchema.safeParse({
    ...row.payload,
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isDemo: false,
  });
  return validated.success ? (validated.data as ClientEvaluation) : null;
}

function toPayload(evaluation: ClientEvaluation): Record<string, unknown> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured only to exclude these keys from payload
  const { id, createdAt, updatedAt, isDemo, ...payload } = evaluation;
  return payload;
}

export async function getEvaluations(): Promise<ClientEvaluation[]> {
  if (getDemoModeSnapshot()) return demoStorage.getEvaluations();

  const supabase = createClient();
  const { data, error } = await supabase
    .from("evaluations")
    .select("id, payload, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? [])
    .map((row) => rowToEvaluation(row as EvaluationRow))
    .filter((evaluation): evaluation is ClientEvaluation => evaluation !== null);
}

export async function getEvaluationById(id: string): Promise<ClientEvaluation | undefined> {
  if (getDemoModeSnapshot()) return demoStorage.getEvaluationById(id);

  const supabase = createClient();
  const { data, error } = await supabase
    .from("evaluations")
    .select("id, payload, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return undefined;
  return rowToEvaluation(data as EvaluationRow) ?? undefined;
}

export async function saveEvaluation(evaluation: ClientEvaluation): Promise<ClientEvaluation> {
  if (getDemoModeSnapshot()) return demoStorage.saveEvaluation(evaluation);

  const supabase = createClient();
  const { error } = await supabase
    .from("evaluations")
    .insert({ id: evaluation.id, payload: toPayload(evaluation) });

  if (error) throw error;
  return evaluation;
}

export async function updateEvaluation(
  id: string,
  updates: Partial<Omit<ClientEvaluation, "id">>
): Promise<ClientEvaluation | undefined> {
  if (getDemoModeSnapshot()) return demoStorage.updateEvaluation(id, updates);

  const existing = await getEvaluationById(id);
  if (!existing) return undefined;

  const merged: ClientEvaluation = { ...existing, ...updates, id, updatedAt: nowISODate() };

  const supabase = createClient();
  const { data, error } = await supabase
    .from("evaluations")
    .update({ payload: toPayload(merged), updated_at: merged.updatedAt })
    .eq("id", id)
    .select("id, payload, created_at, updated_at")
    .single();

  if (error) throw error;
  return rowToEvaluation(data as EvaluationRow) ?? undefined;
}

export async function deleteEvaluation(id: string): Promise<boolean> {
  if (getDemoModeSnapshot()) return demoStorage.deleteEvaluation(id);

  const supabase = createClient();
  const { data, error } = await supabase.from("evaluations").delete().eq("id", id).select("id");

  if (error) throw error;
  return (data ?? []).length > 0;
}

export async function deleteEvaluations(ids: string[]): Promise<number> {
  if (getDemoModeSnapshot()) return demoStorage.deleteEvaluations(ids);

  const supabase = createClient();
  const { data, error } = await supabase.from("evaluations").delete().in("id", ids).select("id");

  if (error) throw error;
  return (data ?? []).length;
}

export async function archiveEvaluation(
  id: string,
  isArchived = true
): Promise<ClientEvaluation | undefined> {
  return updateEvaluation(id, { isArchived });
}

export async function duplicateEvaluation(id: string): Promise<ClientEvaluation | undefined> {
  if (getDemoModeSnapshot()) return demoStorage.duplicateEvaluation(id);

  const original = await getEvaluationById(id);
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
  await saveEvaluation(copy);
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

// --- Settings -------------------------------------------------------------
// Settings are shared regardless of demo mode (demo mode only swaps which
// evaluations are shown, not how the agency's scoring rules are configured),
// so there is no demo-mode branch here.

export async function getSettings(): Promise<AgencySettings> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("agency_settings")
    .select("payload")
    .maybeSingle();

  if (error) throw error;
  if (!data) return DEFAULT_SETTINGS;

  const validated = agencySettingsSchema.safeParse(data.payload);
  if (!validated.success) return DEFAULT_SETTINGS;
  return validated.data as AgencySettings;
}

export async function saveSettings(settings: AgencySettings): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum bulunamadı.");

  const { error } = await supabase
    .from("agency_settings")
    .upsert({ user_id: user.id, payload: settings, updated_at: nowISODate() });

  if (error) throw error;
}

export async function resetSettings(): Promise<AgencySettings> {
  await saveSettings(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

// --- Export / Import -------------------------------------------------------

export async function exportData(): Promise<ExportFormat> {
  const [settings, evaluations] = await Promise.all([getSettings(), getEvaluations()]);
  return {
    appVersion: APP_VERSION,
    exportedAt: nowISODate(),
    settings,
    evaluations,
  };
}

export async function importData(
  raw: string,
  mode: "merge" | "overwrite" = "merge"
): Promise<ImportResult> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
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

  if (getDemoModeSnapshot()) {
    const existing = mode === "overwrite" ? [] : demoStorage.getEvaluations();
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
    demoStorage.seedEvaluations(merged);
    return { success: true, importedCount, skippedCount: 0, duplicateCount, errors: [] };
  }

  const supabase = createClient();

  if (mode === "overwrite") {
    const { error: deleteError } = await supabase.from("evaluations").delete().not("id", "is", null);
    if (deleteError) throw deleteError;
    await saveSettings(validated.data.settings);
  }

  const existingIds = new Set(mode === "overwrite" ? [] : (await getEvaluations()).map((e) => e.id));

  let importedCount = 0;
  let duplicateCount = 0;
  const rowsToInsert: { id: string; payload: Record<string, unknown> }[] = [];

  for (const evaluation of incoming) {
    if (existingIds.has(evaluation.id)) {
      duplicateCount += 1;
      continue;
    }
    rowsToInsert.push({ id: evaluation.id, payload: toPayload(evaluation) });
    existingIds.add(evaluation.id);
    importedCount += 1;
  }

  if (rowsToInsert.length > 0) {
    const { error: insertError } = await supabase.from("evaluations").insert(rowsToInsert);
    if (insertError) throw insertError;
  }

  return {
    success: true,
    importedCount,
    skippedCount: 0,
    duplicateCount,
    errors: [],
  };
}
