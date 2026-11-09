"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MaskableInputProps extends Omit<React.ComponentProps<typeof Input>, "type"> {
  type: string;
}

export function MaskableInput({ type, className, ...props }: MaskableInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={visible ? type : "password"} className={cn("pr-8", className)} />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute inset-y-0 right-0 flex w-8 items-center justify-center text-muted-foreground hover:text-foreground"
        aria-label={visible ? "Gizle" : "Göster"}
      >
        {visible ? <Eye className="h-4 w-4" aria-hidden="true" /> : <EyeOff className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
