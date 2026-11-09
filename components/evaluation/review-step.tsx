"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QUALIFICATION_STATUS_COLOR_CLASSES, QUALIFICATION_STATUS_LABELS } from "@/lib/labels";
import { getCriteriaDefinitions, CRITERION_CATEGORY_LABELS } from "@/lib/criteria";
import { isClientInformationComplete, type EvaluationDraft } from "@/lib/evaluation";
import type { CriterionCategory } from "@/types/evaluation";
import type { Sector } from "@/types/settings";
import { CheckCircle2, CircleAlert } from "lucide-react";

interface ReviewStepProps {
  draft: EvaluationDraft;
  onJumpToCategory: (category: CriterionCategory) => void;
  onJumpToClientInfo: () => void;
  sector: Sector;
}

const CATEGORY_ORDER: CriterionCategory[] = [
  "commercial",
  "operational",
  "technical",
  "relationship",
  "strategic",
];

export function ReviewStep({ draft, onJumpToCategory, onJumpToClientInfo, sector }: ReviewStepProps) {
  const clientInfoComplete = isClientInformationComplete(draft);
  const evaluatedCount = draft.answers.filter((a) => a.status !== "not_evaluated").length;
  const criteriaDefinitions = getCriteriaDefinitions(sector);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Müşteri Bilgileri</CardTitle>
          <Button variant="outline" size="sm" onClick={onJumpToClientInfo}>
            Düzenle
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            {clientInfoComplete ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
            ) : (
              <CircleAlert className="h-4 w-4 text-amber-600" aria-hidden="true" />
            )}
            <span>
              {clientInfoComplete
                ? "Zorunlu alanlar tamamlandı."
                : "Zorunlu alanlardan bazıları eksik: müşteri adı, proje adı, para birimi, ilk iletişim tarihi."}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Kriter Değerlendirme Durumu ({evaluatedCount}/{criteriaDefinitions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {CATEGORY_ORDER.map((category) => {
            const criteria = criteriaDefinitions.filter((c) => c.category === category);
            return (
              <div key={category}>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{CRITERION_CATEGORY_LABELS[category]}</h3>
                  <Button variant="ghost" size="sm" onClick={() => onJumpToCategory(category)}>
                    Düzenle
                  </Button>
                </div>
                <ul className="space-y-1.5">
                  {criteria.map((criterion) => {
                    const answer = draft.answers.find((a) => a.criterionId === criterion.id);
                    const status = answer?.status ?? "not_evaluated";
                    return (
                      <li key={criterion.id} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-muted-foreground">{criterion.name}</span>
                        <span
                          className={cn(
                            "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                            QUALIFICATION_STATUS_COLOR_CLASSES[status]
                          )}
                        >
                          {QUALIFICATION_STATUS_LABELS[status]}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
