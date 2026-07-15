import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppHeader } from "@/components/shared/app-header";
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex min-h-full">
        <AppSidebar />
        <div className="flex min-h-full flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 px-4 pb-20 pt-6 md:px-8 md:pb-8">{children}</main>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
}
