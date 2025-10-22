
import { StatCards } from "@/components/Dashboard/StatCards";
import { DashboardTabs } from "@/components/Dashboard/DashboardTabs";

const Dashboard = () => {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="heading-1">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Track your personal finances at a glance</p>
      </div>

      <StatCards />
      <DashboardTabs />
    </div>
  );
};

export default Dashboard;
