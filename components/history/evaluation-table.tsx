"use client";

import Link from "next/link";
import { Archive, ArchiveRestore, Copy, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DecisionBadge } from "@/components/scoring/decision-badge";
import { formatCurrency } from "@/lib/currency";
import { formatDateShort } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { ClientEvaluation } from "@/types/evaluation";

interface EvaluationTableProps {
  evaluations: ClientEvaluation[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onDelete: (id: string) => void;
  onArchive: (id: string, isArchived: boolean) => void;
  onDuplicate: (id: string) => void;
}

export function EvaluationTable({
  evaluations,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onDelete,
  onArchive,
  onDuplicate,
}: EvaluationTableProps) {
  const allSelected = evaluations.length > 0 && selectedIds.length === evaluations.length;

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onToggleSelectAll}
                  aria-label="Tümünü seç"
                />
              </TableHead>
              <TableHead>Müşteri</TableHead>
              <TableHead>Proje</TableHead>
              <TableHead>Sektör</TableHead>
              <TableHead>Bütçe</TableHead>
              <TableHead>Standart</TableHead>
              <TableHead>Ağırlıklı</TableHead>
              <TableHead>Karar</TableHead>
              <TableHead>Kritik</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {evaluations.map((evaluation) => (
              <TableRow
                key={evaluation.id}
                className={cn(evaluation.isArchived && "opacity-60")}
                data-state={selectedIds.includes(evaluation.id) ? "selected" : undefined}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(evaluation.id)}
                    onCheckedChange={() => onToggleSelect(evaluation.id)}
                    aria-label={`${evaluation.clientName} seç`}
                  />
                </TableCell>
                <TableCell>
                  <Link href={`/evaluations/${evaluation.id}`} className="font-medium hover:underline">
                    {evaluation.clientName}
                  </Link>
                  {evaluation.companyName ? (
                    <p className="text-xs text-muted-foreground">{evaluation.companyName}</p>
                  ) : null}
                  {evaluation.isDraft ? (
                    <span className="mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      Taslak
                    </span>
                  ) : null}
                </TableCell>
                <TableCell>{evaluation.projectName}</TableCell>
                <TableCell>{evaluation.industry || "-"}</TableCell>
                <TableCell>{formatCurrency(evaluation.estimatedBudget, evaluation.currency)}</TableCell>
                <TableCell>{evaluation.standardScore}</TableCell>
                <TableCell>{evaluation.weightedScore}</TableCell>
                <TableCell>
                  <DecisionBadge decision={evaluation.decision} />
                </TableCell>
                <TableCell>{evaluation.criticalFailures.length}</TableCell>
                <TableCell>{formatDateShort(evaluation.createdAt)}</TableCell>
                <TableCell>
                  <RowActions
                    evaluation={evaluation}
                    onDelete={onDelete}
                    onArchive={onArchive}
                    onDuplicate={onDuplicate}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {evaluations.map((evaluation) => (
          <div key={evaluation.id} className={cn("rounded-lg border p-4", evaluation.isArchived && "opacity-60")}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <Checkbox
                  checked={selectedIds.includes(evaluation.id)}
                  onCheckedChange={() => onToggleSelect(evaluation.id)}
                  aria-label={`${evaluation.clientName} seç`}
                  className="mt-1"
                />
                <div>
                  <Link href={`/evaluations/${evaluation.id}`} className="font-medium hover:underline">
                    {evaluation.clientName}
                  </Link>
                  <p className="text-sm text-muted-foreground">{evaluation.projectName}</p>
                </div>
              </div>
              <RowActions
                evaluation={evaluation}
                onDelete={onDelete}
                onArchive={onArchive}
                onDuplicate={onDuplicate}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <DecisionBadge decision={evaluation.decision} />
              <span className="text-sm text-muted-foreground">
                {evaluation.standardScore}/10 · {evaluation.weightedScore}/100
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>{formatCurrency(evaluation.estimatedBudget, evaluation.currency)}</span>
              <span>{formatDateShort(evaluation.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function RowActions({
  evaluation,
  onDelete,
  onArchive,
  onDuplicate,
}: {
  evaluation: ClientEvaluation;
  onDelete: (id: string) => void;
  onArchive: (id: string, isArchived: boolean) => void;
  onDuplicate: (id: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={`${evaluation.clientName} için işlemler`}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          render={
            <Link href={`/evaluations/${evaluation.id}/edit`} className="flex items-center gap-2">
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Düzenle
            </Link>
          }
        />
        <DropdownMenuItem onClick={() => onDuplicate(evaluation.id)} className="gap-2">
          <Copy className="h-4 w-4" aria-hidden="true" />
          Kopyala
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onArchive(evaluation.id, !evaluation.isArchived)} className="gap-2">
          {evaluation.isArchived ? (
            <ArchiveRestore className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Archive className="h-4 w-4" aria-hidden="true" />
          )}
          {evaluation.isArchived ? "Arşivden Çıkar" : "Arşivle"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(evaluation.id)}
          className="gap-2 text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Sil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
