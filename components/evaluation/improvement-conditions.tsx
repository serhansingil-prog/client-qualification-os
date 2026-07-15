import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ImprovementCondition } from "@/types/scoring";

interface ImprovementConditionsProps {
  conditions: ImprovementCondition[];
  currentWeightedScore: number;
}

export function ImprovementConditions({ conditions, currentWeightedScore }: ImprovementConditionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Kararı Değiştirecek Koşullar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {conditions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Şu anda önerilebilecek ek bir iyileştirme koşulu yok.
          </p>
        ) : (
          conditions.map((condition) => (
            <div
              key={condition.id}
              className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm">{condition.description}</p>
              <div className="flex shrink-0 items-center gap-2 text-sm font-medium">
                <span className="text-muted-foreground">{currentWeightedScore}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-green-700 dark:text-green-400">
                  {condition.estimatedNewWeightedScore}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
