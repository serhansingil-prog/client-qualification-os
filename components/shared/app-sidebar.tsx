"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { getActiveNavHref, NAV_ITEMS } from "@/lib/nav";
import { AdminNavTree } from "@/components/shared/admin-nav-tree";
import { DemoModeToggle } from "@/components/shared/demo-mode-toggle";
import { UserMenu } from "@/components/shared/user-menu";
import { useSidebarOpen } from "@/hooks/use-sidebar-open";

export function AppSidebar() {
  const pathname = usePathname();
  const activeHref = getActiveNavHref(pathname);
  const { isOpen } = useSidebarOpen();

  return (
    <aside
      className={cn(
        "h-screen w-64 shrink-0 flex-col overflow-y-auto border-r bg-muted/20",
        isOpen ? "hidden md:flex" : "hidden"
      )}
    >
      <div className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
        <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
        <span className="font-semibold tracking-tight">Client Qualification OS</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Ana gezinme">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === activeHref;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
        <AdminNavTree />
      </nav>
      <div className="space-y-3 border-t p-4">
        <UserMenu />
        <DemoModeToggle />
      </div>
    </aside>
  );
}
