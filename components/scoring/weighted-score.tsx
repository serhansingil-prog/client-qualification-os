import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DecisionThreshold } from "@/types/settings";

interface WeightedScoreProps {
  score: number;
  thresholds: DecisionThreshold[];
}

export function WeightedScore({ score, thresholds }: WeightedScoreProps) {
  const activeThreshold = [...thresholds]
    .sort((a, b) => b.minScore - a.minScore)
    .find((threshold) => score >= threshold.minScore);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Ağırlıklı Puan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold tracking-tight">{score}</span>
          <span className="text-sm text-muted-foreground">/ 100</span>
        </div>
        <Progress value={Math.max(0, Math.min(100, score))} className="mt-3" aria-label={`Ağırlıklı puan: ${score} / 100`} />
        {activeThreshold ? (
          <p className="mt-2 text-xs text-muted-foreground">
            {activeThreshold.label} bandı: {activeThreshold.minScore}-{activeThreshold.maxScore}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
