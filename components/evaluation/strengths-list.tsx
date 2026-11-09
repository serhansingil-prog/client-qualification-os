import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCriterionByIdForSector } from "@/lib/criteria";
import type { CriterionResultSummary } from "@/types/scoring";
import type { Sector } from "@/types/settings";

interface StrengthsListProps {
  strengths: CriterionResultSummary[];
  sector: Sector;
}

export function StrengthsList({ strengths, sector }: StrengthsListProps) {
  if (strengths.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Güçlü Alanlar</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Henüz güçlü bir alan tespit edilmedi.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Güçlü Alanlar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {strengths.map((strength) => {
          const criterion = getCriterionByIdForSector(strength.criterionId, sector);
          return (
            <div key={strength.criterionId} className="rounded-md border p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{criterion?.name ?? strength.name}</span>
                <span className="text-sm text-muted-foreground">Puan: {strength.score}</span>
              </div>
              {criterion ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  Güçlü olma nedeni: {criterion.goodSigns.slice(0, 3).join(", ")}
                </p>
              ) : null}
              {strength.notes ? (
                <p className="mt-1 text-sm italic text-muted-foreground">Not: {strength.notes}</p>
              ) : null}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
