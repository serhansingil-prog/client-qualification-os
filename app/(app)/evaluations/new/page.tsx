"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { EvaluationWizard } from "@/components/evaluation/evaluation-wizard";
import { useSettings } from "@/hooks/use-settings";
import { createEmptyDraft } from "@/lib/evaluation";
import { generateId } from "@/lib/storage";

export default function NewEvaluationPage() {
  const { settings, isLoaded } = useSettings();
  const [id] = useState(() => generateId());

  const initialDraft = useMemo(() => createEmptyDraft(settings, id), [settings, id]);

  return (
    <div>
      <PageHeader
        title="Yeni Müşteri Değerlendirmesi"
        description="Adım adım ilerleyerek müşteriyi 14 kriter üzerinden değerlendirin."
      />
      {isLoaded ? (
        <EvaluationWizard initialDraft={initialDraft} settings={settings} />
      ) : (
        <LoadingState rows={4} />
      )}
    </div>
  );
}
