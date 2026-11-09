"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { QUALIFICATION_STATUS_COLOR_CLASSES, QUALIFICATION_STATUS_LABELS } from "@/lib/labels";
import { CriterionCard } from "@/components/evaluation/criterion-card";
import type { CriterionAnswer, CriterionCategory } from "@/types/evaluation";
import type { CriterionDefinition } from "@/types/scoring";
import type { Sector } from "@/types/settings";
import { getCriteriaDefinitions, CRITERION_CATEGORY_LABELS } from "@/lib/criteria";

interface CriterionStepProps {
  category: CriterionCategory;
  answers: CriterionAnswer[];
  onAnswerChange: (criterionId: string, patch: Partial<CriterionAnswer>) => void;
  sector: Sector;
}

export function CriterionStep({ category, answers, onAnswerChange, sector }: CriterionStepProps) {
  const criteria: CriterionDefinition[] = getCriteriaDefinitions(sector).filter((c) => c.category === category);

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        {CRITERION_CATEGORY_LABELS[category]} kapsamındaki {criteria.length} kriteri değerlendirin.
      </p>
      <Accordion multiple defaultValue={criteria.map((c) => c.id)} className="space-y-3">
        {criteria.map((criterion) => {
          const answer = answers.find((a) => a.criterionId === criterion.id);
          if (!answer) return null;
          return (
            <AccordionItem key={criterion.id} value={criterion.id} className="rounded-lg border px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-1 flex-wrap items-center justify-between gap-2 pr-2">
                  <span className="text-left font-medium">{criterion.name}</span>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      QUALIFICATION_STATUS_COLOR_CLASSES[answer.status]
                    )}
                  >
                    {QUALIFICATION_STATUS_LABELS[answer.status]}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <CriterionCard
                  criterion={criterion}
                  answer={answer}
                  onChange={(patch) => onAnswerChange(criterion.id, patch)}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
