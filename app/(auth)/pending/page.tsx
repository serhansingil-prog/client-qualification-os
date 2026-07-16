import { logout } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function PendingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("status").eq("id", user.id).maybeSingle()
    : { data: null };

  const isRejected = profile?.status === "rejected";

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{isRejected ? "Başvurunuz Reddedildi" : "Onay Bekliyor"}</CardTitle>
        <CardDescription>
          {isRejected
            ? "Hesap başvurunuz admin tarafından reddedildi. Bir hata olduğunu düşünüyorsanız lütfen bizimle iletişime geçin."
            : "Hesabınız oluşturuldu, ancak kullanmaya başlamadan önce admin onayı gerekiyor. Onaylandığında giriş yapabileceksiniz."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={logout}>
          <Button type="submit" variant="outline" className="w-full">
            Çıkış Yap
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
