export function daysBetween(fromISODate: string, toISODate: string): number {
  const from = new Date(fromISODate);
  const to = new Date(toISODate);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return NaN;
  }
  const msPerDay = 1000 * 60 * 60 * 24;
  const fromUtc = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const toUtc = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((toUtc - fromUtc) / msPerDay);
}

export function isPastDate(isoDate: string, referenceISODate?: string): boolean {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return false;
  const reference = referenceISODate ? new Date(referenceISODate) : new Date();
  const dateUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const referenceUtc = Date.UTC(
    reference.getFullYear(),
    reference.getMonth(),
    reference.getDate()
  );
  return dateUtc < referenceUtc;
}

const APP_TIME_ZONE = "Europe/Istanbul";

export function formatDate(isoDate?: string): string {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: APP_TIME_ZONE,
  }).format(date);
}

export function formatDateTime(isoDate?: string): string {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: APP_TIME_ZONE,
  }).format(date);
}

export function formatDateShort(isoDate?: string): string {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: APP_TIME_ZONE,
  }).format(date);
}

export function nowISODate(): string {
  return new Date().toISOString();
}

export function isWithinLastNDays(isoDate: string, n: number, referenceISODate?: string): boolean {
  const reference = referenceISODate ?? nowISODate();
  const diff = daysBetween(isoDate, reference);
  return !Number.isNaN(diff) && diff >= 0 && diff <= n;
}

export function addDays(isoDate: string, days: number): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function monthKey(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "unknown";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
