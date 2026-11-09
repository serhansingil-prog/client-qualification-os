"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getApiKey, setApiKey } from "@/lib/api-key-store";
import { useUser } from "@/hooks/use-user";

// -webkit-text-security masks the value with CSS instead of type="password",
// so Chrome/Edge never recognize this as a credential field and never
// overlay their own native reveal-eye on top of ours (that native icon sits
// outside our DOM, ignores our click handler, and was the cause of the
// "can't close it" bug reported against the plain MaskableInput here).
const maskedStyle: React.CSSProperties & { WebkitTextSecurity?: string } = {
  WebkitTextSecurity: "disc",
};

export function ApiKeyCard() {
  const { user, isLoaded: userLoaded } = useUser();
  const [value, setValue] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  // Key only exists in localStorage, unknown until mounted on the client;
  // same hydration-safe pattern as ThemeToggle in app-header.tsx.
  useEffect(() => {
    if (!userLoaded || !user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(getApiKey(user.id));
    setLoaded(true);
  }, [userLoaded, user]);

  function handleBlur() {
    if (!user) return;
    setApiKey(user.id, value);
    toast.success(value ? "API anahtarı bu tarayıcıda kaydedildi." : "API anahtarı temizlendi.");
  }

  if (!loaded) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Sesli Özet (BYOK)</CardTitle>
        <CardDescription>
          Değerlendirmeleri sesli özetlemek için kendi Anthropic API anahtarınızı girin. Bu
          anahtar yalnızca bu tarayıcıda saklanır; sunucuya veya veritabanına hiç kaydedilmez.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Label htmlFor="anthropicApiKey">Anthropic API anahtarı</Label>
        <div className="relative">
          <Input
            id="anthropicApiKey"
            type="text"
            autoComplete="off"
            placeholder="sk-ant-..."
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onBlur={handleBlur}
            className={cn("pr-8")}
            style={visible ? undefined : maskedStyle}
          />
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            className="absolute inset-y-0 right-0 flex w-8 items-center justify-center text-muted-foreground hover:text-foreground"
            aria-label={visible ? "Gizle" : "Göster"}
          >
            {visible ? (
              <Eye className="h-4 w-4" aria-hidden="true" />
            ) : (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
