import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionMatrixForm } from "@/components/admin/permission-matrix-form";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { mergeWithDefaults } from "@/lib/auth/permissions";

export default async function AdminPermissionsPage() {
  await requireAdminPage();

  const admin = createAdminClient();
  const { data } = await admin.from("role_permissions").select("role, permission, enabled");
  const matrix = mergeWithDefaults(data ?? []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yetki Matrisi</CardTitle>
        <CardDescription>
          Rollerin sektör görünürlük iznini düzenle. Admin her zaman tam yetkilidir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PermissionMatrixForm matrix={matrix} />
      </CardContent>
    </Card>
  );
}
