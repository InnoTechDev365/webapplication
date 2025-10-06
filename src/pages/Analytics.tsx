import { useState, useMemo } from "react";
import { useAppContext } from "@/lib/AppContext";
import { dataService } from "@/lib/dataService";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { DateRangePicker } from "@/components/Analytics/DateRangePicker";
import { AnalyticsSummaryTable, SummaryRow } from "@/components/Analytics/AnalyticsSummaryTable";
import { ImportDialog } from "@/components/Analytics/ImportDialog";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Download } from "lucide-react";
import { exportSummaryToPdf, exportSummaryToExcel } from "@/lib/export/summaryExporter";
import { toast } from "sonner";

const Analytics = () => {
  const { formatCurrency } = useAppContext();
  const [importedData, setImportedData] = useState<SummaryRow[]>([]);
  
  // Initialize date range to current year
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const now = new Date();
    return {
      from: new Date(now.getFullYear(), 0, 1),
      to: now,
    };
  });

  // Generate summary data from transactions or imported data
  const summaryData = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) {
      return { rows: [], totalIncome: 0, totalExpense: 0 };
    }

    // Use imported data if available
    if (importedData.length > 0) {
      const totalIncome = importedData.reduce((sum, row) => sum + row.income, 0);
      const totalExpense = importedData.reduce((sum, row) => sum + row.expense, 0);
      return { rows: importedData, totalIncome, totalExpense };
    }

    // Otherwise, use transactions from database
    const transactions = dataService.getTransactionsByDateRange(
      dateRange.from,
      dateRange.to
    );

    const rows: SummaryRow[] = transactions.map((transaction) => {
      const category = dataService.getCategoryById(transaction.category);
      return {
        date: format(new Date(transaction.date), "MMM dd, yyyy"),
        description: transaction.description || "No description",
        category: category?.name || "Uncategorized",
        income: transaction.type === "income" ? transaction.amount : 0,
        expense: transaction.type === "expense" ? transaction.amount : 0,
      };
    });

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return { rows, totalIncome, totalExpense };
  }, [dateRange, importedData]);

  const handleExportPdf = () => {
    if (!dateRange?.from || !dateRange?.to) return;
    
    exportSummaryToPdf(
      {
        rows: summaryData.rows,
        totalIncome: summaryData.totalIncome,
        totalExpense: summaryData.totalExpense,
        startDate: format(dateRange.from, "MMM dd, yyyy"),
        endDate: format(dateRange.to, "MMM dd, yyyy"),
      },
      formatCurrency
    );
  };

  const handleExportExcel = () => {
    if (!dateRange?.from || !dateRange?.to) return;
    
    exportSummaryToExcel(
      {
        rows: summaryData.rows,
        totalIncome: summaryData.totalIncome,
        totalExpense: summaryData.totalExpense,
        startDate: format(dateRange.from, "MMM dd, yyyy"),
        endDate: format(dateRange.to, "MMM dd, yyyy"),
      },
      formatCurrency
    );
  };

  const handleImport = (data: SummaryRow[]) => {
    setImportedData(data);
    toast.success("Data imported successfully. Showing imported data instead of database transactions.");
  };

  const handleClearImport = () => {
    setImportedData([]);
    toast.info("Cleared imported data. Showing database transactions.");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Select a period to view income and expenses summary
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2 flex-1">
              <Button
                variant="outline"
                onClick={handleExportPdf}
                disabled={!dateRange?.from || !dateRange?.to || summaryData.rows.length === 0}
                className="flex-1 sm:flex-none"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Export PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleExportExcel}
                disabled={!dateRange?.from || !dateRange?.to || summaryData.rows.length === 0}
                className="flex-1 sm:flex-none"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">CSV</span>
              </Button>
            </div>
            
            <div className="flex gap-2 flex-1 sm:flex-none">
              <ImportDialog onImport={handleImport} />
              {importedData.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleClearImport}
                  className="flex-1 sm:flex-none"
                >
                  <Download className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Clear Import</span>
                  <span className="sm:hidden">Clear</span>
                </Button>
              )}
            </div>
          </div>

          {importedData.length > 0 && (
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border">
              <p>📥 Showing imported data ({importedData.length} transactions). Click "Clear Import" to view database transactions.</p>
            </div>
          )}
        </div>
      </div>

      <AnalyticsSummaryTable
        data={summaryData.rows}
        totalIncome={summaryData.totalIncome}
        totalExpense={summaryData.totalExpense}
      />
    </div>
  );
};

export default Analytics;
