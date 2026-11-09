"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DEMO_SECTORS, type DemoSector } from "@/lib/sample-data";

interface DemoSectorMenuProps {
  label: string;
  variant?: "default" | "outline";
  onSelect: (sector: DemoSector) => void;
  sectors?: DemoSector[];
}

export function DemoSectorMenu({ label, variant = "outline", onSelect, sectors }: DemoSectorMenuProps) {
  const options = sectors ? DEMO_SECTORS.filter((sector) => sectors.includes(sector.key)) : DEMO_SECTORS;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant={variant}
            className={variant === "default" ? "gap-1.5 bg-accent-2 text-accent-2-foreground hover:bg-accent-2/90" : "gap-1.5"}
          >
            {label}
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />
      <DropdownMenuContent align="start">
        {options.map((sector) => (
          <DropdownMenuItem
            key={sector.key}
            className="flex-col items-start gap-0.5"
            onClick={() => onSelect(sector.key)}
          >
            <span className="font-medium">{sector.label}</span>
            <span className="text-xs text-muted-foreground">{sector.description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
