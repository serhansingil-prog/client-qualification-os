"use client";

import { MetricBarChart } from "@/components/dashboard/metric-bar-chart";
import type { DashboardMetrics } from "@/types/scoring";

interface ScoreDistributionChartProps {
  distribution: DashboardMetrics["scoreDistribution"];
}

export function ScoreDistributionChart({ distribution }: ScoreDistributionChartProps) {
  const data = distribution.map((bucket) => ({ label: bucket.range, value: bucket.count }));
  const summary = data.map((item) => `${item.label}: ${item.value}`).join(", ") || "Henüz veri yok.";

  return (
    <MetricBarChart title="Puan Dağılımı (Ağırlıklı)" data={data} summary={summary} />
  );
}
