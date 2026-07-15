import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreCard } from "@/components/scoring/score-card";
import { WeightedScore } from "@/components/scoring/weighted-score";
import { DecisionBadge } from "@/components/scoring/decision-badge";
import { ConfidenceBadge } from "@/components/scoring/confidence-badge";
import { CriticalWarning } from "@/components/scoring/critical-warning";
import { StrengthsList } from "@/components/evaluation/strengths-list";
import { RiskList } from "@/components/evaluation/risk-list";
import { ImprovementConditions } from "@/components/evaluation/improvement-conditions";
import { getRecommendedNextAction } from "@/lib/evaluation";
import { CRITERIA_DEFINITIONS } from "@/lib/criteria";
import type { ClientEvaluation } from "@/types/evaluation";
import type { ScoringResult } from "@/types/scoring";
import type { AgencySettings } from "@/types/settings";

interface ResultSummaryProps {
  evaluation: Pick<ClientEvaluation, "clientName" | "projectName">;
  result: ScoringResult;
  decisionThresholds: AgencySettings["decisionThresholds"];
}

export function ResultSummary({ evaluation, result, decisionThresholds }: ResultSummaryProps) {
  const hasBlockingCriticalFailure = result.criticalFailures.some((f) => f.blocksApproval);
  const recommendedNextAction = getRecommendedNextAction(result.decision, hasBlockingCriticalFailure);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Genel Karar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <DecisionBadge decision={result.decision} />
            <ConfidenceBadge level={result.confidenceLevel} />
            <span className="text-sm text-muted-foreground">
              {result.evaluatedCriteriaCount}/{result.totalCriteriaCount ?? CRITERIA_DEFINITIONS.length} kriter
              değerlendirildi
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ScoreCard title="Standart Puan" score={result.standardScore} maxScore={10} />
            <WeightedScore score={result.weightedScore} thresholds={decisionThresholds} />
          </div>

          {result.criticalFailures.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Kritik Eleme Uyarıları</p>
              {result.criticalFailures.map((failure) => (
                <CriticalWarning key={failure.id} failure={failure} />
              ))}
            </div>
          ) : null}

          <div className="rounded-md bg-muted/40 p-3">
            <p className="text-sm font-medium">
              {evaluation.clientName} — {evaluation.projectName}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Önerilen sonraki adım: </span>
              {recommendedNextAction}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <StrengthsList strengths={result.strongestCriteria} />
        <RiskList
          weakestCriteria={result.weakestCriteria}
          criticalFailures={result.criticalFailures}
          improvementConditions={result.improvementConditions}
        />
      </div>

      <ImprovementConditions
        conditions={result.improvementConditions}
        currentWeightedScore={result.weightedScore}
      />
    </div>
  );
}
