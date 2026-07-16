"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { QUALIFICATION_STATUS_LABELS } from "@/lib/labels";
import type { CriterionAnswer, QualificationStatus } from "@/types/evaluation";
import type { CriterionDefinition } from "@/types/scoring";

const STATUS_OPTIONS: QualificationStatus[] = ["qualified", "uncertain", "disqualified", "not_evaluated"];

interface CriterionCardProps {
  criterion: CriterionDefinition;
  answer: CriterionAnswer;
  onChange: (patch: Partial<CriterionAnswer>) => void;
}

export function CriterionCard({ criterion, answer, onChange }: CriterionCardProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="font-medium">{criterion.mainQuestion}</p>
        <p className="mt-1 text-sm text-muted-foreground">{criterion.shortDescription}</p>
        {criterion.helpText ? (
          <p className="mt-1 text-xs text-muted-foreground italic">{criterion.helpText}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border bg-muted/20 p-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" aria-hidden="true" />
            İyi işaretler
          </p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {criterion.goodSigns.map((sign) => (
              <li key={sign}>• {sign}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border bg-muted/20 p-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
            <XCircle className="h-3.5 w-3.5 text-red-600" aria-hidden="true" />
            Kırmızı bayraklar
          </p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {criterion.redFlags.map((flag) => (
              <li key={flag}>• {flag}</li>
            ))}
          </ul>
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Puan seçimi</legend>
        <RadioGroup
          value={answer.status}
          onValueChange={(value) => onChange({ status: value as QualificationStatus })}
          className="grid gap-2 sm:grid-cols-2"
        >
          {STATUS_OPTIONS.map((status) => (
            <div key={status} className="flex items-center gap-2 rounded-md border p-2">
              <RadioGroupItem value={status} id={`${criterion.id}-${status}`} />
              <Label htmlFor={`${criterion.id}-${status}`} className="cursor-pointer font-normal">
                {QUALIFICATION_STATUS_LABELS[status]}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${criterion.id}-notes`}>Not alanı</Label>
          <Textarea
            id={`${criterion.id}-notes`}
            rows={2}
            value={answer.notes}
            onChange={(event) => onChange({ notes: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${criterion.id}-evidence`}>Kanıt veya gözlem</Label>
          <Textarea
            id={`${criterion.id}-evidence`}
            rows={2}
            value={answer.evidence ?? ""}
            onChange={(event) => onChange({ evidence: event.target.value })}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`${criterion.id}-followup`}>Takip sorusu</Label>
          <Input
            id={`${criterion.id}-followup`}
            value={answer.followUpQuestion ?? ""}
            onChange={(event) => onChange({ followUpQuestion: event.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id={`${criterion.id}-critical`}
          checked={answer.isCriticalRisk}
          onCheckedChange={(checked) => onChange({ isCriticalRisk: checked === true })}
        />
        <Label htmlFor={`${criterion.id}-critical`} className="cursor-pointer font-normal">
          Bu kriteri kritik risk olarak işaretle
        </Label>
      </div>
    </div>
  );
}
