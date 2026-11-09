"use client";

import { useSyncExternalStore } from "react";
import { getDemoSectorSnapshot, getServerSnapshot, subscribe } from "@/lib/demo-sector-store";

export function useDemoSector() {
  return useSyncExternalStore(subscribe, getDemoSectorSnapshot, getServerSnapshot);
}
