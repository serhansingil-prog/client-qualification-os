"use client";

import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { activateDemoDataset } from "@/lib/sample-data";
import type { AgencySettings } from "@/types/settings";

interface EmptyDashboardProps {
  settings: AgencySettings;
}

export function EmptyDashboard({ settings }: EmptyDashboardProps) {
  const router = useRouter();

  function loadSample() {
    activateDemoDataset(settings);
    toast.success("5 örnek demo değerlendirmesi yüklendi.");
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
          <Button variant="outline" onClick={loadSample}>
            Örnek değerlendirmeyi yükle
          </Button>
        </>
      }
    />
  );
}
