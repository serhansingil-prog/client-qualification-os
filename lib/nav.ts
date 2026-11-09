import { BookOpen, ClipboardList, LayoutDashboard, PlusCircle, Settings } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Panel", icon: LayoutDashboard },
  { href: "/evaluations", label: "Değerlendirmeler", icon: ClipboardList },
  { href: "/evaluations/new", label: "Yeni Değerlendirme", icon: PlusCircle },
  { href: "/settings", label: "Ayarlar", icon: Settings },
  { href: "/guide", label: "Kullanım Kılavuzları", icon: BookOpen },
] as const;

/**
 * Resolves which nav item should be highlighted for a given pathname.
 * Picks the longest matching href so overlapping prefixes (e.g. "/evaluations"
 * vs "/evaluations/new") don't both light up at once.
 */
export function getActiveNavHref(pathname: string): string | undefined {
  const matches = NAV_ITEMS.filter((item) =>
    item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`)
  );
  if (matches.length === 0) return undefined;
  return matches.reduce((best, item) => (item.href.length > best.href.length ? item : best)).href;
}
