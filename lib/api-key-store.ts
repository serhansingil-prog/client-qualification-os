"use client";

import { ANTHROPIC_API_KEY_STORAGE_KEY } from "@/lib/constants";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function storageKey(userId: string): string {
  return `${ANTHROPIC_API_KEY_STORAGE_KEY}_${userId}`;
}

/**
 * BYOK Anthropic key, namespaced per Supabase user id — switching accounts
 * in the same browser never reads or overwrites another account's key.
 * Lives only in this browser's localStorage; never sent to Supabase, only
 * forwarded per-request to the insights/voice-summary routes and discarded
 * there.
 */
export function getApiKey(userId: string): string {
  if (!isBrowser()) return "";
  try {
    const namespaced = window.localStorage.getItem(storageKey(userId));
    if (namespaced !== null) return namespaced;

    // One-time migration from the old, non-namespaced key so whoever set
    // it up before per-account scoping existed doesn't lose it silently.
    const legacy = window.localStorage.getItem(ANTHROPIC_API_KEY_STORAGE_KEY);
    if (legacy !== null) {
      window.localStorage.setItem(storageKey(userId), legacy);
      window.localStorage.removeItem(ANTHROPIC_API_KEY_STORAGE_KEY);
      return legacy;
    }

    return "";
  } catch {
    return "";
  }
}

export function setApiKey(userId: string, value: string): void {
  if (!isBrowser()) return;
  try {
    if (value) {
      window.localStorage.setItem(storageKey(userId), value);
    } else {
      window.localStorage.removeItem(storageKey(userId));
    }
  } catch {
    // ignore write failures (private browsing / quota)
  }
}
