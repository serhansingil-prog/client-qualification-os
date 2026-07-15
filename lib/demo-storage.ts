import { DEMO_EVALUATIONS_STORAGE_KEY } from "@/lib/constants";
import { nowISODate } from "@/lib/dates";
import { generateId } from "@/lib/ids";
import { clientEvaluationSchema } from "@/lib/validation";
import type { ClientEvaluation } from "@/types/evaluation";

// Demo mode never touches Supabase — it's a client-side-only sandbox for
// exploring the app with sample data, kept fully separate from real user
// data. This module is the localStorage CRUD logic lib/storage.ts used to
// have before the Supabase migration, relocated verbatim and pointed at its
// own storage key so it can never collide with real evaluations.

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

export function getEvaluations(): ClientEvaluation[] {
  const raw = readRaw(DEMO_EVALUATIONS_STORAGE_KEY);
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
  return evaluations;
}

function persistEvaluations(evaluations: ClientEvaluation[]): void {
  writeRaw(DEMO_EVALUATIONS_STORAGE_KEY, JSON.stringify(evaluations));
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
    createdAt: now,
    updatedAt: now,
  };
  saveEvaluation(copy);
  return copy;
}

export function seedEvaluations(demoEvaluations: ClientEvaluation[]): void {
  persistEvaluations(demoEvaluations);
}
