"use client";

import { FlaskConical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDemoMode } from "@/hooks/use-demo-mode";

export function DemoModeToggle() {
  const { demoMode, isLoaded, setDemoMode } = useDemoMode();

  return (
    <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
      <Label htmlFor="demo-mode-toggle" className="flex cursor-pointer items-center gap-2 font-normal">
        <FlaskConical className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        Demo Modu
      </Label>
      <Switch
        id="demo-mode-toggle"
        checked={demoMode}
        disabled={!isLoaded}
        onCheckedChange={setDemoMode}
        aria-label={demoMode ? "Demo modunu kapat" : "Demo modunu aç"}
      />
    </div>
  );
}
