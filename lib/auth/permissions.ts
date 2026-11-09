import { isAdmin, type UserRole } from "@/lib/auth/roles";

export type PermissionKey = "multi_sector_demo" | "multi_sector_guide";

export const PERMISSION_KEYS: PermissionKey[] = ["multi_sector_demo", "multi_sector_guide"];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  multi_sector_demo: "Demo Veri: Çoklu Sektör Erişimi",
  multi_sector_guide: "Kullanım Kılavuzları: Çoklu Sektör Erişimi",
};

export const DEFAULT_ROLE_PERMISSIONS: Record<PermissionKey, Record<UserRole, boolean>> = {
  multi_sector_demo: { user: false, moderator: true, admin: true },
  multi_sector_guide: { user: false, moderator: true, admin: true },
};

export type RolePermissionMatrix = Record<PermissionKey, Record<UserRole, boolean>>;

interface RolePermissionRow {
  role: UserRole;
  permission: PermissionKey;
  enabled: boolean;
}

export function mergeWithDefaults(rows: RolePermissionRow[]): RolePermissionMatrix {
  const matrix: RolePermissionMatrix = {
    multi_sector_demo: { ...DEFAULT_ROLE_PERMISSIONS.multi_sector_demo },
    multi_sector_guide: { ...DEFAULT_ROLE_PERMISSIONS.multi_sector_guide },
  };
  for (const row of rows) {
    if (matrix[row.permission] && row.role in matrix[row.permission]) {
      matrix[row.permission][row.role] = row.enabled;
    }
  }
  return matrix;
}

export function hasPermission(
  matrix: RolePermissionMatrix,
  permission: PermissionKey,
  role: UserRole | null | undefined,
  email?: string | null
): boolean {
  if (isAdmin(role, email)) return true;
  if (!role) return false;
  return matrix[permission]?.[role] ?? false;
}
