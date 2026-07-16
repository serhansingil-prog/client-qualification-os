import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/currency";
import type { DashboardMetrics } from "@/types/scoring";

interface DashboardMetricsGridProps {
  metrics: DashboardMetrics;
  currency: string;
}

export function DashboardMetricsGrid({ metrics, currency }: DashboardMetricsGridProps) {
  const tiles: { label: string; value: string }[] = [
    { label: "Toplam değerlendirilen müşteri", value: formatNumber(metrics.totalEvaluations) },
    { label: "Kabul edilen müşteri sayısı", value: formatNumber(metrics.acceptedCount) },
    { label: "Şartlı kabul / ek bilgi gerekli", value: formatNumber(metrics.conditionalCount) },
    { label: "Reddedilen müşteri sayısı", value: formatNumber(metrics.rejectedCount) },
    { label: "Ortalama standart puan", value: `${metrics.averageStandardScore} / 10` },
    { label: "Ortalama ağırlıklı puan", value: `${metrics.averageWeightedScore} / 100` },
    { label: "Son 30 gündeki değerlendirme", value: formatNumber(metrics.evaluationsLast30Days) },
    { label: "En sık görülen kırmızı bayrak", value: metrics.mostCommonRedFlag ?? "-" },
    { label: "En zayıf kriter", value: metrics.weakestCriterion ?? "-" },
    { label: "En güçlü müşteri segmenti", value: metrics.strongestClientSegment ?? "-" },
    { label: "Ortalama proje bütçesi", value: formatCurrency(metrics.averageProjectBudget, currency) },
    {
      label: "Kabul edilen projelerin toplam potansiyel değeri",
      value: formatCurrency(metrics.totalAcceptedPotentialValue, currency),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tiles.map((tile) => (
        <Card key={tile.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">{tile.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="truncate text-xl font-semibold tracking-tight">{tile.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
