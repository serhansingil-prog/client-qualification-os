"use client";

import { DEMO_MODE_STORAGE_KEY } from "@/lib/constants";

type Listener = () => void;

const listeners = new Set<Listener>();
let cachedSnapshot: boolean | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readFromStorage(): boolean {
  if (!isBrowser()) return false;
  try {
    return window.localStorage.getItem(DEMO_MODE_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Shared client-side store for demo mode, backed by localStorage.
 * useSyncExternalStore keeps every consumer (sidebar, mobile menu, dashboard,
 * evaluations list, detail page) in sync even though they mount at different
 * times — a plain per-component useState+useEffect would each read
 * localStorage once on their own mount and go stale after that.
 */
export function getDemoModeSnapshot(): boolean {
  if (cachedSnapshot === null) {
    cachedSnapshot = readFromStorage();
  }
  return cachedSnapshot;
}

export function getServerSnapshot(): boolean {
  return false;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setDemoModeValue(value: boolean): void {
  if (isBrowser()) {
    try {
      window.localStorage.setItem(DEMO_MODE_STORAGE_KEY, value ? "true" : "false");
    } catch {
      // ignore write failures (private browsing / quota)
    }
  }
  cachedSnapshot = value;
  listeners.forEach((listener) => listener());
}
