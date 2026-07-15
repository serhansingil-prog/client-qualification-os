"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ClipboardList, PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  EvaluationFilters,
  DEFAULT_FILTERS,
  type EvaluationFiltersState,
} from "@/components/history/evaluation-filters";
import { EvaluationTable } from "@/components/history/evaluation-table";
import { EvaluationActions } from "@/components/history/evaluation-actions";
import { DemoModeBanner } from "@/components/shared/demo-mode-banner";
import { useEvaluations } from "@/hooks/use-evaluations";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { useSettings } from "@/hooks/use-settings";
import { activateDemoDataset } from "@/lib/sample-data";

export default function EvaluationsPage() {
  const {
    evaluations: allEvaluations,
    isLoaded: evaluationsLoaded,
    refresh,
    remove,
    removeMany,
    archive,
    duplicate,
  } = useEvaluations();
  const { demoMode, isLoaded: demoModeLoaded } = useDemoMode();
  const { settings, isLoaded: settingsLoaded } = useSettings();
  const isLoaded = evaluationsLoaded && demoModeLoaded && settingsLoaded;
  const evaluations = useMemo(
    () => allEvaluations.filter((evaluation) => Boolean(evaluation.isDemo) === demoMode),
    [allEvaluations, demoMode]
  );
  const [filters, setFilters] = useState<EvaluationFiltersState>(DEFAULT_FILTERS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const industries = useMemo(() => {
    const set = new Set<string>();
    evaluations.forEach((evaluation) => {
      if (evaluation.industry) set.add(evaluation.industry);
    });
    return Array.from(set).sort();
  }, [evaluations]);

  const filteredEvaluations = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    let result = evaluations.filter((evaluation) => {
      if (!filters.includeArchived && evaluation.isArchived) return false;
      if (
        search &&
        !`${evaluation.clientName} ${evaluation.companyName ?? ""} ${evaluation.projectName}`
          .toLowerCase()
          .includes(search)
      ) {
        return false;
      }
      if (filters.industry !== "all" && evaluation.industry !== filters.industry) return false;
      if (filters.decision !== "all" && evaluation.decision !== filters.decision) return false;
      if (filters.leadSource !== "all" && evaluation.leadSource !== filters.leadSource) return false;
      if (filters.salesStage !== "all" && evaluation.salesStage !== filters.salesStage) return false;
      if (filters.onlyCritical && evaluation.criticalFailures.length === 0) return false;
      return true;
    });

    result = result.slice().sort((a, b) => {
      let diff = 0;
      switch (filters.sortField) {
        case "date":
          diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "standardScore":
          diff = a.standardScore - b.standardScore;
          break;
        case "weightedScore":
          diff = a.weightedScore - b.weightedScore;
          break;
        case "budget":
          diff = (a.estimatedBudget ?? 0) - (b.estimatedBudget ?? 0);
          break;
      }
      return filters.sortDirection === "asc" ? diff : -diff;
    });

    return result;
  }, [evaluations, filters]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleSelectAll() {
    setSelectedIds((prev) =>
      prev.length === filteredEvaluations.length ? [] : filteredEvaluations.map((e) => e.id)
    );
  }

  if (!isLoaded) {
    return (
      <div>
        <PageHeader title="Değerlendirmeler" />
        <LoadingState rows={5} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Değerlendirmeler"
        description="Tüm müşteri değerlendirmelerinizi arayın, filtreleyin ve yönetin."
        actions={
          <Button
            className="gap-1.5"
            nativeButton={false}
            render={
              <Link href="/evaluations/new">
                <PlusCircle className="h-4 w-4" aria-hidden="true" />
                Yeni Değerlendirme
              </Link>
            }
          />
        }
      />

      {demoMode ? <DemoModeBanner /> : null}

      {evaluations.length === 0 ? (
        demoMode ? (
          <EmptyState
            icon={ClipboardList}
            title="Demo verisi henüz yüklenmedi"
            description="Karar seviyesi başına birer örnek olacak şekilde 5 demo değerlendirmesi yükleyin."
            actions={
              <Button
                onClick={() => {
                  activateDemoDataset(settings);
                  refresh();
                  toast.success("5 örnek demo değerlendirmesi yüklendi.");
                }}
              >
                Örnek değerlendirmeleri yükle
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="Henüz değerlendirme yok"
            description="İlk müşteri değerlendirmenizi oluşturarak başlayın."
            actions={
              <Button
                nativeButton={false}
                render={<Link href="/evaluations/new">Yeni değerlendirme oluştur</Link>}
              />
            }
          />
        )
      ) : (
        <>
          <EvaluationFilters filters={filters} industries={industries} onChange={setFilters} />
          <EvaluationActions
            evaluations={filteredEvaluations}
            selectedIds={selectedIds}
            onBulkDelete={(ids) => {
              const count = removeMany(ids);
              setSelectedIds([]);
              toast.success(`${count} değerlendirme silindi.`);
            }}
            onImported={refresh}
          />
          {filteredEvaluations.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="Sonuç bulunamadı"
              description="Filtrelerinize uyan bir değerlendirme yok. Filtreleri temizlemeyi deneyin."
            />
          ) : (
            <EvaluationTable
              evaluations={filteredEvaluations}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              onDelete={setDeleteTargetId}
              onArchive={(id, isArchived) => {
                archive(id, isArchived);
                toast.success(isArchived ? "Arşivlendi." : "Arşivden çıkarıldı.");
              }}
              onDuplicate={(id) => {
                duplicate(id);
                toast.success("Değerlendirme kopyalandı.");
              }}
            />
          )}
        </>
      )}

      <ConfirmDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Değerlendirmeyi sil"
        description="Bu değerlendirmeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmLabel="Sil"
        onConfirm={() => {
          if (deleteTargetId) {
            remove(deleteTargetId);
            toast.success("Değerlendirme silindi.");
          }
        }}
      />
    </div>
  );
}
