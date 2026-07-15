import { CheckCircle2, CircleHelp, MinusCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { DECISION_COLOR_CLASSES, DECISION_LABELS } from "@/lib/labels";
import type { DecisionLevel } from "@/types/evaluation";

const DECISION_ICONS: Record<DecisionLevel, typeof CheckCircle2> = {
  hell_yes: CheckCircle2,
  qualified_yes: ThumbsUp,
  yellow_flag: CircleHelp,
  soft_no: MinusCircle,
  hard_no: ThumbsDown,
};

interface DecisionBadgeProps {
  decision: DecisionLevel;
  className?: string;
}

export function DecisionBadge({ decision, className }: DecisionBadgeProps) {
  const Icon = DECISION_ICONS[decision];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium",
        DECISION_COLOR_CLASSES[decision],
        className
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {DECISION_LABELS[decision]}
    </span>
  );
}
