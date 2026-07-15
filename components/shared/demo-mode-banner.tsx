"use client";

import { FlaskConical } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useDemoMode } from "@/hooks/use-demo-mode";

export function DemoModeBanner() {
  const { setDemoMode } = useDemoMode();

  return (
    <Alert className="mb-6 border-primary/30 bg-primary/5">
      <FlaskConical className="h-4 w-4" />
      <AlertTitle>Demo modundasınız</AlertTitle>
      <AlertDescription>
        Gösterilen veriler örnek verilerdir; gerçek değerlendirmeleriniz bu görünümde listelenmez.
      </AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline" onClick={() => setDemoMode(false)}>
          Demo Modundan Çık
        </Button>
      </AlertAction>
    </Alert>
  );
}
