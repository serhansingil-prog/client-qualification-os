"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, History, ShieldCheck, SlidersHorizontal, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";
import { useProfile } from "@/hooks/use-profile";
import { isAdmin } from "@/lib/auth/roles";

const ADMIN_ITEMS = [
  { href: "/admin", label: "Kullanıcı Onayları", icon: UserCheck },
  { href: "/admin/permissions", label: "Yetki Matrisi", icon: SlidersHorizontal },
  { href: "/admin/recent-actions", label: "Son İşlemler", icon: History },
  { href: "/admin/changelog", label: "Değişiklik Günlüğü", icon: ShieldCheck },
] as const;

export function AdminNavTree({ onNavigate }: { onNavigate?: () => void }) {
  const { user, isLoaded: userLoaded } = useUser();
  const { role, isLoaded: roleLoaded } = useProfile();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  if (!userLoaded || !roleLoaded || !user || !isAdmin(role, user.email)) {
    return null;
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase hover:text-foreground"
      >
        <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-90")} aria-hidden="true" />
        Admin
      </button>

      {isOpen ? (
        <div className="ml-4 space-y-1 border-l pl-3">
          {ADMIN_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
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
        </div>
      ) : null}
    </div>
  );
}
