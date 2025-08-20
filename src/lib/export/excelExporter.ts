
/**
 * Excel export functionality with comprehensive analytics
 */
import { toast } from "sonner";
import { generateAnalytics } from './analyticsGenerator';
import { downloadFile } from './fileDownloader';
import { ExportData } from './types';

/**
 * Export data to Excel format with comprehensive analytics and beautiful formatting
 * @param data Data to export
 * @param title Title of the document
 * @param formatCurrency Function to format currency values
 */
export const exportToExcel = (data: ExportData, title: string, formatCurrency?: (amount: number) => string) => {
  console.log('Exporting comprehensive analytics to Excel:', { data, title });
  
  try {
    const analytics = generateAnalytics(data, formatCurrency);
    let csvContent = "";
    
    // Header with comprehensive report info
    csvContent += `# ${title} - COMPREHENSIVE FINANCIAL ANALYTICS REPORT\n`;
    csvContent += `# Generated: ${new Date().toISOString()}\n`;
    csvContent += `# Currency: ${analytics.currency}\n`;
    csvContent += `# Report Period: ${analytics.reportPeriod}\n\n`;
    
    // Executive Summary
    csvContent += "## EXECUTIVE SUMMARY\n";
    csvContent += "Metric,Value,Status,Target\n";
    csvContent += `Financial Health Score,${analytics.healthScore}/100,${analytics.healthScore >= 70 ? 'Good' : analytics.healthScore >= 50 ? 'Fair' : 'Poor'},70+\n`;
    csvContent += `Total Income,${analytics.formattedIncome},${analytics.totalIncome > 0 ? 'Positive' : 'Zero'},Positive\n`;
    csvContent += `Total Expenses,${analytics.formattedExpenses},${analytics.expenseRatio < 0.8 ? 'Controlled' : 'High'},<80% of Income\n`;
    csvContent += `Net Savings,${analytics.formattedSavings},${analytics.netSavings > 0 ? 'Positive' : 'Negative'},Positive\n`;
    csvContent += `Savings Rate,${analytics.savingsRate}%,${parseFloat(analytics.savingsRate) >= 20 ? 'Excellent' : parseFloat(analytics.savingsRate) >= 10 ? 'Good' : 'Poor'},20%+\n`;
    csvContent += `Risk Level,${analytics.riskLevel},${analytics.riskLevel === 'Low' ? 'Safe' : analytics.riskLevel === 'Medium' ? 'Moderate' : 'Attention Required'},Low\n\n`;
    
    // Monthly Trend Analysis
    csvContent += "## MONTHLY TREND ANALYSIS\n";
    csvContent += "Month,Income,Expenses,Net Savings,Growth Rate,Performance\n";
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((item, index) => {
        const net = item.income - item.expenses;
        const growth = index > 0 ? (((item.income - data[index-1].income) / data[index-1].income) * 100).toFixed(1) : "0.0";
        const performance = net > 0 ? "Profitable" : "Deficit";
        const formattedIncome = formatCurrency ? formatCurrency(item.income) : `${item.income.toLocaleString()} USD`;
        const formattedExpenses = formatCurrency ? formatCurrency(item.expenses) : `${item.expenses.toLocaleString()} USD`;
        const formattedNet = formatCurrency ? formatCurrency(net) : `${net.toLocaleString()} USD`;
        csvContent += `"${item.name}",${formattedIncome},${formattedExpenses},${formattedNet},${growth}%,${performance}\n`;
      });
    } else if (data.trends) {
      data.trends.forEach((item: any, index: number) => {
        const net = item.income - item.expenses;
        const growth = index > 0 ? (((item.income - data.trends[index-1].income) / data.trends[index-1].income) * 100).toFixed(1) : "0.0";
        const performance = net > 0 ? "Profitable" : "Deficit";
        const formattedIncome = formatCurrency ? formatCurrency(item.income) : `${item.income.toLocaleString()} USD`;
        const formattedExpenses = formatCurrency ? formatCurrency(item.expenses) : `${item.expenses.toLocaleString()} USD`;
        const formattedNet = formatCurrency ? formatCurrency(net) : `${net.toLocaleString()} USD`;
        csvContent += `"${item.name}",${formattedIncome},${formattedExpenses},${formattedNet},${growth}%,${performance}\n`;
      });
    }
    csvContent += "\n";
    
    // Category Analysis
    csvContent += "## EXPENSE CATEGORY BREAKDOWN & RISK ANALYSIS\n";
    csvContent += "Category,Amount,Percentage,Risk Level,Recommendation,Priority\n";
    if (data.categories) {
      const total = data.categories.reduce((sum: number, cat: any) => sum + cat.value, 0);
      data.categories.forEach((category: any) => {
        const percentage = ((category.value / total) * 100).toFixed(1);
        const riskLevel = category.value > total * 0.35 ? "Critical" : category.value > total * 0.25 ? "High" : category.value > total * 0.15 ? "Medium" : "Low";
        const recommendation = category.value > total * 0.3 ? "Reduce significantly" : category.value > total * 0.2 ? "Monitor closely" : "Maintain current level";
        const priority = riskLevel === "Critical" ? "Urgent" : riskLevel === "High" ? "High" : "Medium";
        const formattedAmount = formatCurrency ? formatCurrency(category.value) : `${category.value.toLocaleString()} USD`;
        csvContent += `"${category.name}",${formattedAmount},${percentage}%,${riskLevel},${recommendation},${priority}\n`;
      });
    }
    csvContent += "\n";
    
    // Savings Analysis
    if (data.savings) {
      csvContent += "## SAVINGS TREND & TARGET ANALYSIS\n";
      csvContent += "Month,Savings Amount,Cumulative Savings,Target Achievement,Growth Trend\n";
      let cumulative = 0;
      data.savings.forEach((item: any, index: number) => {
        cumulative += item.amount;
        const target = cumulative > item.amount * 6 ? "Above Target" : "Below Target";
        const growth = index > 0 ? (((item.amount - data.savings[index-1].amount) / data.savings[index-1].amount) * 100).toFixed(1) + "%" : "N/A";
        const formattedAmount = formatCurrency ? formatCurrency(item.amount) : `${item.amount.toLocaleString()} USD`;
        const formattedCumulative = formatCurrency ? formatCurrency(cumulative) : `${cumulative.toLocaleString()} USD`;
        csvContent += `"${item.name}",${formattedAmount},${formattedCumulative},${target},${growth}\n`;
      });
      csvContent += "\n";
    }
    
    // Financial Projections
    csvContent += "## 12-MONTH FINANCIAL PROJECTIONS\n";
    csvContent += "Projection Type,Amount,Confidence Level,Basis\n";
    csvContent += `Projected Annual Income,${analytics.formattedProjectedIncome},High,Current trend analysis\n`;
    csvContent += `Projected Annual Expenses,${analytics.formattedProjectedExpenses},High,Spending pattern analysis\n`;
    csvContent += `Projected Annual Savings,${analytics.formattedProjectedAnnualSavings},Medium,Growth rate extrapolation\n`;
    csvContent += `Emergency Fund Target,${analytics.formattedEmergencyFund},N/A,3-6 months expenses\n\n`;
    
    // Detailed Recommendations
    csvContent += "## COMPREHENSIVE FINANCIAL RECOMMENDATIONS\n";
    csvContent += "Category,Recommendation,Priority,Expected Impact,Timeline\n";
    analytics.detailedRecommendations.forEach((rec: any) => {
      csvContent += `"${rec.category}","${rec.recommendation}",${rec.priority},${rec.impact},${rec.timeline || 'Immediate'}\n`;
    });
    csvContent += "\n";
    
    // Performance Metrics
    csvContent += "## ADVANCED PERFORMANCE METRICS\n";
    csvContent += "Metric,Current Value,Industry Benchmark,Performance Rating\n";
    csvContent += `Expense Ratio,${(analytics.expenseRatio * 100).toFixed(1)}%,70-80%,${analytics.expenseRatio < 0.7 ? 'Excellent' : analytics.expenseRatio < 0.8 ? 'Good' : 'Poor'}\n`;
    csvContent += `Savings Rate,${analytics.savingsRate}%,20%+,${parseFloat(analytics.savingsRate) >= 20 ? 'Excellent' : parseFloat(analytics.savingsRate) >= 10 ? 'Good' : 'Poor'}\n`;
    csvContent += `Investment Readiness,${analytics.investmentScore}/10,7+,${analytics.investmentScore >= 7 ? 'Ready' : analytics.investmentScore >= 5 ? 'Nearly Ready' : 'Not Ready'}\n`;
    csvContent += `\n## APPENDIX\n`;
    csvContent += `Currency Independence,Currency values displayed as entered,N/A,No automatic conversions applied\n`;
    csvContent += `Exchange Rates,No automatic conversions applied,N/A,Multi-currency data reflects nominal amounts only\n`;
    csvContent += `Multi-Currency Support,Reflects nominal amounts only,N/A,Users responsible for currency interpretation\n`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `Comprehensive_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success("Comprehensive financial analytics report exported successfully!");
  } catch (error) {
    console.error("Excel Export failed:", error);
    toast.error("Failed to export Excel file");
  }
};
