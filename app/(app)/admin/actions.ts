"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function assertIsAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    throw new Error("Bu işlem için yetkiniz yok.");
  }
}

export async function approveUser(userId: string) {
  await assertIsAdmin();

  const admin = createAdminClient();
  await admin.from("profiles").update({ status: "approved" }).eq("id", userId);

  revalidatePath("/admin");
}

export async function rejectUser(userId: string) {
  await assertIsAdmin();

  const admin = createAdminClient();
  await admin.from("profiles").update({ status: "rejected" }).eq("id", userId);

  revalidatePath("/admin");
}
