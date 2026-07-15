"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ClientInformationStep,
  type ClientInformationStepHandle,
} from "@/components/evaluation/client-information-step";
import { CriterionStep } from "@/components/evaluation/criterion-step";
import { ReviewStep } from "@/components/evaluation/review-step";
import { ResultSummary } from "@/components/evaluation/result-summary";
import {
  computeTimelineStatus,
  draftToEvaluation,
  type EvaluationDraft,
} from "@/lib/evaluation";
import { calculateEvaluationResult } from "@/lib/scoring";
import { getEvaluationById, saveEvaluation, updateEvaluation } from "@/lib/storage";
import type { ClientInformationFormValues } from "@/lib/validation";
import type { CriterionAnswer, CriterionCategory } from "@/types/evaluation";
import type { AgencySettings } from "@/types/settings";

interface WizardStep {
  id: string;
  label: string;
  category?: CriterionCategory;
}

const STEPS: WizardStep[] = [
  { id: "client-info", label: "Müşteri bilgileri" },
  { id: "commercial", label: "Ticari uygunluk", category: "commercial" },
  { id: "operational", label: "Operasyonel uygunluk", category: "operational" },
  { id: "technical", label: "Teknik hazırlık", category: "technical" },
  { id: "relationship", label: "Çalışma ilişkisi", category: "relationship" },
  { id: "strategic", label: "Stratejik uyum", category: "strategic" },
  { id: "review", label: "Genel kontrol" },
  { id: "result", label: "Sonuç" },
];

interface EvaluationWizardProps {
  initialDraft: EvaluationDraft;
  settings: AgencySettings;
}

export function EvaluationWizard({ initialDraft, settings }: EvaluationWizardProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<EvaluationDraft>(initialDraft);
  const [stepIndex, setStepIndex] = useState(0);
  const clientInfoRef = useRef<ClientInformationStepHandle>(null);

  const currentStep = STEPS[stepIndex];

  const scoringResult = useMemo(
    () => calculateEvaluationResult(draft, settings),
    [draft, settings]
  );

  function persist(finalize: boolean) {
    const evaluation = draftToEvaluation({ ...draft, isDraft: !finalize }, settings);
    const existing = getEvaluationById(evaluation.id);
    if (existing) {
      updateEvaluation(evaluation.id, evaluation);
    } else {
      saveEvaluation(evaluation);
    }
    return evaluation;
  }

  function handleClientInfoChange(values: ClientInformationFormValues) {
    setDraft((prev) => {
      const timelineStatus = computeTimelineStatus(values.inquiryDate, values.requestedDeliveryDate);
      const answers = prev.answers.map((answer) =>
        answer.criterionId === "timeline_realism"
          ? { ...answer, status: timelineStatus, score: timelineStatus === "not_evaluated" ? null : answer.score }
          : answer
      );
      return { ...prev, ...values, answers };
    });
  }

  function handleAnswerChange(criterionId: string, patch: Partial<CriterionAnswer>) {
    setDraft((prev) => ({
      ...prev,
      answers: prev.answers.map((answer) =>
        answer.criterionId === criterionId ? { ...answer, ...patch } : answer
      ),
    }));
  }

  async function goNext() {
    if (currentStep.id === "client-info") {
      const values = await clientInfoRef.current?.validateAndSubmit();
      if (!values) {
        toast.error("Devam etmeden önce zorunlu alanları doldurun.");
        return;
      }
      setDraft((prev) => ({ ...prev, ...values }));
    }

    persist(false);

    if (stepIndex < STEPS.length - 1) {
      setStepIndex((index) => index + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goPrevious() {
    if (stepIndex > 0) {
      setStepIndex((index) => index - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goToCategory(category: CriterionCategory) {
    const index = STEPS.findIndex((step) => step.category === category);
    if (index >= 0) {
      setStepIndex(index);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleSaveDraft() {
    persist(false);
    toast.success("Taslak kaydedildi.");
    router.push("/evaluations");
  }

  function handleComplete() {
    const evaluation = persist(true);
    toast.success("Değerlendirme tamamlandı.");
    router.push(`/evaluations/${evaluation.id}`);
  }

  const progressPercentage = ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Adım {stepIndex + 1} / {STEPS.length}: {currentStep.label}
          </span>
          <Button variant="ghost" size="sm" onClick={handleSaveDraft} className="gap-1.5">
            <Save className="h-4 w-4" aria-hidden="true" />
            Taslağı Kaydet
          </Button>
        </div>
        <Progress value={progressPercentage} aria-label={`İlerleme: ${Math.round(progressPercentage)}%`} />
      </div>

      <div className="mb-8">
        {currentStep.id === "client-info" ? (
          <ClientInformationStep
            ref={clientInfoRef}
            defaultValues={draft}
            onChange={handleClientInfoChange}
          />
        ) : null}

        {currentStep.category ? (
          <CriterionStep
            category={currentStep.category}
            answers={draft.answers}
            onAnswerChange={handleAnswerChange}
          />
        ) : null}

        {currentStep.id === "review" ? (
          <ReviewStep
            draft={draft}
            onJumpToCategory={goToCategory}
            onJumpToClientInfo={() => setStepIndex(0)}
          />
        ) : null}

        {currentStep.id === "result" ? (
          <ResultSummary
            evaluation={draft}
            result={scoringResult}
            decisionThresholds={settings.decisionThresholds}
          />
        ) : null}
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <Button variant="outline" onClick={goPrevious} disabled={stepIndex === 0} className="gap-1.5">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Önceki
        </Button>
        {currentStep.id === "result" ? (
          <Button onClick={handleComplete}>Değerlendirmeyi Tamamla</Button>
        ) : (
          <Button onClick={goNext} className="gap-1.5">
            Sonraki
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
