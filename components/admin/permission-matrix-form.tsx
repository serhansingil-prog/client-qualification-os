"use client";

import { useState } from "react";
import { setRolePermissions } from "@/app/(app)/admin/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PERMISSION_KEYS,
  PERMISSION_LABELS,
  type RolePermissionMatrix,
} from "@/lib/auth/permissions";
import type { UserRole } from "@/lib/auth/roles";

const ROLE_ORDER: UserRole[] = ["user", "moderator", "admin"];
const ROLE_LABELS: Record<UserRole, string> = {
  user: "Kullanıcı",
  moderator: "Moderatör",
  admin: "Admin",
};

interface PermissionMatrixFormProps {
  matrix: RolePermissionMatrix;
}

export function PermissionMatrixForm({ matrix: initialMatrix }: PermissionMatrixFormProps) {
  const [matrix, setMatrix] = useState(initialMatrix);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggle(permission: (typeof PERMISSION_KEYS)[number], role: UserRole) {
    setSaved(false);
    setMatrix((prev) => ({
      ...prev,
      [permission]: { ...prev[permission], [role]: !prev[permission][role] },
    }));
  }

  async function handleSave() {
    setSaving(true);
    const updates = PERMISSION_KEYS.flatMap((permission) =>
      ROLE_ORDER.filter((role) => role !== "admin").map((role) => ({
        role,
        permission,
        enabled: matrix[permission][role],
      }))
    );
    await setRolePermissions(updates);
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="space-y-4">
      {saved ? (
        <div className="rounded-lg border border-green-700/30 bg-green-500/10 px-4 py-2.5 text-sm text-green-600 dark:text-green-400">
          Yetki matrisi kaydedildi. Değişiklikler anında geçerli.
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Özellik</TableHead>
              {ROLE_ORDER.map((role) => (
                <TableHead key={role} className="text-center">
                  {ROLE_LABELS[role]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">Kendi Sektör Ayarını Değiştirme</TableCell>
              {ROLE_ORDER.map((role) => (
                <TableCell key={role} className="text-center text-green-600 dark:text-green-400">
                  ✓
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">
                Admin Paneline Erişim (Onay/Red/Arşiv, Rol Atama, Değişiklik Günlüğü)
              </TableCell>
              {ROLE_ORDER.map((role) => (
                <TableCell
                  key={role}
                  className={
                    role === "admin"
                      ? "text-center text-green-600 dark:text-green-400"
                      : "text-center text-muted-foreground"
                  }
                >
                  {role === "admin" ? "✓" : "✗"}
                </TableCell>
              ))}
            </TableRow>
            {PERMISSION_KEYS.map((permission) => (
              <TableRow key={permission}>
                <TableCell>{PERMISSION_LABELS[permission]}</TableCell>
                {ROLE_ORDER.map((role) => (
                  <TableCell key={role} className="text-center">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={matrix[permission][role]}
                        disabled={role === "admin"}
                        onCheckedChange={() => toggle(permission, role)}
                        aria-label={`${PERMISSION_LABELS[permission]} - ${ROLE_LABELS[role]}`}
                      />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving} size="sm">
          Kaydet
        </Button>
        <span className="text-xs text-muted-foreground">Değişiklikler anında geçerli olur.</span>
      </div>
    </div>
  );
}
