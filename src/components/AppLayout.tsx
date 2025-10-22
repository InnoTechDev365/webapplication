
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { CurrencySelector } from "@/components/CurrencySelector";

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="border-b h-14 sm:h-16 flex items-center px-4 sm:px-6 sticky top-0 bg-background z-10 shrink-0">
            <SidebarTrigger className="touch-target" />
            <div className="flex-1"></div>
            <div className="flex items-center gap-2 sm:gap-4">
              <CurrencySelector />
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="text-xs sm:text-sm font-medium">JD</span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
