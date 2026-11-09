"use client";

import type { Sector } from "@/types/settings";

const DEMO_SECTOR_STORAGE_KEY = "cqos_demo_sector";
const DEFAULT_SECTOR: Sector = "automation";
const VALID_SECTORS: Sector[] = ["automation", "ads", "real_estate"];

type Listener = () => void;

const listeners = new Set<Listener>();
let cachedSnapshot: Sector | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readFromStorage(): Sector {
  if (!isBrowser()) return DEFAULT_SECTOR;
  try {
    const raw = window.localStorage.getItem(DEMO_SECTOR_STORAGE_KEY);
    return VALID_SECTORS.includes(raw as Sector) ? (raw as Sector) : DEFAULT_SECTOR;
  } catch {
    return DEFAULT_SECTOR;
  }
}

/**
 * Remembers which sector's demo dataset was last loaded (separate from the
 * real account's AgencySettings.sector), so viewing/editing a demo-flagged
 * evaluation shows criteria wording matching the demo persona currently on
 * screen instead of the account's own real sector.
 */
export function getDemoSectorSnapshot(): Sector {
  if (cachedSnapshot === null) {
    cachedSnapshot = readFromStorage();
  }
  return cachedSnapshot;
}

export function getServerSnapshot(): Sector {
  return DEFAULT_SECTOR;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setDemoSectorValue(sector: Sector): void {
  if (isBrowser()) {
    try {
      window.localStorage.setItem(DEMO_SECTOR_STORAGE_KEY, sector);
    } catch {
      // ignore write failures (private browsing / quota)
    }
  }
  cachedSnapshot = sector;
  listeners.forEach((listener) => listener());
}
