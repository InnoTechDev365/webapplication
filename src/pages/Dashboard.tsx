
import { StatCards } from "@/components/Dashboard/StatCards";
import { DashboardTabs } from "@/components/Dashboard/DashboardTabs";

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Track your personal finances at a glance</p>
      </div>

      <StatCards />
      <DashboardTabs />
    </div>
  );
};

export default Dashboard;
