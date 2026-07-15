"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getDemoModeSnapshot, getServerSnapshot, setDemoModeValue, subscribe } from "@/lib/demo-mode-store";

export function useDemoMode() {
  const demoMode = useSyncExternalStore(subscribe, getDemoModeSnapshot, getServerSnapshot);

  const setDemoMode = useCallback((enabled: boolean) => {
    setDemoModeValue(enabled);
  }, []);

  return { demoMode, isLoaded: true, setDemoMode };
}
