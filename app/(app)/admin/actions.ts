"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminAction } from "@/lib/auth/require-admin";
import type { UserRole } from "@/lib/auth/roles";
import type { PermissionKey } from "@/lib/auth/permissions";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import type { AgencySettings, Sector } from "@/types/settings";

type AdminClient = ReturnType<typeof createAdminClient>;
type AuditAction = "approve" | "reject" | "archive" | "role_change";

async function logAdminAction(
  admin: AdminClient,
  actorEmail: string,
  action: AuditAction,
  targetUserId: string,
  targetEmail: string
) {
  await admin.from("admin_audit_log").insert({
    actor_email: actorEmail,
    action,
    target_user_id: targetUserId,
    target_email: targetEmail,
  });
}

export async function approveUser(userId: string) {
  const actorEmail = await requireAdminAction();

  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .update({ status: "approved" })
    .eq("id", userId)
    .select("email")
    .single();

  if (data) await logAdminAction(admin, actorEmail, "approve", userId, data.email);

  revalidatePath("/admin");
}

export async function rejectUser(userId: string) {
  const actorEmail = await requireAdminAction();

  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .update({ status: "rejected" })
    .eq("id", userId)
    .select("email")
    .single();

  if (data) await logAdminAction(admin, actorEmail, "reject", userId, data.email);

  revalidatePath("/admin");
}

export async function archiveUsers(userIds: string[]) {
  const actorEmail = await requireAdminAction();

  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .update({ archived: true })
    .in("id", userIds)
    .neq("status", "pending")
    .select("id, email");

  await Promise.all(
    (data ?? []).map((row) => logAdminAction(admin, actorEmail, "archive", row.id, row.email))
  );

  revalidatePath("/admin");
}

export async function setUserRole(userId: string, role: UserRole) {
  const actorEmail = await requireAdminAction();

  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .update({ role })
    .eq("id", userId)
    .select("email")
    .single();

  if (data) await logAdminAction(admin, actorEmail, "role_change", userId, data.email);

  revalidatePath("/admin");
}

export async function setUserSectorPermissions(
  userId: string,
  allowedSectors: Sector[],
  defaultSector: Sector | null
) {
  await requireAdminAction();

  const admin = createAdminClient();

  await admin.from("user_sector_permissions").delete().eq("user_id", userId);

  if (allowedSectors.length > 0 && defaultSector) {
    await admin.from("user_sector_permissions").insert(
      allowedSectors.map((sector) => ({
        user_id: userId,
        sector,
        is_default: sector === defaultSector,
      }))
    );

    const { data: existing } = await admin
      .from("agency_settings")
      .select("payload")
      .eq("user_id", userId)
      .maybeSingle();

    const payload: AgencySettings = existing?.payload
      ? { ...(existing.payload as AgencySettings), sector: defaultSector }
      : { ...DEFAULT_SETTINGS, sector: defaultSector };

    await admin.from("agency_settings").upsert({ user_id: userId, payload });
  }

  revalidatePath("/admin");
}

export async function setRolePermissions(
  updates: { role: UserRole; permission: PermissionKey; enabled: boolean }[]
) {
  await requireAdminAction();

  const admin = createAdminClient();
  await admin.from("role_permissions").upsert(updates, { onConflict: "role,permission" });

  revalidatePath("/admin/permissions");
}
