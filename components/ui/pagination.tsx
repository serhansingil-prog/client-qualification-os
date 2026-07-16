import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  const delta = 1;
  const range = new Set<number>([1, total]);
  for (let i = current - delta; i <= current + delta; i++) {
    if (i > 1 && i < total) range.add(i);
  }

  const sorted = Array.from(range).sort((a, b) => a - b);
  const pages: (number | "ellipsis")[] = [];
  let previous = 0;
  for (const page of sorted) {
    if (previous && page - previous > 1) pages.push("ellipsis");
    pages.push(page);
    previous = page;
  }
  return pages;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  function hrefFor(page: number) {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
  }

  return (
    <nav
      aria-label="Sayfalama"
      className="flex items-center justify-center gap-1 rounded-full border bg-muted/30 p-1"
    >
      <Link
        href={hrefFor(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={cn(
          "flex h-8 items-center gap-1 rounded-full px-3 text-sm font-medium transition-colors",
          currentPage === 1
            ? "pointer-events-none text-muted-foreground/40"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Önceki
      </Link>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={hrefFor(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
              page === currentPage
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {page}
          </Link>
        )
      )}

      <Link
        href={hrefFor(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={cn(
          "flex h-8 items-center gap-1 rounded-full px-3 text-sm font-medium transition-colors",
          currentPage === totalPages
            ? "pointer-events-none text-muted-foreground/40"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        Sonraki
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </nav>
  );
}
