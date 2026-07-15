"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyDashboard } from "@/components/dashboard/empty-dashboard";
import { DemoModeBanner } from "@/components/shared/demo-mode-banner";
import { DashboardMetricsGrid } from "@/components/dashboard/dashboard-metrics";
import { DecisionChart } from "@/components/dashboard/decision-chart";
import { ScoreDistributionChart } from "@/components/dashboard/score-distribution-chart";
import { CriterionPerformanceChart } from "@/components/dashboard/criterion-performance-chart";
import { MonthlyAcceptanceChart } from "@/components/dashboard/monthly-acceptance-chart";
import { MetricBarChart } from "@/components/dashboard/metric-bar-chart";
import { RecentEvaluations } from "@/components/dashboard/recent-evaluations";
import { useEvaluations } from "@/hooks/use-evaluations";
import { useSettings } from "@/hooks/use-settings";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { calculateDashboardMetrics } from "@/lib/dashboard";

export default function DashboardPage() {
  const { evaluations: allEvaluations, isLoaded: evaluationsLoaded } = useEvaluations();
  const { settings, isLoaded: settingsLoaded } = useSettings();
  const { demoMode, isLoaded: demoModeLoaded } = useDemoMode();

  const evaluations = useMemo(
    () => allEvaluations.filter((evaluation) => Boolean(evaluation.isDemo) === demoMode),
    [allEvaluations, demoMode]
  );

  const metrics = useMemo(() => calculateDashboardMetrics(evaluations), [evaluations]);

  const isLoaded = evaluationsLoaded && settingsLoaded && demoModeLoaded;

  if (!isLoaded) {
    return (
      <div>
        <PageHeader title="Panel" />
        <LoadingState rows={4} />
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <div>
        <PageHeader title="Panel" description="Değerlendirmeleriniz burada özetlenecek." />
        {demoMode ? <DemoModeBanner /> : null}
        <EmptyDashboard settings={settings} />
      </div>
    );
  }

  const evaluationsByMonthData = metrics.evaluationsByMonth.map((item) => ({
    label: item.month,
    value: item.count,
  }));
  const topCriticalRisksData = metrics.topCriticalRisks.map((item) => ({
    label: item.title,
    value: item.count,
  }));
  const leadSourceData = metrics.performanceByLeadSource.map((item) => ({
    label: item.leadSource,
    value: item.acceptedRate,
  }));
  const industryData = metrics.acceptanceRateByIndustry.map((item) => ({
    label: item.industry,
    value: item.acceptedRate,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Panel" description="Müşteri değerlendirmelerinize genel bakış." />

      {demoMode ? <DemoModeBanner /> : null}

      <DashboardMetricsGrid metrics={metrics} currency={settings.defaultCurrency} />

      <div className="grid gap-6 lg:grid-cols-2">
        <DecisionChart distribution={metrics.decisionDistribution} />
        <ScoreDistributionChart distribution={metrics.scoreDistribution} />
        <MetricBarChart
          title="Son 12 Aya Göre Değerlendirme Sayısı"
          data={evaluationsByMonthData}
          summary={
            evaluationsByMonthData.some((item) => item.value > 0)
              ? "Aylık değerlendirme sayıları gösterilmektedir."
              : "Henüz veri yok."
          }
        />
        <MonthlyAcceptanceChart data={metrics.acceptanceRateByMonth} />
        <CriterionPerformanceChart averageScoreByCriterion={metrics.averageScoreByCriterion} />
        <MetricBarChart
          title="En Sık Görülen Kritik Riskler"
          data={topCriticalRisksData}
          layout="vertical"
          summary={
            topCriticalRisksData.length > 0
              ? `En sık görülen risk: ${topCriticalRisksData[0]?.label}.`
              : "Henüz kritik risk kaydedilmedi."
          }
        />
        <MetricBarChart
          title="Müşteri Kaynaklarına Göre Performans"
          data={leadSourceData}
          valueSuffix="%"
          layout="vertical"
          summary={
            leadSourceData.length > 0
              ? `En yüksek kabul oranına sahip kaynak: ${leadSourceData[0]?.label}.`
              : "Henüz veri yok."
          }
        />
        <MetricBarChart
          title="Sektörlere Göre Kabul Oranı"
          data={industryData}
          valueSuffix="%"
          layout="vertical"
          summary={
            industryData.length > 0
              ? `En yüksek kabul oranına sahip sektör: ${industryData[0]?.label}.`
              : "Henüz veri yok."
          }
        />
      </div>

      <RecentEvaluations evaluations={evaluations} />
    </div>
  );
}
