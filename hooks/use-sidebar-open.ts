"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getSidebarOpenSnapshot,
  setSidebarOpenValue,
  subscribe,
} from "@/lib/sidebar-store";

export function useSidebarOpen() {
  const isOpen = useSyncExternalStore(subscribe, getSidebarOpenSnapshot, getServerSnapshot);

  const setIsOpen = useCallback((value: boolean) => {
    setSidebarOpenValue(value);
  }, []);

  const toggle = useCallback(() => {
    setSidebarOpenValue(!getSidebarOpenSnapshot());
  }, []);

  return { isOpen, setIsOpen, toggle };
}
