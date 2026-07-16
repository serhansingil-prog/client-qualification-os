"use client";

import { toast } from "sonner";
import { Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MessageEditorProps {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
}

export function MessageEditor({ value, onChange, onReset }: MessageEditorProps) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Mesaj panoya kopyalandı.");
    } catch {
      toast.error("Panoya kopyalanamadı.");
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="message-body">Mesaj</Label>
      <Textarea
        id="message-body"
        rows={12}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="font-mono text-sm"
      />
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={handleCopy} className="gap-1.5">
          <Copy className="h-4 w-4" aria-hidden="true" />
          Panoya Kopyala
        </Button>
        <Button type="button" variant="outline" onClick={onReset} className="gap-1.5">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Sıfırla
        </Button>
      </div>
    </div>
  );
}
