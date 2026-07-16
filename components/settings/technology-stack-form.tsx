"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AgencySettings } from "@/types/settings";

interface TechnologyStackFormProps {
  settings: AgencySettings;
  onChange: (patch: Partial<AgencySettings>) => void;
}

export function TechnologyStackForm({ settings, onChange }: TechnologyStackFormProps) {
  const [newTech, setNewTech] = useState("");

  function addTech() {
    const value = newTech.trim();
    if (!value || settings.standardTechStack.includes(value)) return;
    onChange({ standardTechStack: [...settings.standardTechStack, value] });
    setNewTech("");
  }

  function removeTech(tech: string) {
    onChange({ standardTechStack: settings.standardTechStack.filter((t) => t !== tech) });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Standart Teknoloji Yığını</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {settings.standardTechStack.map((tech) => (
            <Badge key={tech} variant="secondary" className="gap-1 pr-1">
              {tech}
              <button
                type="button"
                onClick={() => removeTech(tech)}
                aria-label={`${tech} teknolojisini kaldır`}
                className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </Badge>
          ))}
          {settings.standardTechStack.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz teknoloji eklenmedi.</p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTech}
            onChange={(event) => setNewTech(event.target.value)}
            placeholder="Yeni teknoloji ekle"
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
      </CardContent>
    </Card>
  );
}
