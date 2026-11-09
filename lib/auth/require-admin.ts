import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin, type UserRole } from "@/lib/auth/roles";

async function getCurrentUserAndRole() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, role: null as UserRole | null };

  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return { user, role: (data?.role as UserRole | null) ?? null };
}

/** For Server Component pages: redirects non-admins to "/". */
export async function requireAdminPage(): Promise<{ id: string; email: string }> {
  const { user, role } = await getCurrentUserAndRole();
  if (!user?.email || !isAdmin(role, user.email)) {
    redirect("/");
  }
  return { id: user.id, email: user.email };
}

/** For Server Actions: throws so the caller sees a rejected action. */
export async function requireAdminAction(): Promise<string> {
  const { user, role } = await getCurrentUserAndRole();
  if (!user?.email || !isAdmin(role, user.email)) {
    throw new Error("Bu işlem için yetkiniz yok.");
  }
  return user.email;
}
