"use client";

import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { DemoLoadButton } from "@/components/dashboard/demo-load-button";
import { activateDemoDataset, DEMO_SECTORS, type DemoSector } from "@/lib/sample-data";
import type { AgencySettings } from "@/types/settings";

interface EmptyDashboardProps {
  settings: AgencySettings;
}

export function EmptyDashboard({ settings }: EmptyDashboardProps) {
  const router = useRouter();

  function loadSample(sector: DemoSector) {
    activateDemoDataset(settings, sector);
    const label = DEMO_SECTORS.find((option) => option.key === sector)?.label;
    toast.success(`${label} için 15 örnek demo değerlendirmesi yüklendi.`);
    router.push("/evaluations");
  }

  return (
    <EmptyState
      icon={ClipboardList}
      title="İlk değerlendirmenizi oluşturun"
      description="İlk müşteri değerlendirmeni oluşturarak hangi projelere evet, hangilerine hayır demen gerektiğini sistematik hale getir."
      actions={
        <>
          <Button
            nativeButton={false}
            className="bg-accent-2 text-accent-2-foreground hover:bg-accent-2/90"
            render={<Link href="/evaluations/new">Yeni değerlendirme oluştur</Link>}
          />
          <DemoLoadButton label="Örnek değerlendirmeyi yükle" ownSector={settings.sector} onSelect={loadSample} />
        </>
      }
    />
  );
}
