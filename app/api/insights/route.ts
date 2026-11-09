import { NextResponse } from "next/server";
import { DECISION_LABELS } from "@/lib/labels";

const ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const MODEL = "claude-haiku-4-5";

interface RawMetrics {
  decisionDistribution?: { decision: string; count: number }[];
  averageScoreByCriterion?: { criterionId: string; criterionName: string; averageScore: number }[];
  [key: string]: unknown;
}

function toReadableMetrics(metrics: unknown) {
  if (!metrics || typeof metrics !== "object") return metrics;
  const raw = metrics as RawMetrics;

  return {
    ...raw,
    decisionDistribution: raw.decisionDistribution?.map(({ decision, count }) => ({
      karar: DECISION_LABELS[decision as keyof typeof DECISION_LABELS] ?? decision,
      sayı: count,
    })),
    averageScoreByCriterion: raw.averageScoreByCriterion?.map(({ criterionName, averageScore }) => ({
      kriter: criterionName,
      ortalamaPuan: averageScore,
    })),
  };
}

const CHART_KEYS = [
  "decision",
  "score",
  "industry",
  "leadSource",
  "criterion",
  "monthly",
  "risks",
  "none",
] as const;

const SYSTEM_PROMPT =
  "Sen bir müşteri niteleme panelinin veri asistanısın. Sana JSON olarak toplu " +
  "istatistikler (karar dağılımı, skorlar, sektör/kaynak bazlı kabul oranları, " +
  "en sık kritik riskler vb.) veriliyor; bireysel müşteri kaydı yok, sadece " +
  "agregat veri. Kullanıcının sorusunu bu veriye dayanarak cevapla. Veride yer " +
  "almayan bir şey (örn. belirli bir müşterinin adı) sorulursa, elindeki verinin " +
  "bunu içermediğini söyle, uydurma. Cevabın en fazla 2-3 kısa cümle, düz metin " +
  "olmalı: başlık, madde işareti, tablo, kalın yazı (**) veya emoji kullanma. " +
  "JSON alan adlarını, kod terimlerini veya İngilizce/snake_case değerleri " +
  "(örn. hell_yes, qualified_yes, soft_no, hard_no, criterionId gibi) asla " +
  "olduğu gibi tekrar etme; her zaman akıcı, doğal Türkçe iş diliyle yaz.";

const RESPOND_TOOL = {
  name: "respond",
  description: "Kullanıcının sorusuna kısa bir cevap ve varsa ilgili grafik anahtarı ile yanıt ver.",
  input_schema: {
    type: "object",
    properties: {
      answer: {
        type: "string",
        description: "2-3 kısa cümlelik düz metin cevap. Markdown, madde işareti veya emoji kullanma.",
      },
      chartKey: {
        type: "string",
        enum: CHART_KEYS,
        description:
          "Cevabı en iyi destekleyen grafik: decision (karar dağılımı), score (puan dağılımı), " +
          "industry (sektöre göre kabul oranı), leadSource (müşteri kaynağına göre performans), " +
          "criterion (kriterlere göre ortalama puan), monthly (aylara göre kabul/ret oranı), " +
          "risks (en sık kritik riskler). Uygun bir grafik yoksa 'none'.",
      },
    },
    required: ["answer", "chartKey"],
  },
};

interface InsightsRequestBody {
  apiKey?: string;
  question?: string;
  metrics?: unknown;
}

export async function POST(request: Request) {
  let body: InsightsRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const { apiKey, question, metrics } = body;

  if (!apiKey || !apiKey.startsWith("sk-ant-")) {
    return NextResponse.json(
      { error: "Geçerli bir Anthropic API anahtarı gerekli. Ayarlar'dan ekleyin." },
      { status: 400 }
    );
  }

  if (!question || !question.trim()) {
    return NextResponse.json({ error: "Bir soru girin." }, { status: 400 });
  }

  const userMessage = JSON.stringify({ metrics: toReadableMetrics(metrics), question });

  let anthropicResponse: Response;
  try {
    anthropicResponse = await fetch(ANTHROPIC_MESSAGES_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
        tools: [RESPOND_TOOL],
        tool_choice: { type: "tool", name: "respond" },
      }),
    });
  } catch {
    return NextResponse.json({ error: "Anthropic API'ye ulaşılamadı." }, { status: 502 });
  }

  if (!anthropicResponse.ok) {
    const status = anthropicResponse.status === 401 ? 401 : 502;
    return NextResponse.json(
      { error: status === 401 ? "API anahtarı geçersiz." : "Yanıt oluşturulamadı." },
      { status }
    );
  }

  const data = await anthropicResponse.json();
  const toolUse = data?.content?.find(
    (block: { type?: string }) => block?.type === "tool_use"
  );
  const answer = toolUse?.input?.answer;
  const chartKey = toolUse?.input?.chartKey;

  if (typeof answer !== "string" || !answer.trim()) {
    return NextResponse.json({ error: "Yanıt oluşturulamadı." }, { status: 502 });
  }

  return NextResponse.json({
    answer: answer.trim(),
    chartKey: CHART_KEYS.includes(chartKey) ? chartKey : "none",
  });
}
