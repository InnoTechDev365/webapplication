import { toast } from "sonner";
import { downloadFile } from "./fileDownloader";
import type { SummaryRow } from "@/components/Analytics/AnalyticsSummaryTable";

interface SummaryExportData {
  rows: SummaryRow[];
  totalIncome: number;
  totalExpense: number;
  startDate: string;
  endDate: string;
}

export function exportSummaryToPdf(
  data: SummaryExportData,
  formatCurrency: (amount: number) => string
) {
  try {
    const { rows, totalIncome, totalExpense, startDate, endDate } = data;
    const balance = totalIncome - totalExpense;

    // Create PDF content as formatted text
    let content = `INCOME & EXPENSES SUMMARY REPORT\n`;
    content += `Period: ${startDate} - ${endDate}\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `${"=".repeat(80)}\n\n`;

    // Table header
    content += `${"Date".padEnd(12)} ${"Description".padEnd(25)} ${"Category".padEnd(20)} ${"Income".padStart(12)} ${"Expense".padStart(12)}\n`;
    content += `${"-".repeat(80)}\n`;

    // Table rows
    rows.forEach((row) => {
      const date = row.date.padEnd(12);
      const desc = row.description.padEnd(25).substring(0, 25);
      const cat = row.category.padEnd(20).substring(0, 20);
      const inc = row.income > 0 ? formatCurrency(row.income).padStart(12) : "-".padStart(12);
      const exp = row.expense > 0 ? formatCurrency(row.expense).padStart(12) : "-".padStart(12);
      content += `${date} ${desc} ${cat} ${inc} ${exp}\n`;
    });

    // Footer
    content += `${"-".repeat(80)}\n`;
    content += `${"TOTAL".padEnd(57)} ${formatCurrency(totalIncome).padStart(12)} ${formatCurrency(totalExpense).padStart(12)}\n`;
    content += `${"BALANCE".padEnd(69)} ${formatCurrency(balance).padStart(12)}\n`;
    content += `${"=".repeat(80)}\n\n`;

    content += `Report Summary:\n`;
    content += `- Total Income: ${formatCurrency(totalIncome)}\n`;
    content += `- Total Expenses: ${formatCurrency(totalExpense)}\n`;
    content += `- Net Balance: ${formatCurrency(balance)}\n`;
    content += `- Number of Transactions: ${rows.length}\n`;

    const blob = new Blob([content], { type: "text/plain" });
    const filename = `analytics-summary-${startDate}-to-${endDate}.txt`;
    downloadFile(blob, filename);

    toast.success("PDF report exported successfully");
  } catch (error) {
    console.error("Export to PDF failed:", error);
    toast.error("Failed to export PDF report");
  }
}

export function exportSummaryToExcel(
  data: SummaryExportData,
  formatCurrency: (amount: number) => string
) {
  try {
    const { rows, totalIncome, totalExpense, startDate, endDate } = data;
    const balance = totalIncome - totalExpense;

    // Create CSV content
    let csv = `Income & Expenses Summary Report\n`;
    csv += `Period,${startDate} - ${endDate}\n`;
    csv += `Generated,${new Date().toLocaleString()}\n`;
    csv += `\n`;

    // Header
    csv += `Date,Description,Category,Income,Expense\n`;

    // Data rows
    rows.forEach((row) => {
      const date = row.date;
      const desc = `"${row.description.replace(/"/g, '""')}"`;
      const cat = `"${row.category.replace(/"/g, '""')}"`;
      const inc = row.income > 0 ? row.income : "";
      const exp = row.expense > 0 ? row.expense : "";
      csv += `${date},${desc},${cat},${inc},${exp}\n`;
    });

    // Totals
    csv += `\n`;
    csv += `TOTAL,,,${totalIncome},${totalExpense}\n`;
    csv += `BALANCE,,,${balance},\n`;

    // Summary
    csv += `\n`;
    csv += `Report Summary\n`;
    csv += `Total Income,${formatCurrency(totalIncome)}\n`;
    csv += `Total Expenses,${formatCurrency(totalExpense)}\n`;
    csv += `Net Balance,${formatCurrency(balance)}\n`;
    csv += `Number of Transactions,${rows.length}\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const filename = `analytics-summary-${startDate}-to-${endDate}.csv`;
    downloadFile(blob, filename);

    toast.success("Excel report exported successfully");
  } catch (error) {
    console.error("Export to Excel failed:", error);
    toast.error("Failed to export Excel report");
  }
}