import Link from "next/link";
import { signup } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MaskableInput } from "@/components/shared/maskable-input";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Kayıt Ol</CardTitle>
        <CardDescription>Client Qualification OS için yeni bir hesap oluşturun.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          Bu uygulama bir pilot demodur. Kayıtlar yönetici onayına bağlıdır ve gerçek müşteri ya da kişisel
          veri girmemelisiniz. Denemek için kayıt olmadan Demo Modu&apos;nu kullanabilirsiniz.
        </p>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <form action={signup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <MaskableInput id="email" name="email" type="email" autoComplete="off" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <MaskableInput
              id="password"
              name="password"
              type="text"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Kayıt Ol
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Zaten bir hesabınız var mı?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Giriş yapın
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
