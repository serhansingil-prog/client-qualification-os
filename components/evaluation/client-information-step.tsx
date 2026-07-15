"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { LEAD_SOURCES, SALES_STAGES } from "@/types/evaluation";
import { clientInformationSchema, type ClientInformationFormValues } from "@/lib/validation";

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];
const COMPANY_SIZE_ITEMS = Object.fromEntries(
  COMPANY_SIZES.map((size) => [size, `${size} çalışan`])
);

export interface ClientInformationStepHandle {
  validateAndSubmit: () => Promise<ClientInformationFormValues | null>;
}

interface ClientInformationStepProps {
  defaultValues: ClientInformationFormValues;
  onChange: (values: ClientInformationFormValues) => void;
}

export const ClientInformationStep = forwardRef<ClientInformationStepHandle, ClientInformationStepProps>(
  function ClientInformationStep({ defaultValues, onChange }, ref) {
    const form = useForm<ClientInformationFormValues>({
      resolver: zodResolver(clientInformationSchema),
      defaultValues,
      mode: "onBlur",
    });

    const {
      register,
      control,
      handleSubmit,
      watch,
      formState: { errors },
    } = form;

    useEffect(() => {
      const subscription = watch((values) => {
        onChange(values as ClientInformationFormValues);
      });
      return () => subscription.unsubscribe();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch]);

    useImperativeHandle(ref, () => ({
      validateAndSubmit: () =>
        new Promise((resolve) => {
          handleSubmit(
            (values) => resolve(values),
            () => resolve(null)
          )();
        }),
    }));

    return (
      <form className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Müşteri ve İletişim Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientName">Müşteri adı *</Label>
              <Input id="clientName" {...register("clientName")} aria-invalid={!!errors.clientName} />
              {errors.clientName ? (
                <p className="text-sm text-destructive">{errors.clientName.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Şirket adı</Label>
              <Input id="companyName" {...register("companyName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">İletişim kişisi</Label>
              <Input id="contactName" {...register("contactName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
              {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Web sitesi</Label>
              <Input id="website" {...register("website")} aria-invalid={!!errors.website} />
              {errors.website ? <p className="text-sm text-destructive">{errors.website.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Sektör</Label>
              <Input id="industry" {...register("industry")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companySize">Şirket büyüklüğü</Label>
              <Controller
                control={control}
                name="companySize"
                render={({ field }) => (
                  <Select
                    items={COMPANY_SIZE_ITEMS}
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="companySize" className="w-full">
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_SIZES.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size} çalışan
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Proje Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="projectName">Proje adı *</Label>
              <Input id="projectName" {...register("projectName")} aria-invalid={!!errors.projectName} />
              {errors.projectName ? (
                <p className="text-sm text-destructive">{errors.projectName.message}</p>
              ) : null}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="projectDescription">Proje açıklaması</Label>
              <Textarea id="projectDescription" rows={3} {...register("projectDescription")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requestedService">Talep edilen hizmet</Label>
              <Input id="requestedService" {...register("requestedService")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bütçe ve Zaman Çizelgesi</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="estimatedBudget">Tahmini proje bütçesi</Label>
              <Input
                id="estimatedBudget"
                type="number"
                min={0}
                step="0.01"
                {...register("estimatedBudget", {
                  setValueAs: (value) => (value === "" ? undefined : Number(value)),
                })}
                aria-invalid={!!errors.estimatedBudget}
              />
              {errors.estimatedBudget ? (
                <p className="text-sm text-destructive">{errors.estimatedBudget.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Para birimi *</Label>
              <Controller
                control={control}
                name="currency"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="currency" className="w-full" aria-invalid={!!errors.currency}>
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.currency ? <p className="text-sm text-destructive">{errors.currency.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyRetainer">Tahmini aylık destek bütçesi</Label>
              <Input
                id="monthlyRetainer"
                type="number"
                min={0}
                step="0.01"
                {...register("monthlyRetainer", {
                  setValueAs: (value) => (value === "" ? undefined : Number(value)),
                })}
                aria-invalid={!!errors.monthlyRetainer}
              />
              {errors.monthlyRetainer ? (
                <p className="text-sm text-destructive">{errors.monthlyRetainer.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="inquiryDate">İlk iletişim tarihi *</Label>
              <Input
                id="inquiryDate"
                type="date"
                {...register("inquiryDate")}
                aria-invalid={!!errors.inquiryDate}
              />
              {errors.inquiryDate ? (
                <p className="text-sm text-destructive">{errors.inquiryDate.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="requestedDeliveryDate">Talep edilen teslim tarihi</Label>
              <Input
                id="requestedDeliveryDate"
                type="date"
                {...register("requestedDeliveryDate")}
                aria-invalid={!!errors.requestedDeliveryDate}
              />
              {errors.requestedDeliveryDate ? (
                <p className="text-sm text-destructive">{errors.requestedDeliveryDate.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="potentialStartDate">Potansiyel başlangıç tarihi</Label>
              <Input id="potentialStartDate" type="date" {...register("potentialStartDate")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kaynak ve Notlar</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="leadSource">Müşteri kaynağı</Label>
              <Controller
                control={control}
                name="leadSource"
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger id="leadSource" className="w-full">
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_SOURCES.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salesStage">Satış aşaması</Label>
              <Controller
                control={control}
                name="salesStage"
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger id="salesStage" className="w-full">
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      {SALES_STAGES.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="generalNotes">Genel notlar</Label>
              <Textarea id="generalNotes" rows={3} {...register("generalNotes")} />
            </div>
          </CardContent>
        </Card>
      </form>
    );
  }
);
