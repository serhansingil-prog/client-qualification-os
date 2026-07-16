import { Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONFIDENCE_LABELS } from "@/lib/labels";
import type { ConfidenceLevel } from "@/types/evaluation";

const CONFIDENCE_CLASSES: Record<ConfidenceLevel, string> = {
  high: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900",
  medium: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-800",
  low: "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-900/40 dark:text-gray-400 dark:border-gray-800",
};

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  className?: string;
}

export function ConfidenceBadge({ level, className }: ConfidenceBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium",
        CONFIDENCE_CLASSES[level],
        className
      )}
    >
      <Gauge className="h-4 w-4" aria-hidden="true" />
      {CONFIDENCE_LABELS[level]}
    </span>
  );
}
