"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { getSettings, resetSettings as resetSettingsInStorage, saveSettings } from "@/lib/storage";
import type { AgencySettings } from "@/types/settings";

export function useSettings() {
  const [settings, setSettings] = useState<AgencySettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getSettings();
        if (!cancelled) setSettings(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Ayarlar yüklenemedi.");
        }
      } finally {
        if (!cancelled) setIsLoaded(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = useCallback(async (next: AgencySettings) => {
    await saveSettings(next);
    setSettings(next);
  }, []);

  const resetSettings = useCallback(async () => {
    const defaults = await resetSettingsInStorage();
    setSettings(defaults);
    return defaults;
  }, []);

  return { settings, isLoaded, error, updateSettings, resetSettings };
}
