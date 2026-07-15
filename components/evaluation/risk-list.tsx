import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RISK_SEVERITY_COLOR_CLASSES, RISK_SEVERITY_LABELS } from "@/lib/labels";
import { getCriterionById } from "@/lib/criteria";
import type { CriticalFailure, RiskSeverity } from "@/types/evaluation";
import type { CriterionResultSummary, ImprovementCondition } from "@/types/scoring";

interface RiskItem {
  id: string;
  severity: RiskSeverity;
  criterionName: string;
  description: string;
  impact: string;
  resolution: string;
}

interface RiskListProps {
  weakestCriteria: CriterionResultSummary[];
  criticalFailures: CriticalFailure[];
  improvementConditions: ImprovementCondition[];
}

const SEVERITY_ORDER: RiskSeverity[] = ["critical", "high", "medium", "low"];

function resolutionFor(criterionId: string | undefined, improvementConditions: ImprovementCondition[]): string {
  const match = improvementConditions.find((condition) => condition.relatedCriterionId === criterionId);
  if (match) return match.description;
  return "Teklif göndermeden önce müşteriyle bu konuyu netleştirin.";
}

export function RiskList({ weakestCriteria, criticalFailures, improvementConditions }: RiskListProps) {
  const criticalItems: RiskItem[] = criticalFailures.map((failure) => ({
    id: failure.id,
    severity: failure.severity,
    criterionName: getCriterionById(failure.criterionId ?? "")?.name ?? "Genel",
    description: failure.description,
    impact: failure.blocksApproval
      ? "Bu risk çözülmeden proje onaylanmamalı."
      : "Bu risk çözülmezse proje kalitesi veya karlılığı etkilenebilir.",
    resolution: resolutionFor(failure.criterionId, improvementConditions),
  }));

  const criticalCriterionIds = new Set(criticalFailures.map((f) => f.criterionId).filter(Boolean));
  const weakItems: RiskItem[] = weakestCriteria
    .filter((c) => (c.score ?? 1) < 1 && !criticalCriterionIds.has(c.criterionId))
    .map((c) => {
      const criterion = getCriterionById(c.criterionId);
      return {
        id: `weak_${c.criterionId}`,
        severity: (c.score ?? 0) === 0 ? "high" : ("medium" as RiskSeverity),
        criterionName: c.name,
        description: criterion?.redFlags[0] ?? "Bu kriterde belirsizlik var.",
        impact: "Netleşmeden ilerlenirse kapsam veya beklenti uyuşmazlığı yaşanabilir.",
        resolution: resolutionFor(c.criterionId, improvementConditions),
      };
    });

  const items = [...criticalItems, ...weakItems].sort(
    (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Riskler</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belirgin bir risk tespit edilmedi.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-md border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                    RISK_SEVERITY_COLOR_CLASSES[item.severity]
                  )}
                >
                  {RISK_SEVERITY_LABELS[item.severity]}
                </span>
                <span className="font-medium">{item.criterionName}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              <p className="mt-1 text-sm">
                <span className="font-medium">Olası etkisi: </span>
                {item.impact}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium">Önerilen çözüm: </span>
                {item.resolution}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
