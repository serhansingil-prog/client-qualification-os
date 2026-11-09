"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES } from "@/lib/constants";
import { AGENCY_SECTION_LABELS, SECTOR_LABELS, SECTOR_TECH_STACK_DEFAULTS } from "@/lib/criteria";
import { useSectorPermission } from "@/hooks/use-sector-permission";
import type { AgencySettings, Sector } from "@/types/settings";

const ALL_SECTORS: Sector[] = ["automation", "ads", "real_estate"];

function sameItems(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}

interface AgencySettingsFormProps {
  settings: AgencySettings;
  onChange: (patch: Partial<AgencySettings>) => void;
}

export function AgencySettingsForm({ settings, onChange }: AgencySettingsFormProps) {
  const agencyLabels = AGENCY_SECTION_LABELS[settings.sector];
  const { allowedSectors } = useSectorPermission();
  const sectorOptions = allowedSectors ?? ALL_SECTORS;

  function handleSectorChange(sector: Sector) {
    const patch: Partial<AgencySettings> = { sector };
    // Only swap the tech stack examples / agency name if they're still
    // exactly the previous sector's untouched defaults — never overwrite
    // something the user has actually customized.
    if (sameItems(settings.standardTechStack, SECTOR_TECH_STACK_DEFAULTS[settings.sector])) {
      patch.standardTechStack = SECTOR_TECH_STACK_DEFAULTS[sector];
    }
    if (settings.agencyName === AGENCY_SECTION_LABELS[settings.sector].nameDefault) {
      patch.agencyName = AGENCY_SECTION_LABELS[sector].nameDefault;
    }
    onChange(patch);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{agencyLabels.cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="sector">Sektör</Label>
          <Select
            value={settings.sector}
            onValueChange={(value) => value && handleSectorChange(value as Sector)}
          >
            <SelectTrigger id="sector" className="w-full">
              <SelectValue>{(value: Sector) => SECTOR_LABELS[value]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {sectorOptions.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {SECTOR_LABELS[sector]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="agencyName">{agencyLabels.nameLabel}</Label>
          <Input
            id="agencyName"
            value={settings.agencyName}
            onChange={(event) => onChange({ agencyName: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="userName">Kullanıcı adı</Label>
          <Input
            id="userName"
            value={settings.userName}
            onChange={(event) => onChange({ userName: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="defaultCurrency">Varsayılan para birimi</Label>
          <Select
            value={settings.defaultCurrency}
            onValueChange={(value) => value && onChange({ defaultCurrency: value })}
          >
            <SelectTrigger id="defaultCurrency" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredContactChannel">Tercih edilen iletişim kanalı</Label>
          <Input
            id="preferredContactChannel"
            value={settings.preferredContactChannel}
            onChange={(event) => onChange({ preferredContactChannel: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="workingHours">Çalışma saatleri</Label>
          <Input
            id="workingHours"
            value={settings.workingHours}
            onChange={(event) => onChange({ workingHours: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="defaultSupportScope">Varsayılan destek kapsamı</Label>
          <Input
            id="defaultSupportScope"
            value={settings.defaultSupportScope}
            onChange={(event) => onChange({ defaultSupportScope: event.target.value })}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="idealClientProfile">İdeal müşteri profili</Label>
          <Textarea
            id="idealClientProfile"
            rows={3}
            value={settings.idealClientProfile}
            onChange={(event) => onChange({ idealClientProfile: event.target.value })}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="strategicFocusAreas">Stratejik odak alanları (virgülle ayırın)</Label>
          <Input
            id="strategicFocusAreas"
            value={settings.strategicFocusAreas.join(", ")}
            onChange={(event) =>
              onChange({
                strategicFocusAreas: event.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="messageSignature">Mesaj imzası</Label>
          <Textarea
            id="messageSignature"
            rows={2}
            value={settings.messageSignature}
            onChange={(event) => onChange({ messageSignature: event.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
