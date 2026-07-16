"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RISK_SEVERITY_COLOR_CLASSES, RISK_SEVERITY_LABELS } from "@/lib/labels";
import { cn } from "@/lib/utils";
import type { AgencySettings } from "@/types/settings";

interface CriticalRulesFormProps {
  settings: AgencySettings;
  onChange: (patch: Partial<AgencySettings>) => void;
}

export function CriticalRulesForm({ settings, onChange }: CriticalRulesFormProps) {
  function toggleRule(id: string, isActive: boolean) {
    onChange({
      criticalRules: settings.criticalRules.map((rule) =>
        rule.id === id ? { ...rule, isActive } : rule
      ),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Kritik Eleme Kuralları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {settings.criticalRules.map((rule) => (
          <div key={rule.id} className="flex items-start justify-between gap-4 rounded-md border p-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Label htmlFor={`rule-${rule.id}`} className="font-medium">
                  {rule.title}
                </Label>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-xs",
                    RISK_SEVERITY_COLOR_CLASSES[rule.severity]
                  )}
                >
                  {RISK_SEVERITY_LABELS[rule.severity]}
                </span>
                {rule.autoReject ? (
                  <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                    Otomatik ret oluşturur
                  </span>
                ) : null}
                {!rule.userOverridable ? (
                  <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                    Geçersiz kılınamaz
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{rule.description}</p>
            </div>
            <Switch
              id={`rule-${rule.id}`}
              checked={rule.isActive}
              onCheckedChange={(checked) => toggleRule(rule.id, checked)}
              aria-label={`${rule.title} kuralını ${rule.isActive ? "kapat" : "aç"}`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
