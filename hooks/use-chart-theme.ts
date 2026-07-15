"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function useChartTheme(): "light" | "dark" {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Theme is unknown until mounted on the client; this is next-themes' documented hydration-safe pattern.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return "light";
  return resolvedTheme === "dark" ? "dark" : "light";
}
