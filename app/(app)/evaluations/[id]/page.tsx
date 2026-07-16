"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Archive, ArchiveRestore, Copy, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DemoModeBanner } from "@/components/shared/demo-mode-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultSummary } from "@/components/evaluation/result-summary";
import { ScenarioSimulator } from "@/components/evaluation/scenario-simulator";
import { MessageGenerator } from "@/components/messages/message-generator";
import { useSettings } from "@/hooks/use-settings";
import { calculateEvaluationResult } from "@/lib/scoring";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/dates";
import {
  archiveEvaluation,
  deleteEvaluation,
  duplicateEvaluation,
  getEvaluationById,
} from "@/lib/storage";
import type { ClientEvaluation } from "@/types/evaluation";

export default function EvaluationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { settings, isLoaded: settingsLoaded } = useSettings();
  const [evaluation, setEvaluation] = useState<ClientEvaluation | null | undefined>(undefined);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getEvaluationById(id);
        if (!cancelled) setEvaluation(data ?? null);
      } catch {
        if (!cancelled) {
          toast.error("Değerlendirme yüklenirken bir hata oluştu.");
          setEvaluation(null);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (evaluation === undefined || !settingsLoaded) {
    return <LoadingState rows={4} />;
  }

  if (evaluation === null) {
    return (
      <div>
        <ErrorState
          title="Değerlendirme bulunamadı"
          description="Bu bağlantıya sahip bir değerlendirme bulunamadı. Silinmiş olabilir."
        />
        <div className="mt-4">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/evaluations">Değerlendirmelere dön</Link>}
          />
        </div>
      </div>
    );
  }

  const result = calculateEvaluationResult(evaluation, settings);

  return (
    <div>
      {evaluation.isDemo ? <DemoModeBanner /> : null}
      <PageHeader
        title={evaluation.projectName}
        description={`${evaluation.clientName}${evaluation.companyName ? ` · ${evaluation.companyName}` : ""}`}
        actions={
          <>
            <Button
              variant="outline"
              className="gap-1.5"
              nativeButton={false}
              render={
                <Link href={`/evaluations/${evaluation.id}/edit`}>
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Düzenle
                </Link>
              }
            />
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={async () => {
                try {
                  const copy = await duplicateEvaluation(evaluation.id);
                  if (copy) {
                    toast.success("Değerlendirme kopyalandı.");
                    router.push(`/evaluations/${copy.id}/edit`);
                  }
                } catch {
                  toast.error("Değerlendirme kopyalanamadı.");
                }
              }}
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              Kopyala
            </Button>
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={async () => {
                try {
                  const updated = await archiveEvaluation(evaluation.id, !evaluation.isArchived);
                  if (updated) setEvaluation(updated);
                  toast.success(updated?.isArchived ? "Arşivlendi." : "Arşivden çıkarıldı.");
                } catch {
                  toast.error("İşlem gerçekleştirilemedi.");
                }
              }}
            >
              {evaluation.isArchived ? (
                <ArchiveRestore className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Archive className="h-4 w-4" aria-hidden="true" />
              )}
              {evaluation.isArchived ? "Arşivden Çıkar" : "Arşivle"}
            </Button>
            <Button
              variant="destructive"
              className="gap-1.5"
              onClick={() => setConfirmDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Sil
            </Button>
          </>
        }
      />

      <Tabs defaultValue="result">
        <TabsList>
          <TabsTrigger value="result">Sonuç</TabsTrigger>
          <TabsTrigger value="details">Müşteri Detayları</TabsTrigger>
          <TabsTrigger value="simulator">Senaryo Simülatörü</TabsTrigger>
          <TabsTrigger value="message">Mesaj Oluşturucu</TabsTrigger>
        </TabsList>

        <TabsContent value="result" className="mt-6">
          <ResultSummary
            evaluation={evaluation}
            result={result}
            decisionThresholds={settings.decisionThresholds}
          />
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Müşteri Detayları</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
              <DetailRow label="İletişim kişisi" value={evaluation.contactName} />
              <DetailRow label="E-posta" value={evaluation.email} />
              <DetailRow label="Telefon" value={evaluation.phone} />
              <DetailRow label="Web sitesi" value={evaluation.website} />
              <DetailRow label="Sektör" value={evaluation.industry} />
              <DetailRow label="Şirket büyüklüğü" value={evaluation.companySize} />
              <DetailRow
                label="Tahmini proje bütçesi"
                value={formatCurrency(evaluation.estimatedBudget, evaluation.currency)}
              />
              <DetailRow
                label="Aylık destek bütçesi"
                value={formatCurrency(evaluation.monthlyRetainer, evaluation.currency)}
              />
              <DetailRow label="İlk iletişim tarihi" value={formatDate(evaluation.inquiryDate)} />
              <DetailRow
                label="Talep edilen teslim tarihi"
                value={formatDate(evaluation.requestedDeliveryDate)}
              />
              <DetailRow label="Müşteri kaynağı" value={evaluation.leadSource} />
              <DetailRow label="Satış aşaması" value={evaluation.salesStage} />
              {evaluation.projectDescription ? (
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground">Proje açıklaması</p>
                  <p className="mt-1">{evaluation.projectDescription}</p>
                </div>
              ) : null}
              {evaluation.generalNotes ? (
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground">Genel notlar</p>
                  <p className="mt-1">{evaluation.generalNotes}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulator" className="mt-6">
          <ScenarioSimulator evaluation={evaluation} settings={settings} />
        </TabsContent>

        <TabsContent value="message" className="mt-6">
          <MessageGenerator evaluation={evaluation} settings={settings} result={result} />
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Değerlendirmeyi sil"
        description="Bu değerlendirmeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmLabel="Sil"
        onConfirm={async () => {
          try {
            await deleteEvaluation(evaluation.id);
            toast.success("Değerlendirme silindi.");
            router.push("/evaluations");
          } catch {
            toast.error("Değerlendirme silinemedi.");
          }
        }}
      />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-1">{value || "-"}</p>
    </div>
  );
}
