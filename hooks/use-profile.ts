"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";
import type { UserRole } from "@/lib/auth/roles";

export function useProfile() {
  const { user, isLoaded: userLoaded } = useUser();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!userLoaded) return;
    if (!user) {
      // Syncing local role state to "no user" after auth resolves, not a
      // derived-from-props case — same pattern as ThemeToggle's mount sync.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRole(null);
      setIsLoaded(true);
      return;
    }

    let cancelled = false;
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (cancelled) return;
        setRole((data?.role as UserRole | undefined) ?? null);
        setIsLoaded(true);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, userLoaded]);

  return { role, isLoaded };
}
