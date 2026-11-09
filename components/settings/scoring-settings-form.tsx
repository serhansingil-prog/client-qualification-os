"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCriteriaDefinitions } from "@/lib/criteria";
import { DECISION_LABELS } from "@/lib/labels";
import type { AgencySettings } from "@/types/settings";

interface ScoringSettingsFormProps {
  settings: AgencySettings;
  onChange: (patch: Partial<AgencySettings>) => void;
}

export function ScoringSettingsForm({ settings, onChange }: ScoringSettingsFormProps) {
  function updateWeight(criterionId: string, weight: number) {
    onChange({
      criterionWeights: { ...settings.criterionWeights, [criterionId]: weight },
    });
  }

  function updateThreshold(decision: string, field: "minScore" | "maxScore", value: number) {
    onChange({
      decisionThresholds: settings.decisionThresholds.map((threshold) =>
        threshold.decision === decision ? { ...threshold, [field]: value } : threshold
      ),
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bütçe ve Süre Eşikleri</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="minProjectBudget">Minimum proje bütçesi</Label>
            <Input
              id="minProjectBudget"
              type="number"
              min={0}
              value={settings.minProjectBudget}
              onChange={(event) => onChange({ minProjectBudget: Number(event.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minSetupAndSupportBudget">Minimum kurulum ve destek bütçesi</Label>
            <Input
              id="minSetupAndSupportBudget"
              type="number"
              min={0}
              value={settings.minSetupAndSupportBudget}
              onChange={(event) =>
                onChange({ minSetupAndSupportBudget: Number(event.target.value) || 0 })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minMonthlyRetainer">Minimum aylık destek bedeli</Label>
            <Input
              id="minMonthlyRetainer"
              type="number"
              min={0}
              value={settings.minMonthlyRetainer}
              onChange={(event) => onChange({ minMonthlyRetainer: Number(event.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minTimelineDays">Standart minimum teslim süresi (gün)</Label>
            <Input
              id="minTimelineDays"
              type="number"
              min={0}
              value={settings.minTimelineDays}
              onChange={(event) => onChange({ minTimelineDays: Number(event.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="acceptanceScore">Kabul puanı (ağırlıklı, 100 üzerinden)</Label>
            <Input
              id="acceptanceScore"
              type="number"
              min={0}
              max={100}
              value={settings.acceptanceScore}
              onChange={(event) => onChange({ acceptanceScore: Number(event.target.value) || 0 })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kriter Ağırlıkları</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {getCriteriaDefinitions(settings.sector).map((criterion) => (
            <div key={criterion.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
              <Label htmlFor={`weight-${criterion.id}`} className="font-normal">
                {criterion.name}
              </Label>
              <Input
                id={`weight-${criterion.id}`}
                type="number"
                min={0.5}
                step={0.5}
                className="w-20"
                value={settings.criterionWeights[criterion.id] ?? criterion.weight}
                onChange={(event) => updateWeight(criterion.id, Number(event.target.value) || 1)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Karar Eşikleri (Ağırlıklı Puan)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {settings.decisionThresholds.map((threshold) => (
            <div key={threshold.decision} className="flex items-center gap-3 rounded-md border p-3">
              <span className="w-40 shrink-0 text-sm font-medium">
                {DECISION_LABELS[threshold.decision]}
              </span>
              <Label htmlFor={`min-${threshold.decision}`} className="sr-only">
                Minimum
              </Label>
              <Input
                id={`min-${threshold.decision}`}
                type="number"
                min={0}
                max={100}
                className="w-24"
                value={threshold.minScore}
                onChange={(event) =>
                  updateThreshold(threshold.decision, "minScore", Number(event.target.value) || 0)
                }
              />
              <span className="text-sm text-muted-foreground">-</span>
              <Label htmlFor={`max-${threshold.decision}`} className="sr-only">
                Maksimum
              </Label>
              <Input
                id={`max-${threshold.decision}`}
                type="number"
                min={0}
                max={100}
                className="w-24"
                value={threshold.maxScore}
                onChange={(event) =>
                  updateThreshold(threshold.decision, "maxScore", Number(event.target.value) || 0)
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
