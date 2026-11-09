"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApiKey } from "@/lib/api-key-store";
import { speak } from "@/lib/speech";
import { useUser } from "@/hooks/use-user";
import type { ClientEvaluation } from "@/types/evaluation";
import type { ScoringResult } from "@/types/scoring";

interface VoiceSummaryButtonProps {
  evaluation: ClientEvaluation;
  result: ScoringResult;
}

export function VoiceSummaryButton({ evaluation, result }: VoiceSummaryButtonProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  async function handleClick() {
    const apiKey = user ? getApiKey(user.id) : "";
    if (!apiKey) {
      toast.error("Önce Ayarlar > Genel sekmesinden Anthropic API anahtarınızı girin.");
      return;
    }

    setLoading(true);
    setSummary(null);

    try {
      const response = await fetch("/api/voice-summary", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          apiKey,
          projectName: evaluation.projectName,
          industry: evaluation.industry,
          decision: result.decision,
          standardScore: result.standardScore,
          weightedScore: result.weightedScore,
          criticalFailures: result.criticalFailures.map((failure) => failure.title),
          strongestCriteria: result.strongestCriteria.map((criterion) => criterion.name),
          weakestCriteria: result.weakestCriteria.map((criterion) => criterion.name),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Özet oluşturulamadı.");
        return;
      }

      setSummary(data.summary);
      speak(data.summary);
    } catch {
      toast.error("Özet oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button variant="outline" className="gap-1.5" onClick={handleClick} disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Volume2 className="h-4 w-4" aria-hidden="true" />
        )}
        Sesli Özetle
      </Button>
      {summary ? <p className="text-sm text-muted-foreground">{summary}</p> : null}
    </div>
  );
}
