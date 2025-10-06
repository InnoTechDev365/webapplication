
import { ExportDialog } from "@/components/Analytics/ExportDialog";
import { ImportDialog } from "@/components/Analytics/ImportDialog";

interface AnalyticsActionsProps {
  trendData: any[];
  savingsData: any[];
  pieChartData: any[];
}

export function AnalyticsActions({ trendData, savingsData, pieChartData }: AnalyticsActionsProps) {
  const handleImport = (data: any[]) => {
    console.log("Imported data:", data);
    // This component is not currently used in the app
    // Import functionality is handled in the main Analytics page
  };

  return (
    <div className="flex flex-wrap gap-2">
      <ExportDialog
        trendData={trendData}
        savingsData={savingsData}
        pieChartData={pieChartData}
      />
      <ImportDialog onImport={handleImport} />
    </div>
  );
}
