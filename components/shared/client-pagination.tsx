"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPageNumbers } from "@/components/ui/pagination";

interface ClientPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Same look as components/ui/pagination.tsx, but drives an in-memory page
 * of already-fetched data via a callback instead of navigating to a
 * ?page= URL — for client components that filter/sort/paginate a list
 * that's already fully loaded (e.g. demo mode's localStorage data). */
export function ClientPagination({ currentPage, totalPages, onPageChange }: ClientPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Sayfalama"
      className="flex items-center justify-center gap-1 rounded-full border bg-muted/30 p-1"
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          "flex h-8 items-center gap-1 rounded-full px-3 text-sm font-medium transition-colors",
          currentPage === 1
            ? "pointer-events-none text-muted-foreground/40"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Önceki
      </button>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <button
            type="button"
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
              page === currentPage
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          "flex h-8 items-center gap-1 rounded-full px-3 text-sm font-medium transition-colors",
          currentPage === totalPages
            ? "pointer-events-none text-muted-foreground/40"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        Sonraki
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
