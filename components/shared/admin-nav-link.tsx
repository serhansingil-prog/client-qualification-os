"use client";

import Link from "next/link";
import { History, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";

export function AdminNavLink() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return null;
  }

  return (
    <div className="space-y-1">
      <Button
        nativeButton={false}
        variant="outline"
        className="w-full justify-start"
        render={
          <Link href="/admin">
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
            Admin
          </Link>
        }
      />
      <Button
        nativeButton={false}
        variant="outline"
        className="w-full justify-start"
        render={
          <Link href="/admin/changelog">
            <History className="h-4 w-4" aria-hidden="true" />
            Değişiklik Günlüğü
          </Link>
        }
      />
    </div>
  );
}
