import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DecisionBadge } from "@/components/scoring/decision-badge";
import { formatDateShort } from "@/lib/dates";
import type { ClientEvaluation } from "@/types/evaluation";

interface RecentEvaluationsProps {
  evaluations: ClientEvaluation[];
}

export function RecentEvaluations({ evaluations }: RecentEvaluationsProps) {
  const recent = evaluations
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Son Değerlendirmeler</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henüz değerlendirme yok.</p>
        ) : (
          recent.map((evaluation) => (
            <Link
              key={evaluation.id}
              href={`/evaluations/${evaluation.id}`}
              className="flex items-center justify-between gap-3 rounded-md border p-3 transition-colors hover:bg-muted/40"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{evaluation.clientName}</p>
                  {evaluation.isDraft ? (
                    <span className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      Taslak
                    </span>
                  ) : null}
                </div>
                <p className="truncate text-sm text-muted-foreground">{evaluation.projectName}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm text-muted-foreground">{formatDateShort(evaluation.createdAt)}</span>
                {evaluation.isDraft ? null : <DecisionBadge decision={evaluation.decision} />}
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
