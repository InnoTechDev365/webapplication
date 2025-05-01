
import { Home, PiggyBank, Wallet, ChartBar, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { SupabaseConnector } from "@/components/SupabaseConnector";

export function AppSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Wallet, label: "Expenses", path: "/expenses" },
    { icon: PiggyBank, label: "Income", path: "/income" },
    { icon: ChartBar, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center gap-2 px-4 py-6">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-white/20 p-2">
            <PiggyBank className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-bold text-xl text-white">
            Expense<span className="text-finance-green-300">Coin</span>
          </h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <nav className="space-y-1 px-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "nav-link",
                isActive(item.path) && "active"
              )}
            >
              <item.icon className="h-5 w-5 text-white" />
              <span className="text-white">{item.label}</span>
            </Link>
          ))}
        </nav>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4">
          <SupabaseConnector />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
