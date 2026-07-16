"use client";

import { MetricBarChart } from "@/components/dashboard/metric-bar-chart";
import type { DashboardMetrics } from "@/types/scoring";

interface CriterionPerformanceChartProps {
  averageScoreByCriterion: DashboardMetrics["averageScoreByCriterion"];
}

export function CriterionPerformanceChart({ averageScoreByCriterion }: CriterionPerformanceChartProps) {
  const data = averageScoreByCriterion
    .slice()
    .sort((a, b) => b.averageScore - a.averageScore)
    .map((item) => ({ label: item.criterionName, value: item.averageScore }));
  const summary =
    data.length === 0
      ? "Henüz veri yok."
      : `En yüksek ortalama: ${data[0]?.label} (${data[0]?.value}), en düşük ortalama: ${
          data[data.length - 1]?.label
        } (${data[data.length - 1]?.value}).`;

  return (
    <MetricBarChart
      title="Kriterlere Göre Ortalama Puan"
      data={data}
      valueSuffix="/10"
      layout="vertical"
      summary={summary}
    />
  );
}
