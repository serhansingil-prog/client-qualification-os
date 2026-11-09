import { NextResponse } from "next/server";

const ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const MODEL = "claude-haiku-4-5";

const SYSTEM_PROMPT =
  "Sen bir müşteri niteleme asistanısın. Sana JSON olarak verilen değerlendirme " +
  "verisini, sesli okunacak şekilde 2-3 kısa cümlelik doğal, konuşma diline uygun " +
  "Türkçe bir özete dönüştür. Karar, skor ve varsa kritik riskleri cümlelerin " +
  "içine göm; madde işareti veya başlık kullanma, sadece düz metin döndür.";

interface VoiceSummaryRequestBody {
  apiKey?: string;
  projectName?: string;
  industry?: string;
  decision?: string;
  standardScore?: number;
  weightedScore?: number;
  criticalFailures?: string[];
  strongestCriteria?: string[];
  weakestCriteria?: string[];
}

export async function POST(request: Request) {
  let body: VoiceSummaryRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const { apiKey, ...evaluationData } = body;

  if (!apiKey || !apiKey.startsWith("sk-ant-")) {
    return NextResponse.json(
      { error: "Geçerli bir Anthropic API anahtarı gerekli. Ayarlar'dan ekleyin." },
      { status: 400 }
    );
  }

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
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: JSON.stringify(evaluationData) }],
      }),
    });
  } catch {
    return NextResponse.json({ error: "Anthropic API'ye ulaşılamadı." }, { status: 502 });
  }

  if (!anthropicResponse.ok) {
    const status = anthropicResponse.status === 401 ? 401 : 502;
    return NextResponse.json(
      { error: status === 401 ? "API anahtarı geçersiz." : "Özet oluşturulamadı." },
      { status }
    );
  }

  const data = await anthropicResponse.json();
  const summary = data?.content?.[0]?.text;

  if (typeof summary !== "string" || !summary.trim()) {
    return NextResponse.json({ error: "Özet oluşturulamadı." }, { status: 502 });
  }

  return NextResponse.json({ summary: summary.trim() });
}
