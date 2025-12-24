import { Home, PiggyBank, Wallet, BarChart3, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Wallet, label: "Expenses", path: "/expenses" },
  { icon: PiggyBank, label: "Income", path: "/income" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function MobileBottomNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full py-2 px-1 transition-colors touch-manipulation",
              "min-w-[56px] max-w-[80px]",
              isActive(item.path)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground active:text-primary"
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5 mb-1 transition-transform",
                isActive(item.path) && "scale-110"
              )}
            />
            <span
              className={cn(
                "text-[10px] font-medium truncate",
                isActive(item.path) && "font-semibold"
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
