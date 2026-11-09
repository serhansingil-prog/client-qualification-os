"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Send,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DecisionChart } from "@/components/dashboard/decision-chart";
import { ScoreDistributionChart } from "@/components/dashboard/score-distribution-chart";
import { CriterionPerformanceChart } from "@/components/dashboard/criterion-performance-chart";
import { MonthlyAcceptanceChart } from "@/components/dashboard/monthly-acceptance-chart";
import { MetricBarChart } from "@/components/dashboard/metric-bar-chart";
import { getApiKey } from "@/lib/api-key-store";
import { speak } from "@/lib/speech";
import { useUser } from "@/hooks/use-user";
import type { DashboardMetrics } from "@/types/scoring";

interface InsightsAssistantProps {
  metrics: DashboardMetrics;
}

type ChartKey =
  | "decision"
  | "score"
  | "industry"
  | "leadSource"
  | "criterion"
  | "monthly"
  | "risks"
  | "none";

interface QaPair {
  question: string;
  answer: string;
  chartKey: ChartKey;
  isAuto?: boolean;
}

const AUTO_INSIGHT_PROMPT =
  "Bu verilere genel bir bakış at ve öne çıkan en önemli gözlemi kısaca yorumla.";

function InsightChart({ chartKey, metrics }: { chartKey: ChartKey; metrics: DashboardMetrics }) {
  switch (chartKey) {
    case "decision":
      return <DecisionChart distribution={metrics.decisionDistribution} />;
    case "score":
      return <ScoreDistributionChart distribution={metrics.scoreDistribution} />;
    case "criterion":
      return <CriterionPerformanceChart averageScoreByCriterion={metrics.averageScoreByCriterion} />;
    case "monthly":
      return <MonthlyAcceptanceChart data={metrics.acceptanceRateByMonth} />;
    case "industry":
      return (
        <MetricBarChart
          title="Sektörlere Göre Kabul Oranı"
          data={metrics.acceptanceRateByIndustry.map((item) => ({
            label: item.industry,
            value: item.acceptedRate,
          }))}
          valueSuffix="%"
          layout="vertical"
          summary="Sektörlere göre kabul oranı."
        />
      );
    case "leadSource":
      return (
        <MetricBarChart
          title="Müşteri Kaynaklarına Göre Performans"
          data={metrics.performanceByLeadSource.map((item) => ({
            label: item.leadSource,
            value: item.acceptedRate,
          }))}
          valueSuffix="%"
          layout="vertical"
          summary="Müşteri kaynağına göre kabul oranı."
        />
      );
    case "risks":
      return (
        <MetricBarChart
          title="En Sık Görülen Kritik Riskler"
          data={metrics.topCriticalRisks.map((item) => ({ label: item.title, value: item.count }))}
          layout="vertical"
          summary="En sık görülen kritik riskler."
        />
      );
    default:
      return null;
  }
}

export function InsightsAssistant({ metrics }: InsightsAssistantProps) {
  const { user } = useUser();
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<QaPair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [expandedCharts, setExpandedCharts] = useState<Set<number>>(new Set());

  function toggleChart(index: number) {
    setExpandedCharts((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  async function runQuestion(trimmedQuestion: string, isGeneral: boolean): Promise<boolean> {
    const apiKey = user ? getApiKey(user.id) : "";
    if (!apiKey) {
      toast.error("Önce Ayarlar > Genel sekmesinden Anthropic API anahtarınızı girin.");
      return false;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ apiKey, question: trimmedQuestion, metrics }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Yanıt oluşturulamadı.");
        return false;
      }

      setHistory((current) => [
        ...current,
        {
          question: trimmedQuestion,
          answer: data.answer,
          chartKey: data.chartKey as ChartKey,
          isAuto: isGeneral,
        },
      ]);
      setCurrentIndex(history.length);
      if (voiceEnabled) {
        speak(data.answer);
      }
      return true;
    } catch {
      toast.error("Yanıt alınırken bir hata oluştu.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleGeneralInsight() {
    await runQuestion(AUTO_INSIGHT_PROMPT, true);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    const ok = await runQuestion(trimmedQuestion, false);
    if (ok) {
      setQuestion("");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Asistan</CardTitle>
        <CardDescription>
          Panel verilerinize dair doğal dilde soru sorun (örn. &quot;Bu ay red oranı neden
          yükseldi?&quot;). Sadece toplu istatistikler gönderilir, kişisel müşteri bilgisi
          paylaşılmaz. Sorular kaydedilmez, sayfa yenilenince geçmiş silinir.
        </CardDescription>
        <CardAction className="flex gap-1.5">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => {
              if (voiceEnabled) {
                window.speechSynthesis?.cancel();
              }
              setVoiceEnabled((current) => !current);
            }}
            aria-label={voiceEnabled ? "Sesli yanıtı kapat" : "Sesli yanıtı aç"}
            aria-pressed={voiceEnabled}
          >
            {voiceEnabled ? (
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <VolumeX className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleGeneralInsight}
            disabled={loading}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Genel Değerlendirme
          </Button>
          {history.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                window.speechSynthesis?.cancel();
                setHistory([]);
                setCurrentIndex(0);
                setExpandedCharts(new Set());
              }}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Temizle
            </Button>
          ) : null}
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Bir soru sorun..."
            disabled={loading}
          />
          <Button type="submit" className="gap-1.5" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
            Sor
          </Button>
        </form>

        {history.length > 0 ? (
          (() => {
            const pair = history[currentIndex];
            return (
              <div className="space-y-3 rounded-md border p-3 text-sm">
                <div className="space-y-1">
                  <p className="font-medium">
                    {pair.isAuto ? "Genel Değerlendirme" : pair.question}
                  </p>
                  <div className="flex items-start gap-2">
                    <p className="flex-1 text-muted-foreground">{pair.answer}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                      onClick={() => speak(pair.answer)}
                      aria-label="Sesli dinle"
                    >
                      <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                </div>

                {history.length > 1 ? (
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                      disabled={currentIndex === 0}
                      aria-label="Önceki soru"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {currentIndex + 1} / {history.length}
                    </span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => setCurrentIndex((i) => Math.min(history.length - 1, i + 1))}
                      disabled={currentIndex === history.length - 1}
                      aria-label="Sonraki soru"
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                ) : null}

                {pair.chartKey !== "none" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => toggleChart(currentIndex)}
                    >
                      <BarChart3 className="h-4 w-4" aria-hidden="true" />
                      {expandedCharts.has(currentIndex) ? "Grafiği Gizle" : "Grafik Göster"}
                    </Button>
                    {expandedCharts.has(currentIndex) ? (
                      <InsightChart chartKey={pair.chartKey} metrics={metrics} />
                    ) : null}
                  </>
                ) : null}
              </div>
            );
          })()
        ) : loading ? (
          <p className="text-sm text-muted-foreground">Veriler değerlendiriliyor...</p>
        ) : (
          <p className="text-sm text-muted-foreground">Henüz bir soru sorulmadı.</p>
        )}
      </CardContent>
    </Card>
  );
}
