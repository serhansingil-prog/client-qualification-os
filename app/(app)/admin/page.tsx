import { redirect } from "next/navigation";
import { approveUser, rejectUser } from "@/app/(app)/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { formatDate } from "@/lib/dates";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const STATUS_LABELS: Record<string, string> = {
  pending: "Onay Bekliyor",
  approved: "Onaylı",
  rejected: "Reddedildi",
};

const STATUS_VARIANTS: Record<string, "outline" | "default" | "destructive"> = {
  pending: "outline",
  approved: "default",
  rejected: "destructive",
};

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>E-posta</TableHead>
              <TableHead>Kayıt Tarihi</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(profiles ?? []).map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.email}</TableCell>
                <TableCell>{formatDate(profile.created_at)}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[profile.status]}>
                    {STATUS_LABELS[profile.status]}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  {profile.status !== "approved" ? (
                    <form action={approveUser.bind(null, profile.id)}>
                      <Button type="submit" size="sm">
                        Onayla
                      </Button>
                    </form>
                  ) : null}
                  {profile.status !== "rejected" ? (
                    <form action={rejectUser.bind(null, profile.id)}>
                      <Button type="submit" size="sm" variant="outline">
                        Reddet
                      </Button>
                    </form>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/admin" />
      </CardFooter>
    </Card>
  );
}
