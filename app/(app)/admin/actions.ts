"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type AdminClient = ReturnType<typeof createAdminClient>;
type AuditAction = "approve" | "reject" | "archive";

async function assertIsAdmin(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    throw new Error("Bu işlem için yetkiniz yok.");
  }

  return user.email;
}

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
  const actorEmail = await assertIsAdmin();

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
  const actorEmail = await assertIsAdmin();

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
  const actorEmail = await assertIsAdmin();

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
