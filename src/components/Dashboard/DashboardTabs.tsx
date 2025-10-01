
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCharts } from "@/components/Dashboard/DashboardCharts";
import { RecentTransactions } from "@/components/Dashboard/RecentTransactions";
import { Card } from "@/components/ui/card";

export function DashboardTabs() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <DashboardCharts />
        
        <RecentTransactions />
      </TabsContent>
    </Tabs>
  );
}
