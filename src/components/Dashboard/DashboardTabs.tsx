
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCharts } from "@/components/Dashboard/DashboardCharts";
import { RecentTransactions } from "@/components/Dashboard/RecentTransactions";
import { Card } from "@/components/ui/card";

export function DashboardTabs() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <DashboardCharts />
        
        <RecentTransactions />
      </TabsContent>
      
      <TabsContent value="analytics">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Analytics</h3>
          <p className="text-muted-foreground">Detailed analytics will be available here in the next version.</p>
        </Card>
      </TabsContent>
      
      <TabsContent value="reports">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Reports</h3>
          <p className="text-muted-foreground">Generated reports will be available here in the next version.</p>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
