"use client";

import { LogOut, UserRound } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";

export function UserMenu() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) return null;

  return (
    <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <UserRound className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="truncate text-sm" title={user.email}>
          {user.email}
        </span>
      </div>
      <form action={logout}>
        <Button type="submit" variant="ghost" size="icon-sm" aria-label="Çıkış yap">
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
}
