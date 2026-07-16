"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { EvaluationWizard } from "@/components/evaluation/evaluation-wizard";
import { useSettings } from "@/hooks/use-settings";
import { evaluationToDraft, type EvaluationDraft } from "@/lib/evaluation";
import { getEvaluationById } from "@/lib/storage";

export default function EditEvaluationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { settings, isLoaded: settingsLoaded } = useSettings();
  const [draft, setDraft] = useState<EvaluationDraft | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const evaluation = await getEvaluationById(id);
        if (!cancelled) setDraft(evaluation ? evaluationToDraft(evaluation) : null);
      } catch {
        if (!cancelled) setDraft(null);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div>
      <PageHeader
        title="Değerlendirmeyi Düzenle"
        description="Taslağa devam edin veya tamamlanmış bir değerlendirmeyi güncelleyin."
      />
      {draft === undefined || !settingsLoaded ? (
        <LoadingState rows={4} />
      ) : draft === null ? (
        <ErrorState
          title="Değerlendirme bulunamadı"
          description="Bu bağlantıya sahip bir değerlendirme bulunamadı. Silinmiş olabilir."
        />
      ) : (
        <EvaluationWizard initialDraft={draft} settings={settings} />
      )}
      {draft === null ? (
        <div className="mt-4">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/evaluations">Değerlendirmelere dön</Link>}
          />
        </div>
      ) : null}
    </div>
  );
}
