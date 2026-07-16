import { redirect } from "next/navigation";
import { MaskedEmail } from "@/components/shared/masked-email";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

const PAGE_SIZE = 5;

export default async function RecentActionsPage({
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
  const { data: recentActions, count } = await admin
    .from("admin_audit_log")
    .select("id, actor_email, action, target_email, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Son İşlemler</CardTitle>
        <CardDescription>Admin tarafından yapılan onay/red/arşivleme işlemlerinin dökümü.</CardDescription>
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
                  <TableCell>
                    <MaskedEmail email={entry.actor_email} />
                  </TableCell>
                  <TableCell>{ACTION_LABELS[entry.action] ?? entry.action}</TableCell>
                  <TableCell>{entry.target_email}</TableCell>
                  <TableCell>{formatDateTime(entry.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter>
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/admin/recent-actions" />
      </CardFooter>
    </Card>
  );
}
