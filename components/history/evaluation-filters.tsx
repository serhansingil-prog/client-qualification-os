"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DECISION_LABELS } from "@/lib/labels";
import { LEAD_SOURCES, SALES_STAGES, type DecisionLevel } from "@/types/evaluation";

export type SortField = "date" | "standardScore" | "weightedScore" | "budget";
export type SortDirection = "asc" | "desc";

const SORT_FIELD_LABELS: Record<SortField, string> = {
  date: "Tarih",
  standardScore: "Standart Puan",
  weightedScore: "Ağırlıklı Puan",
  budget: "Bütçe",
};

const SORT_DIRECTION_LABELS: Record<SortDirection, string> = {
  desc: "Azalan",
  asc: "Artan",
};

export interface EvaluationFiltersState {
  search: string;
  industry: string;
  decision: DecisionLevel | "all";
  leadSource: string;
  salesStage: string;
  onlyCritical: boolean;
  includeArchived: boolean;
  sortField: SortField;
  sortDirection: SortDirection;
}

export const DEFAULT_FILTERS: EvaluationFiltersState = {
  search: "",
  industry: "all",
  decision: "all",
  leadSource: "all",
  salesStage: "all",
  onlyCritical: false,
  includeArchived: false,
  sortField: "date",
  sortDirection: "desc",
};

interface EvaluationFiltersProps {
  filters: EvaluationFiltersState;
  industries: string[];
  onChange: (filters: EvaluationFiltersState) => void;
}

export function EvaluationFilters({ filters, industries, onChange }: EvaluationFiltersProps) {
  function patch(update: Partial<EvaluationFiltersState>) {
    onChange({ ...filters, ...update });
  }

  return (
    <div className="mb-4 space-y-4 rounded-lg border bg-muted/10 p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) => patch({ search: event.target.value })}
          placeholder="Müşteri, şirket veya proje adına göre ara"
          className="pl-9"
          aria-label="Değerlendirme ara"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label>Sektör</Label>
          <Select
            items={{ all: "Tümü", ...Object.fromEntries(industries.map((industry) => [industry, industry])) }}
            value={filters.industry}
            onValueChange={(value) => patch({ industry: value ?? "all" })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Karar</Label>
          <Select
            items={{ all: "Tümü", ...DECISION_LABELS }}
            value={filters.decision}
            onValueChange={(value) => patch({ decision: value as EvaluationFiltersState["decision"] })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              {Object.entries(DECISION_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Müşteri kaynağı</Label>
          <Select
            items={{ all: "Tümü", ...Object.fromEntries(LEAD_SOURCES.map((source) => [source, source])) }}
            value={filters.leadSource}
            onValueChange={(value) => patch({ leadSource: value ?? "all" })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              {LEAD_SOURCES.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Satış aşaması</Label>
          <Select
            items={{ all: "Tümü", ...Object.fromEntries(SALES_STAGES.map((stage) => [stage, stage])) }}
            value={filters.salesStage}
            onValueChange={(value) => patch({ salesStage: value ?? "all" })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              {SALES_STAGES.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <Checkbox
            id="only-critical"
            checked={filters.onlyCritical}
            onCheckedChange={(checked) => patch({ onlyCritical: checked === true })}
          />
          <Label htmlFor="only-critical" className="cursor-pointer font-normal">
            Yalnızca kritik riskli olanlar
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="include-archived"
            checked={filters.includeArchived}
            onCheckedChange={(checked) => patch({ includeArchived: checked === true })}
          />
          <Label htmlFor="include-archived" className="cursor-pointer font-normal">
            Arşivlenenleri de göster
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="sort-field" className="whitespace-nowrap">
            Sırala:
          </Label>
          <Select
            items={SORT_FIELD_LABELS}
            value={filters.sortField}
            onValueChange={(value) => patch({ sortField: value as SortField })}
          >
            <SelectTrigger id="sort-field" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Tarih</SelectItem>
              <SelectItem value="standardScore">Standart Puan</SelectItem>
              <SelectItem value="weightedScore">Ağırlıklı Puan</SelectItem>
              <SelectItem value="budget">Bütçe</SelectItem>
            </SelectContent>
          </Select>
          <Select
            items={SORT_DIRECTION_LABELS}
            value={filters.sortDirection}
            onValueChange={(value) => patch({ sortDirection: value as SortDirection })}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Azalan</SelectItem>
              <SelectItem value="asc">Artan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
