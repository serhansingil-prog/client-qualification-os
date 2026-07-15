"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Download, FileJson, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { downloadFile, evaluationsToCsv } from "@/lib/export";
import { exportData, importData } from "@/lib/storage";
import { APP_VERSION } from "@/lib/constants";
import type { ClientEvaluation } from "@/types/evaluation";

interface EvaluationActionsProps {
  evaluations: ClientEvaluation[];
  selectedIds: string[];
  onBulkDelete: (ids: string[]) => void;
  onImported: () => void;
}

export function EvaluationActions({
  evaluations,
  selectedIds,
  onBulkDelete,
  onImported,
}: EvaluationActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importMode, setImportMode] = useState<"merge" | "overwrite">("merge");
  const [confirmBulkDeleteOpen, setConfirmBulkDeleteOpen] = useState(false);

  async function handleExportJson() {
    try {
      const data = await exportData();
      downloadFile(
        `client-qualification-os-export-${new Date().toISOString().slice(0, 10)}.json`,
        JSON.stringify(data, null, 2),
        "application/json"
      );
    } catch {
      toast.error("Dışa aktarma başarısız oldu.");
    }
  }

  function handleExportCsv() {
    const csv = evaluationsToCsv(evaluations);
    downloadFile(
      `client-qualification-os-evaluations-${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
      "text/csv"
    );
  }

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const text = await file.text();
    try {
      const result = await importData(text, importMode);
      if (!result.success) {
        toast.error(`İçe aktarma başarısız: ${result.errors[0] ?? "Bilinmeyen hata"}`);
        return;
      }
      toast.success(
        `${result.importedCount} değerlendirme içe aktarıldı${
          result.duplicateCount > 0 ? `, ${result.duplicateCount} kopya atlandı` : ""
        }.`
      );
      setImportOpen(false);
      onImported();
    } catch {
      toast.error("İçe aktarma sırasında bir hata oluştu.");
    }
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {selectedIds.length > 0 ? (
        <Button
          variant="destructive"
          size="sm"
          className="gap-1.5"
          onClick={() => setConfirmBulkDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Seçilenleri Sil ({selectedIds.length})
        </Button>
      ) : null}
      <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExportJson}>
        <FileJson className="h-4 w-4" aria-hidden="true" />
        JSON Dışa Aktar
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExportCsv}>
        <Download className="h-4 w-4" aria-hidden="true" />
        CSV Dışa Aktar
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setImportOpen(true)}>
        <Upload className="h-4 w-4" aria-hidden="true" />
        JSON İçe Aktar
      </Button>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>JSON İçe Aktar</DialogTitle>
            <DialogDescription>
              Uygulama sürümü: {APP_VERSION}. Daha önce dışa aktarılan bir JSON dosyası seçin.
            </DialogDescription>
          </DialogHeader>
          <RadioGroup value={importMode} onValueChange={(value) => setImportMode(value as typeof importMode)}>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="merge" id="import-merge" />
              <Label htmlFor="import-merge" className="cursor-pointer font-normal">
                Mevcut verinin üzerine ekle (kopyalar atlanır)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="overwrite" id="import-overwrite" />
              <Label htmlFor="import-overwrite" className="cursor-pointer font-normal">
                Mevcut verinin üzerine yaz
              </Label>
            </div>
          </RadioGroup>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleFileSelected}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportOpen(false)}>
              Vazgeç
            </Button>
            <Button onClick={() => fileInputRef.current?.click()}>Dosya Seç</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmBulkDeleteOpen}
        onOpenChange={setConfirmBulkDeleteOpen}
        title="Seçilen değerlendirmeleri sil"
        description={`${selectedIds.length} değerlendirmeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        confirmLabel="Sil"
        onConfirm={() => onBulkDelete(selectedIds)}
      />
    </div>
  );
}
