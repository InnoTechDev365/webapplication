
import { ExportDialog } from "@/components/Analytics/ExportDialog";
import { ImportDialog } from "@/components/Analytics/ImportDialog";

interface AnalyticsActionsProps {
  trendData: any[];
  savingsData: any[];
  pieChartData: any[];
}

export function AnalyticsActions({ trendData, savingsData, pieChartData }: AnalyticsActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <ExportDialog
        trendData={trendData}
        savingsData={savingsData}
        pieChartData={pieChartData}
      />
      <ImportDialog />
    </div>
  );
}
