"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RotateCcw, Save } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgencySettingsForm } from "@/components/settings/agency-settings-form";
import { ScoringSettingsForm } from "@/components/settings/scoring-settings-form";
import { TechnologyStackForm } from "@/components/settings/technology-stack-form";
import { CriticalRulesForm } from "@/components/settings/critical-rules-form";
import { useSettings } from "@/hooks/use-settings";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import type { AgencySettings } from "@/types/settings";

export default function SettingsPage() {
  const { settings, isLoaded, updateSettings, resetSettings } = useSettings();
  const [formSettings, setFormSettings] = useState<AgencySettings>(DEFAULT_SETTINGS);
  const [syncedSettings, setSyncedSettings] = useState<AgencySettings | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  if (isLoaded && syncedSettings !== settings) {
    setSyncedSettings(settings);
    setFormSettings(settings);
  }

  function patch(update: Partial<AgencySettings>) {
    setFormSettings((prev) => ({ ...prev, ...update }));
  }

  function handleSave() {
    updateSettings(formSettings);
    toast.success("Ayarlar kaydedildi.");
  }

  function handleReset() {
    const defaults = resetSettings();
    setFormSettings(defaults);
    toast.success("Ayarlar varsayılana döndürüldü.");
  }

  if (!isLoaded) {
    return (
      <div>
        <PageHeader title="Ayarlar" />
        <LoadingState rows={4} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Ayarlar"
        description="Puanlama, kritik kurallar ve ajans bilgilerinizi özelleştirin."
        actions={
          <>
            <Button variant="outline" className="gap-1.5" onClick={() => setConfirmResetOpen(true)}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Varsayılana Döndür
            </Button>
            <Button className="gap-1.5" onClick={handleSave}>
              <Save className="h-4 w-4" aria-hidden="true" />
              Kaydet
            </Button>
          </>
        }
      />

      <Tabs defaultValue="agency">
        <TabsList>
          <TabsTrigger value="agency">Genel</TabsTrigger>
          <TabsTrigger value="scoring">Puanlama</TabsTrigger>
          <TabsTrigger value="tech">Teknoloji Yığını</TabsTrigger>
          <TabsTrigger value="critical">Kritik Kurallar</TabsTrigger>
        </TabsList>

        <TabsContent value="agency" className="mt-6">
          <AgencySettingsForm settings={formSettings} onChange={patch} />
        </TabsContent>
        <TabsContent value="scoring" className="mt-6">
          <ScoringSettingsForm settings={formSettings} onChange={patch} />
        </TabsContent>
        <TabsContent value="tech" className="mt-6">
          <TechnologyStackForm settings={formSettings} onChange={patch} />
        </TabsContent>
        <TabsContent value="critical" className="mt-6">
          <CriticalRulesForm settings={formSettings} onChange={patch} />
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={confirmResetOpen}
        onOpenChange={setConfirmResetOpen}
        title="Ayarları varsayılana döndür"
        description="Tüm ayarlar fabrika değerlerine döndürülecek. Devam etmek istiyor musunuz?"
        confirmLabel="Varsayılana Döndür"
        onConfirm={handleReset}
      />
    </div>
  );
}
