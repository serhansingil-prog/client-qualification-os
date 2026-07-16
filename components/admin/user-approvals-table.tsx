"use client";

import { useState } from "react";
import { Archive } from "lucide-react";
import { approveUser, archiveUsers, rejectUser } from "@/app/(app)/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { MaskedEmail } from "@/components/shared/masked-email";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/dates";

interface Profile {
  id: string;
  email: string;
  status: string;
  created_at: string;
}

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

interface UserApprovalsTableProps {
  profiles: Profile[];
}

export function UserApprovalsTable({ profiles }: UserApprovalsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const selectableIds = profiles.filter((p) => p.status !== "pending").map((p) => p.id);
  const allSelected = selectableIds.length > 0 && selectedIds.length === selectableIds.length;

  function toggleSelectAll() {
    setSelectedIds(allSelected ? [] : selectableIds);
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleArchive() {
    const ids = selectedIds;
    setSelectedIds([]);
    await archiveUsers(ids);
  }

  return (
    <div className="space-y-3">
      {selectedIds.length > 0 ? (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setConfirmOpen(true)}>
            <Archive className="h-4 w-4" aria-hidden="true" />
            Arşivle ({selectedIds.length})
          </Button>
        </div>
      ) : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleSelectAll}
                disabled={selectableIds.length === 0}
                aria-label="Tümünü seç"
              />
            </TableHead>
            <TableHead>E-posta</TableHead>
            <TableHead>Kayıt Tarihi</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead className="text-right">İşlem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(profile.id)}
                  onCheckedChange={() => toggleSelect(profile.id)}
                  disabled={profile.status === "pending"}
                  aria-label={`${profile.email} seç`}
                />
              </TableCell>
              <TableCell>
                <MaskedEmail email={profile.email} />
              </TableCell>
              <TableCell>{formatDateTime(profile.created_at)}</TableCell>
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

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Seçilen kullanıcıları arşivle"
        description={`${selectedIds.length} kullanıcı bu listeden gizlenecek. Hesaplar silinmez, verileri Supabase'de kalmaya devam eder.`}
        confirmLabel="Arşivle"
        destructive={false}
        onConfirm={handleArchive}
      />
    </div>
  );
}
