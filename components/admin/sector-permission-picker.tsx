"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { setUserSectorPermissions } from "@/app/(app)/admin/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SECTOR_LABELS } from "@/lib/criteria";
import type { Sector } from "@/types/settings";

const SECTOR_OPTIONS: Sector[] = ["automation", "ads", "real_estate"];

interface SectorPermissionPickerProps {
  userId: string;
  allowedSectors: Sector[] | null;
  defaultSector: Sector | null;
}

export function SectorPermissionPicker({
  userId,
  allowedSectors,
  defaultSector: initialDefault,
}: SectorPermissionPickerProps) {
  const [checked, setChecked] = useState<Set<Sector>>(new Set(allowedSectors ?? []));
  const [defaultSector, setDefaultSector] = useState<Sector | null>(initialDefault);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // The popover stays mounted between opens, so its local checkbox/default
  // state doesn't auto-refresh from props after a save elsewhere resolves.
  // Re-sync from the latest server-confirmed props every time it's opened,
  // so stale clicks from a previous session can't leak into the next save.
  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setChecked(new Set(allowedSectors ?? []));
      setDefaultSector(initialDefault);
    }
    setOpen(nextOpen);
  }

  function toggle(sector: Sector) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(sector)) {
        next.delete(sector);
        if (defaultSector === sector) {
          const remaining = [...next][0] ?? null;
          setDefaultSector(remaining);
        }
      } else {
        next.add(sector);
        if (!defaultSector) setDefaultSector(sector);
      }
      return next;
    });
  }

  // All 3 checked is functionally identical to none checked (unrestricted) —
  // keep the DB canonical (0 rows = unrestricted) rather than allowing two
  // different representations of the same state.
  const isUnrestricted = checked.size === 0 || checked.size === SECTOR_OPTIONS.length;

  async function handleSave() {
    setSaving(true);
    if (isUnrestricted) {
      await setUserSectorPermissions(userId, [], null);
    } else {
      await setUserSectorPermissions(userId, [...checked], defaultSector);
    }
    setSaving(false);
    setOpen(false);
  }

  const triggerLabel = isUnrestricted
    ? "Sınırsız"
    : [...checked].map((sector) => SECTOR_LABELS[sector]).join(", ");

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="w-44 justify-between gap-1.5 font-normal">
            <span className="truncate">{triggerLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </Button>
        }
      />
      <PopoverContent align="start" className="w-64">
        <p className="text-xs text-muted-foreground">
          İşaretli sektörler bu kullanıcının çalışabileceği sektörlerdir. Hiçbiri işaretli değilse
          sınırsızdır (3 sektör arasında serbest geçiş).
        </p>
        <RadioGroup
          value={defaultSector ?? ""}
          onValueChange={(value) => value && setDefaultSector(value as Sector)}
          className="gap-2"
        >
          {SECTOR_OPTIONS.map((sector) => (
            <div key={sector} className="flex items-center gap-2.5">
              <Checkbox
                checked={checked.has(sector)}
                onCheckedChange={() => toggle(sector)}
                aria-label={`${SECTOR_LABELS[sector]} - dahil et`}
              />
              <Label className="flex-1 cursor-pointer font-normal" onClick={() => toggle(sector)}>
                {SECTOR_LABELS[sector]}
              </Label>
              <RadioGroupItem
                value={sector}
                disabled={!checked.has(sector)}
                aria-label={`${SECTOR_LABELS[sector]} - varsayılan yap`}
              />
            </div>
          ))}
        </RadioGroup>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">Sağdaki nokta = varsayılan</span>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            Kaydet
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
