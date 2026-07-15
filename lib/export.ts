import { CONFIDENCE_LABELS, DECISION_LABELS } from "@/lib/labels";
import { formatDateShort } from "@/lib/dates";
import type { ClientEvaluation } from "@/types/evaluation";

const CSV_HEADERS = [
  "Müşteri adı",
  "Şirket",
  "Proje",
  "Sektör",
  "Bütçe",
  "Para birimi",
  "Standart puan",
  "Ağırlıklı puan",
  "Karar",
  "Güven seviyesi",
  "Kritik risk sayısı",
  "Müşteri kaynağı",
  "Satış aşaması",
  "Değerlendirme tarihi",
];

function escapeCsvValue(value: string | number): string {
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export function evaluationsToCsv(evaluations: ClientEvaluation[]): string {
  const rows = evaluations.map((evaluation) =>
    [
      evaluation.clientName,
      evaluation.companyName ?? "",
      evaluation.projectName,
      evaluation.industry ?? "",
      evaluation.estimatedBudget ?? "",
      evaluation.currency,
      evaluation.standardScore,
      evaluation.weightedScore,
      DECISION_LABELS[evaluation.decision],
      CONFIDENCE_LABELS[evaluation.confidenceLevel],
      evaluation.criticalFailures.length,
      evaluation.leadSource ?? "",
      evaluation.salesStage ?? "",
      formatDateShort(evaluation.createdAt),
    ]
      .map(escapeCsvValue)
      .join(",")
  );

  return [CSV_HEADERS.join(","), ...rows].join("\n");
}

export function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
