import { redirect } from "next/navigation";
import { UserApprovalsTable } from "@/components/admin/user-approvals-table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 10;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    redirect("/");
  }

  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const admin = createAdminClient();
  const { data: profiles, count } = await admin
    .from("profiles")
    .select("id, email, status, created_at", { count: "exact" })
    .eq("archived", false)
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kullanıcı Onayları</CardTitle>
        <CardDescription>
          Yeni kayıt olan kullanıcılar burada onaylanana kadar uygulamayı kullanamaz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserApprovalsTable profiles={profiles ?? []} />
      </CardContent>
      <CardFooter>
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/admin" />
      </CardFooter>
    </Card>
  );
}
