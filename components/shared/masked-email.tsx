"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface MaskedEmailProps {
  email: string;
  className?: string;
}

export function MaskedEmail({ email, className }: MaskedEmailProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span className={cn("inline-flex min-w-0 items-center gap-1.5", className)}>
      <span className="truncate" title={visible ? email : undefined}>
        {visible ? email : "•••••••••••"}
      </span>
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="shrink-0 text-muted-foreground hover:text-foreground"
        aria-label={visible ? "E-postayı gizle" : "E-postayı göster"}
      >
        {visible ? <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
      </button>
    </span>
  );
}
