"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  DEFAULT_ROLE_PERMISSIONS,
  mergeWithDefaults,
  type RolePermissionMatrix,
} from "@/lib/auth/permissions";

export function usePermissions() {
  const [matrix, setMatrix] = useState<RolePermissionMatrix>(DEFAULT_ROLE_PERMISSIONS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase
      .from("role_permissions")
      .select("role, permission, enabled")
      .then(({ data }) => {
        if (cancelled) return;
        setMatrix(mergeWithDefaults(data ?? []));
        setIsLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { matrix, isLoaded };
}
