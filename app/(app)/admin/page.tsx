import Link from "next/link";
import { redirect } from "next/navigation";
import { UserApprovalsTable } from "@/components/admin/user-approvals-table";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/dates";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const ACTION_LABELS: Record<string, string> = {
  approve: "Onayladı",
  reject: "Reddetti",
  archive: "Arşivledi",
};

const PAGE_SIZE = 10;
const RECENT_ACTIONS_LIMIT = 20;

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
  const [{ data: profiles, count }, { data: recentActions }] = await Promise.all([
    admin
      .from("profiles")
      .select("id, email, status, created_at", { count: "exact" })
      .eq("archived", false)
      .order("created_at", { ascending: false })
      .range(from, to),
    admin
      .from("admin_audit_log")
      .select("id, actor_email, action, target_email, created_at")
      .order("created_at", { ascending: false })
      .limit(RECENT_ACTIONS_LIMIT),
  ]);

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kullanıcı Onayları</CardTitle>
          <CardDescription>
            Yeni kayıt olan kullanıcılar burada onaylanana kadar uygulamayı kullanamaz.
          </CardDescription>
          <CardAction>
            <Button
              nativeButton={false}
              variant="outline"
              size="sm"
              render={<Link href="/admin/changelog">Değişiklik Günlüğü</Link>}
            />
          </CardAction>
        </CardHeader>
        <CardContent>
          <UserApprovalsTable profiles={profiles ?? []} />
        </CardContent>
        <CardFooter>
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/admin" />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Son İşlemler</CardTitle>
          <CardDescription>Admin tarafından yapılan son {RECENT_ACTIONS_LIMIT} işlem.</CardDescription>
        </CardHeader>
        <CardContent>
          {(recentActions ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz bir işlem yapılmadı.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>İşlem</TableHead>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Tarih</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(recentActions ?? []).map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.actor_email}</TableCell>
                    <TableCell>{ACTION_LABELS[entry.action] ?? entry.action}</TableCell>
                    <TableCell>{entry.target_email}</TableCell>
                    <TableCell>{formatDateTime(entry.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
