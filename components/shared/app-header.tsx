"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Menu, Moon, PanelLeftClose, PanelLeftOpen, ShieldCheck, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { getActiveNavHref, NAV_ITEMS } from "@/lib/nav";
import { AdminNavLink } from "@/components/shared/admin-nav-link";
import { DemoModeToggle } from "@/components/shared/demo-mode-toggle";
import { UserMenu } from "@/components/shared/user-menu";
import { useSidebarOpen } from "@/hooks/use-sidebar-open";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Theme is unknown until mounted on the client; this is next-themes' documented hydration-safe pattern.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Tema" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export function AppHeader() {
  const pathname = usePathname();
  const activeHref = getActiveNavHref(pathname);
  const [open, setOpen] = useState(false);
  const { isOpen: sidebarOpen, toggle: toggleSidebar } = useSidebarOpen();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
        <span className="font-semibold tracking-tight">CQ OS</span>
      </div>
      <div className="hidden items-center gap-3 md:flex">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Kenar çubuğunu gizle" : "Kenar çubuğunu göster"}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
        <span className="text-sm text-muted-foreground italic">Her fırsat bir evet değildir.</span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Menüyü aç">
                <Menu className="h-4 w-4" />
              </Button>
            }
          />
          <SheetContent side="right" className="w-64">
            <SheetTitle className="px-4 pt-4">Menü</SheetTitle>
            <nav className="flex flex-col gap-1 p-4" aria-label="Mobil gezinme">
              {NAV_ITEMS.map((item) => {
                const isActive = item.href === activeHref;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
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
            </nav>
            <div className="mt-auto space-y-3 p-4">
              <UserMenu />
              <AdminNavLink />
              <DemoModeToggle />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
