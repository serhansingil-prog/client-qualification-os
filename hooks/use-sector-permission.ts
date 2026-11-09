"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";
import { useProfile } from "@/hooks/use-profile";
import { isAdmin } from "@/lib/auth/roles";
import type { Sector } from "@/types/settings";

/**
 * No rows in user_sector_permissions means unrestricted — the user can pick
 * any of the 3 sectors, same as today's default behavior. Rows only appear
 * once an admin has deliberately restricted this specific account.
 *
 * Admin/moderator accounts always bypass this restriction, even if rows
 * happen to exist for them (e.g. left over from before a role promotion) —
 * consistent with how isAdmin()/role checks bypass everywhere else.
 */
export function useSectorPermission() {
  const { user, isLoaded: userLoaded } = useUser();
  const { role, isLoaded: roleLoaded } = useProfile();
  const [allowedSectors, setAllowedSectors] = useState<Sector[] | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!userLoaded || !roleLoaded) return;
    if (!user || role === "moderator" || isAdmin(role, user.email)) {
      // Syncing local state to "unrestricted" after auth/role resolve, not a
      // derived-from-props case — same pattern as ThemeToggle's mount sync.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAllowedSectors(null);
      setIsLoaded(true);
      return;
    }

    let cancelled = false;
    const supabase = createClient();
    supabase
      .from("user_sector_permissions")
      .select("sector")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (cancelled) return;
        const sectors = (data ?? []).map((row) => row.sector as Sector);
        setAllowedSectors(sectors.length > 0 ? sectors : null);
        setIsLoaded(true);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, userLoaded, role, roleLoaded]);

  return { allowedSectors, isLoaded };
}
