"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { getSettings, resetSettings as resetSettingsInStorage, saveSettings } from "@/lib/storage";
import type { AgencySettings } from "@/types/settings";

export function useSettings() {
  const [settings, setSettings] = useState<AgencySettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // localStorage is unavailable during SSR; load it after mount to avoid hydration mismatches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(getSettings());
    setIsLoaded(true);
  }, []);

  const updateSettings = useCallback((next: AgencySettings) => {
    saveSettings(next);
    setSettings(next);
  }, []);

  const resetSettings = useCallback(() => {
    const defaults = resetSettingsInStorage();
    setSettings(defaults);
    return defaults;
  }, []);

  return { settings, isLoaded, updateSettings, resetSettings };
}
