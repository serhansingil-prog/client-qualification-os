"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MESSAGE_CATEGORY_LABELS, MESSAGE_TONE_LABELS } from "@/lib/templates";
import type { MessageCategory, MessageTone } from "@/types/templates";

interface MessageTemplateSelectorProps {
  category: MessageCategory;
  tone: MessageTone;
  onCategoryChange: (category: MessageCategory) => void;
  onToneChange: (tone: MessageTone) => void;
}

export function MessageTemplateSelector({
  category,
  tone,
  onCategoryChange,
  onToneChange,
}: MessageTemplateSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="message-category">Şablon kategorisi</Label>
        <Select
          items={MESSAGE_CATEGORY_LABELS}
          value={category}
          onValueChange={(value) => onCategoryChange(value as MessageCategory)}
        >
          <SelectTrigger id="message-category" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(MESSAGE_CATEGORY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message-tone">Ton</Label>
        <Select
          items={MESSAGE_TONE_LABELS}
          value={tone}
          onValueChange={(value) => onToneChange(value as MessageTone)}
        >
          <SelectTrigger id="message-tone" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(MESSAGE_TONE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
