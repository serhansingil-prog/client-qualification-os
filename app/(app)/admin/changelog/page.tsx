import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { CHANGELOG_ENTRIES } from "@/lib/changelog";
import { formatDate } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 5;

export default async function ChangelogPage({
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
  const to = from + PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(CHANGELOG_ENTRIES.length / PAGE_SIZE));
  const pageEntries = CHANGELOG_ENTRIES.slice(from, to);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Değişiklik Günlüğü</CardTitle>
        <CardDescription>Uygulamada yapılan geliştirmelerin kronolojik listesi.</CardDescription>
        <CardAction>
          <Button nativeButton={false} variant="outline" size="sm" render={<Link href="/admin">Admin&apos;e Dön</Link>} />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        {pageEntries.map((entry) => (
          <div key={entry.title} className="rounded-lg border p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={entry.type === "major" ? "default" : "outline"}>
                {entry.type === "major" ? "Major" : "Minor"}
              </Badge>
              <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
            </div>
            <p className="mt-2 text-sm font-medium">{entry.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/admin/changelog" />
      </CardFooter>
    </Card>
  );
}
