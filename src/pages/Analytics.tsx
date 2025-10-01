import { useState, useMemo } from "react";
import { useAppContext } from "@/lib/AppContext";
import { dataService } from "@/lib/dataService";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { DateRangePicker } from "@/components/Analytics/DateRangePicker";
import { AnalyticsSummaryTable, SummaryRow } from "@/components/Analytics/AnalyticsSummaryTable";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet } from "lucide-react";
import { exportSummaryToPdf, exportSummaryToExcel } from "@/lib/export/summaryExporter";

const Analytics = () => {
  const { formatCurrency } = useAppContext();
  
  // Initialize date range to current year
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const now = new Date();
    return {
      from: new Date(now.getFullYear(), 0, 1),
      to: now,
    };
  });

  // Generate summary data from transactions
  const summaryData = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) {
      return { rows: [], totalIncome: 0, totalExpense: 0 };
    }

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
  }, [dateRange]);

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Select a period to view income and expenses summary
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportPdf}
              disabled={!dateRange?.from || !dateRange?.to || summaryData.rows.length === 0}
              className="flex-1 sm:flex-none"
            >
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              onClick={handleExportExcel}
              disabled={!dateRange?.from || !dateRange?.to || summaryData.rows.length === 0}
              className="flex-1 sm:flex-none"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
          </div>
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
