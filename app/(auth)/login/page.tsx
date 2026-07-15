import Link from "next/link";
import { login } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MaskableInput } from "@/components/shared/maskable-input";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Giriş Yap</CardTitle>
        <CardDescription>Client Qualification OS hesabınıza giriş yapın.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <form action={login} className="space-y-4">
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
              autoComplete="current-password"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Giriş Yap
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Hesabınız yok mu?{" "}
          <Link href="/signup" className="underline underline-offset-4">
            Kayıt olun
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
