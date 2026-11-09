"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SECTOR_TECH_STACK_DEFAULTS, TECH_STACK_SECTION_LABELS } from "@/lib/criteria";
import type { AgencySettings } from "@/types/settings";

interface TechnologyStackFormProps {
  settings: AgencySettings;
  onChange: (patch: Partial<AgencySettings>) => void;
}

export function TechnologyStackForm({ settings, onChange }: TechnologyStackFormProps) {
  const [newTech, setNewTech] = useState("");
  const labels = TECH_STACK_SECTION_LABELS[settings.sector];
  const suggestions = SECTOR_TECH_STACK_DEFAULTS[settings.sector].filter(
    (item) => !settings.standardTechStack.includes(item)
  );

  function addTechValue(value: string) {
    if (!value || settings.standardTechStack.includes(value)) return;
    onChange({ standardTechStack: [...settings.standardTechStack, value] });
  }

  function addTech() {
    const value = newTech.trim();
    addTechValue(value);
    setNewTech("");
  }

  function removeTech(tech: string) {
    onChange({ standardTechStack: settings.standardTechStack.filter((t) => t !== tech) });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{labels.cardTitle}</CardTitle>
        <p className="text-sm text-muted-foreground">{labels.helperText}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {settings.standardTechStack.map((tech) => (
            <Badge key={tech} variant="secondary" className="gap-1 pr-1">
              {tech}
              <button
                type="button"
                onClick={() => removeTech(tech)}
                aria-label={labels.removeLabel(tech)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </Badge>
          ))}
          {settings.standardTechStack.length === 0 ? (
            <p className="text-sm text-muted-foreground">{labels.emptyText}</p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTech}
            onChange={(event) => setNewTech(event.target.value)}
            placeholder={labels.placeholder}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTech();
              }
            }}
          />
          <Button type="button" onClick={addTech}>
            Ekle
          </Button>
        </div>
        {suggestions.length > 0 ? (
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Önerilen</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => addTechValue(item)}
                  className="rounded-full border border-dashed px-2.5 py-0.5 text-xs text-muted-foreground hover:border-solid hover:bg-muted"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
