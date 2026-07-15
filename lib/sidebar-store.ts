"use client";

import { SIDEBAR_OPEN_STORAGE_KEY } from "@/lib/constants";

type Listener = () => void;

const listeners = new Set<Listener>();
let cachedSnapshot: boolean | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readFromStorage(): boolean {
  if (!isBrowser()) return true;
  try {
    const raw = window.localStorage.getItem(SIDEBAR_OPEN_STORAGE_KEY);
    return raw === null ? true : raw === "true";
  } catch {
    return true;
  }
}

/**
 * Shared client-side store for the desktop sidebar's open/closed state,
 * backed by localStorage. Same useSyncExternalStore pattern as
 * lib/demo-mode-store.ts, since both the header (toggle button) and the
 * sidebar itself (hidden/visible) need to stay in sync.
 */
export function getSidebarOpenSnapshot(): boolean {
  if (cachedSnapshot === null) {
    cachedSnapshot = readFromStorage();
  }
  return cachedSnapshot;
}

export function getServerSnapshot(): boolean {
  return true;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setSidebarOpenValue(value: boolean): void {
  if (isBrowser()) {
    try {
      window.localStorage.setItem(SIDEBAR_OPEN_STORAGE_KEY, value ? "true" : "false");
    } catch {
      // ignore write failures (private browsing / quota)
    }
  }
  cachedSnapshot = value;
  listeners.forEach((listener) => listener());
}
