"use client";

import { Button } from "@/components/ui/button";
import { DemoSectorMenu } from "@/components/dashboard/demo-sector-menu";
import { useUser } from "@/hooks/use-user";
import { useProfile } from "@/hooks/use-profile";
import { usePermissions } from "@/hooks/use-permissions";
import { useSectorPermission } from "@/hooks/use-sector-permission";
import { hasPermission } from "@/lib/auth/permissions";
import type { DemoSector } from "@/lib/sample-data";
import type { Sector } from "@/types/settings";

interface DemoLoadButtonProps {
  label: string;
  variant?: "default" | "outline";
  ownSector: Sector;
  onSelect: (sector: DemoSector) => void;
}

/**
 * Role-level "multi_sector_demo" (moderator/admin) unlocks all 3 sectors.
 * Below that, a per-user sector permission grant (admin panel's Sektör
 * picker) with 2+ allowed sectors unlocks a picker scoped to just those —
 * otherwise it's a plain button for the account's current sector.
 */
export function DemoLoadButton({ label, variant = "outline", ownSector, onSelect }: DemoLoadButtonProps) {
  const { user, isLoaded: userLoaded } = useUser();
  const { role, isLoaded: roleLoaded } = useProfile();
  const { matrix, isLoaded: permsLoaded } = usePermissions();
  const { allowedSectors, isLoaded: sectorPermsLoaded } = useSectorPermission();

  const buttonClassName =
    variant === "default" ? "gap-1.5 bg-accent-2 text-accent-2-foreground hover:bg-accent-2/90" : "gap-1.5";

  // Don't decide single-sector vs. multi-sector before everything relevant is
  // known — clicking mid-load could silently load the wrong (default) sector.
  if (!userLoaded || !roleLoaded || !permsLoaded || !sectorPermsLoaded) {
    return (
      <Button variant={variant} className={buttonClassName} disabled>
        {label}
      </Button>
    );
  }

  if (hasPermission(matrix, "multi_sector_demo", role, user?.email)) {
    return <DemoSectorMenu label={label} variant={variant} onSelect={onSelect} />;
  }

  if (allowedSectors && allowedSectors.length > 1) {
    return <DemoSectorMenu label={label} variant={variant} onSelect={onSelect} sectors={allowedSectors} />;
  }

  return (
    <Button variant={variant} className={buttonClassName} onClick={() => onSelect(ownSector)}>
      {label}
    </Button>
  );
}
