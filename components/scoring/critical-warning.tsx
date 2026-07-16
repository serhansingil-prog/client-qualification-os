import { AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";
import { RISK_SEVERITY_COLOR_CLASSES, RISK_SEVERITY_LABELS } from "@/lib/labels";
import type { CriticalFailure } from "@/types/evaluation";

interface CriticalWarningProps {
  failure: CriticalFailure;
  className?: string;
}

export function CriticalWarning({ failure, className }: CriticalWarningProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md border p-3",
        RISK_SEVERITY_COLOR_CLASSES[failure.severity],
        className
      )}
    >
      <AlertOctagon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{failure.title}</span>
          <span className="rounded-full border px-2 py-0.5 text-xs">
            {RISK_SEVERITY_LABELS[failure.severity]}
          </span>
          {failure.blocksApproval ? (
            <span className="rounded-full border px-2 py-0.5 text-xs">Onayı Engeller</span>
          ) : null}
        </div>
        <p className="mt-1 text-sm opacity-90">{failure.description}</p>
      </div>
    </div>
  );
}
