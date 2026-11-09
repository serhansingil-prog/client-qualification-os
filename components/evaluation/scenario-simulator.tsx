"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DecisionBadge } from "@/components/scoring/decision-badge";
import { simulateEvaluationChanges } from "@/lib/scoring";
import { updateEvaluation } from "@/lib/storage";
import { getCriteriaDefinitions } from "@/lib/criteria";
import type { ClientEvaluation } from "@/types/evaluation";
import type { AgencySettings, Sector } from "@/types/settings";
import type { SimulationChange } from "@/types/scoring";

const SIMULATION_OPTIONS: { criterionId: string; label: string }[] = [
  { criterionId: "budget_fit", label: "Bütçe yükselirse" },
  { criterionId: "timeline_realism", label: "Teslim tarihi uzatılırsa" },
  { criterionId: "maintenance_support_expectation", label: "Bakım paketi kabul edilirse" },
  { criterionId: "decision_maker_access", label: "Karar verici görüşmeye katılırsa" },
  { criterionId: "technical_data_readiness", label: "Teknik erişimler sağlanırsa" },
  { criterionId: "scope_clarity", label: "Kapsam netleşirse" },
  { criterionId: "internal_project_owner", label: "İç proje sahibi atanırsa" },
];

interface ScenarioSimulatorProps {
  evaluation: ClientEvaluation;
  settings: AgencySettings;
  sector: Sector;
}

export function ScenarioSimulator({ evaluation, settings, sector }: ScenarioSimulatorProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const changes: SimulationChange[] = useMemo(
    () =>
      Array.from(selected).map((criterionId) => ({
        criterionId,
        newStatus: "qualified" as const,
      })),
    [selected]
  );

  const simulation = useMemo(
    () => simulateEvaluationChanges(evaluation, changes, settings, getCriteriaDefinitions(sector)),
    [evaluation, changes, settings, sector]
  );

  function toggle(criterionId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(criterionId)) {
        next.delete(criterionId);
      } else {
        next.add(criterionId);
      }
      return next;
    });
  }

  async function applyChanges() {
    if (changes.length === 0) return;
    const nextAnswers = evaluation.answers.map((answer) => {
      const change = changes.find((c) => c.criterionId === answer.criterionId);
      return change ? { ...answer, status: change.newStatus } : answer;
    });
    try {
      await updateEvaluation(evaluation.id, { answers: nextAnswers });
      toast.success("Değişiklikler değerlendirmeye uygulandı.");
      router.refresh();
    } catch {
      toast.error("Değişiklikler uygulanamadı.");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Bu şart değişirse müşteri kabul edilebilir hale gelir mi?
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {SIMULATION_OPTIONS.map((option) => (
            <div key={option.criterionId} className="flex items-center gap-2 rounded-md border p-3">
              <Checkbox
                id={`sim-${option.criterionId}`}
                checked={selected.has(option.criterionId)}
                onCheckedChange={() => toggle(option.criterionId)}
              />
              <Label htmlFor={`sim-${option.criterionId}`} className="cursor-pointer font-normal">
                {option.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mevcut Durum ile Karşılaştırma</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border p-4">
              <p className="text-sm font-medium text-muted-foreground">Mevcut Durum</p>
              <p className="mt-2 text-2xl font-semibold">{simulation.currentStandardScore} / 10</p>
              <p className="text-sm text-muted-foreground">{simulation.currentWeightedScore} / 100</p>
              <div className="mt-2">
                <DecisionBadge decision={simulation.currentDecision} />
              </div>
            </div>
            <div className="rounded-md border border-primary/40 bg-primary/5 p-4">
              <p className="text-sm font-medium text-muted-foreground">Simüle Edilen Durum</p>
              <p className="mt-2 text-2xl font-semibold">{simulation.simulatedStandardScore} / 10</p>
              <p className="text-sm text-muted-foreground">{simulation.simulatedWeightedScore} / 100</p>
              <div className="mt-2">
                <DecisionBadge decision={simulation.simulatedDecision} />
              </div>
            </div>
          </div>

          {simulation.resolvedCriticalFailures.length > 0 ? (
            <div>
              <p className="mb-2 text-sm font-medium">Çözülen kritik riskler</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {simulation.resolvedCriticalFailures.map((failure) => (
                  <li key={failure.id} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
                    {failure.title}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {simulation.remainingCriticalFailures.length > 0 ? (
            <div>
              <p className="mb-2 text-sm font-medium">Devam eden kritik riskler</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {simulation.remainingCriticalFailures.map((failure) => (
                  <li key={failure.id}>{failure.title}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <Button onClick={applyChanges} disabled={changes.length === 0} className="gap-1.5">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            Bu değişiklikleri değerlendirmeye uygula
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
