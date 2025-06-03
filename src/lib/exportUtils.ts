
/**
 * Utility functions for exporting financial data with comprehensive analytics
 */
import { toast } from "sonner";

/**
 * Export data to PDF format with comprehensive analytics and beautiful formatting
 * @param data Data to export
 * @param title Title of the document
 */
export const exportToPdf = (data: any, title: string) => {
  console.log('Exporting comprehensive analytics to PDF:', { data, title });
  
  try {
    // Generate comprehensive analytics
    const analytics = generateAnalytics(data);
    
    // Create beautifully formatted PDF content with analytics
    const pdfContent = `%PDF-1.5
1 0 obj
<</Type /Catalog /Pages 2 0 R>>
endobj
2 0 obj
<</Type /Pages /Kids [3 0 R 4 0 R 5 0 R] /Count 3>>
endobj
3 0 obj
<</Type /Page /Parent 2 0 R /Resources 6 0 R /MediaBox [0 0 612 792] /Contents 7 0 R>>
endobj
4 0 obj
<</Type /Page /Parent 2 0 R /Resources 6 0 R /MediaBox [0 0 612 792] /Contents 8 0 R>>
endobj
5 0 obj
<</Type /Page /Parent 2 0 R /Resources 6 0 R /MediaBox [0 0 612 792] /Contents 9 0 R>>
endobj
6 0 obj
<</Font <</F1 10 0 R /F2 11 0 R>>>>
endobj
7 0 obj
<</Length 800>>
stream
BT
/F1 20 Tf
50 720 Td
(${title}) Tj
/F1 12 Tf
0 -30 Td
(Generated: ${new Date().toLocaleDateString()}) Tj
0 -40 Td
(EXECUTIVE SUMMARY) Tj
/F2 10 Tf
0 -25 Td
(Total Income: $${analytics.totalIncome.toLocaleString()}) Tj
0 -15 Td
(Total Expenses: $${analytics.totalExpenses.toLocaleString()}) Tj
0 -15 Td
(Net Savings: $${analytics.netSavings.toLocaleString()}) Tj
0 -15 Td
(Savings Rate: ${analytics.savingsRate}%) Tj
0 -30 Td
(TREND ANALYSIS) Tj
0 -20 Td
(Monthly Growth Rate: ${analytics.monthlyGrowth}%) Tj
0 -15 Td
(Highest Income Month: ${analytics.bestIncomeMonth}) Tj
0 -15 Td
(Highest Expense Month: ${analytics.worstExpenseMonth}) Tj
0 -30 Td
(CATEGORY INSIGHTS) Tj
0 -20 Td
(Largest Expense Category: ${analytics.largestCategory}) Tj
0 -15 Td
(Category Diversity Index: ${analytics.categoryDiversity}) Tj
ET
endstream
endobj
8 0 obj
<</Length 600>>
stream
BT
/F1 16 Tf
50 720 Td
(DETAILED FINANCIAL DATA) Tj
/F2 10 Tf
0 -40 Td
(Monthly Income vs Expenses Breakdown:) Tj
${analytics.monthlyBreakdown}
0 -100 Td
(Expense Categories Analysis:) Tj
${analytics.categoryAnalysis}
ET
endstream
endobj
9 0 obj
<</Length 400>>
stream
BT
/F1 16 Tf
50 720 Td
(RECOMMENDATIONS & INSIGHTS) Tj
/F2 10 Tf
0 -40 Td
(Financial Health Score: ${analytics.healthScore}/100) Tj
0 -25 Td
(Key Recommendations:) Tj
${analytics.recommendations}
0 -80 Td
(Risk Assessment: ${analytics.riskLevel}) Tj
0 -20 Td
(Projected Savings (Next 6 months): $${analytics.projectedSavings.toLocaleString()}) Tj
ET
endstream
endobj
10 0 obj
<</Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold>>
endobj
11 0 obj
<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>
endobj
xref
0 12
0000000000 65535 f
0000000009 00000 n
0000000056 00000 n
0000000111 00000 n
0000000212 00000 n
0000000313 00000 n
0000000414 00000 n
0000000465 00000 n
0000001320 00000 n
0000001970 00000 n
0000002420 00000 n
0000002485 00000 n
trailer
<</Size 12 /Root 1 0 R>>
startxref
2545
%%EOF
`;
    
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    downloadFile(blob, `${title.replace(/\s+/g, '_')}_Analytics_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("Comprehensive analytics report exported to PDF successfully!");
  } catch (error) {
    console.error("PDF Export failed:", error);
    toast.error("Failed to export PDF report");
  }
};

/**
 * Export data to Excel format with comprehensive analytics and beautiful formatting
 * @param data Data to export
 * @param title Title of the document
 */
export const exportToExcel = (data: any, title: string) => {
  console.log('Exporting comprehensive analytics to Excel:', { data, title });
  
  try {
    const analytics = generateAnalytics(data);
    let csvContent = "";
    
    // Executive Summary Sheet
    csvContent += `# ${title} - COMPREHENSIVE FINANCIAL ANALYTICS\n`;
    csvContent += `# Generated: ${new Date().toISOString()}\n\n`;
    
    csvContent += "## EXECUTIVE SUMMARY\n";
    csvContent += "Metric,Value,Currency\n";
    csvContent += `Total Income,$${analytics.totalIncome.toLocaleString()},USD\n`;
    csvContent += `Total Expenses,$${analytics.totalExpenses.toLocaleString()},USD\n`;
    csvContent += `Net Savings,$${analytics.netSavings.toLocaleString()},USD\n`;
    csvContent += `Savings Rate,${analytics.savingsRate}%,Percentage\n`;
    csvContent += `Monthly Growth Rate,${analytics.monthlyGrowth}%,Percentage\n`;
    csvContent += `Financial Health Score,${analytics.healthScore}/100,Score\n\n`;
    
    // Trend Analysis
    csvContent += "## MONTHLY TREND ANALYSIS\n";
    if (Array.isArray(data) && data.length > 0) {
      csvContent += "Month,Income,Expenses,Net,Growth Rate\n";
      data.forEach((item, index) => {
        const growth = index > 0 ? (((item.income - data[index-1].income) / data[index-1].income) * 100).toFixed(1) : "0.0";
        csvContent += `"${item.name}",$${item.income.toLocaleString()},$${item.expenses.toLocaleString()},$${(item.income - item.expenses).toLocaleString()},${growth}%\n`;
      });
    } else if (data.trends) {
      csvContent += "Month,Income,Expenses,Net,Growth Rate\n";
      data.trends.forEach((item: any, index: number) => {
        const growth = index > 0 ? (((item.income - data.trends[index-1].income) / data.trends[index-1].income) * 100).toFixed(1) : "0.0";
        csvContent += `"${item.name}",$${item.income.toLocaleString()},$${item.expenses.toLocaleString()},$${(item.income - item.expenses).toLocaleString()},${growth}%\n`;
      });
    }
    csvContent += "\n";
    
    // Category Analysis
    csvContent += "## EXPENSE CATEGORY BREAKDOWN\n";
    if (data.categories) {
      csvContent += "Category,Amount,Percentage of Total,Risk Level\n";
      const total = data.categories.reduce((sum: number, cat: any) => sum + cat.value, 0);
      data.categories.forEach((category: any) => {
        const percentage = ((category.value / total) * 100).toFixed(1);
        const riskLevel = category.value > total * 0.3 ? "High" : category.value > total * 0.15 ? "Medium" : "Low";
        csvContent += `"${category.name}",$${category.value.toLocaleString()},${percentage}%,${riskLevel}\n`;
      });
    }
    csvContent += "\n";
    
    // Savings Analysis
    if (data.savings) {
      csvContent += "## SAVINGS TREND ANALYSIS\n";
      csvContent += "Month,Savings Amount,Cumulative Savings,Target Achievement\n";
      let cumulative = 0;
      data.savings.forEach((item: any) => {
        cumulative += item.amount;
        const target = cumulative > item.amount * 6 ? "Above Target" : "Below Target";
        csvContent += `"${item.name}",$${item.amount.toLocaleString()},$${cumulative.toLocaleString()},${target}\n`;
      });
      csvContent += "\n";
    }
    
    // Recommendations
    csvContent += "## FINANCIAL RECOMMENDATIONS\n";
    csvContent += "Category,Recommendation,Priority,Impact\n";
    analytics.detailedRecommendations.forEach((rec: any) => {
      csvContent += `"${rec.category}","${rec.recommendation}",${rec.priority},${rec.impact}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `${title.replace(/\s+/g, '_')}_Analytics_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success("Comprehensive analytics report exported to Excel successfully!");
  } catch (error) {
    console.error("Excel Export failed:", error);
    toast.error("Failed to export Excel file");
  }
};

/**
 * Generate comprehensive analytics from financial data
 * @param data Raw financial data
 * @returns Comprehensive analytics object
 */
function generateAnalytics(data: any) {
  let totalIncome = 0;
  let totalExpenses = 0;
  let monthlyData: any[] = [];
  let categories: any[] = [];
  
  // Process different data structures
  if (Array.isArray(data)) {
    monthlyData = data;
    totalIncome = data.reduce((sum, item) => sum + (item.income || 0), 0);
    totalExpenses = data.reduce((sum, item) => sum + (item.expenses || 0), 0);
  } else if (data.trends) {
    monthlyData = data.trends;
    totalIncome = data.trends.reduce((sum: number, item: any) => sum + (item.income || 0), 0);
    totalExpenses = data.trends.reduce((sum: number, item: any) => sum + (item.expenses || 0), 0);
    categories = data.categories || [];
  }
  
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : "0.0";
  
  // Calculate monthly growth
  let monthlyGrowth = 0;
  if (monthlyData.length > 1) {
    const firstMonth = monthlyData[0].income || 0;
    const lastMonth = monthlyData[monthlyData.length - 1].income || 0;
    monthlyGrowth = firstMonth > 0 ? (((lastMonth - firstMonth) / firstMonth) * 100).toFixed(1) : 0;
  }
  
  // Find best and worst months
  const bestIncomeMonth = monthlyData.reduce((prev, current) => 
    (prev.income > current.income) ? prev : current, monthlyData[0] || {}).name || "N/A";
  const worstExpenseMonth = monthlyData.reduce((prev, current) => 
    (prev.expenses > current.expenses) ? prev : current, monthlyData[0] || {}).name || "N/A";
  
  // Category analysis
  const largestCategory = categories.length > 0 ? 
    categories.reduce((prev, current) => (prev.value > current.value) ? prev : current).name : "N/A";
  const categoryDiversity = categories.length;
  
  // Financial health score (0-100)
  let healthScore = 50; // Base score
  if (netSavings > 0) healthScore += 20;
  if (parseFloat(savingsRate as string) > 20) healthScore += 15;
  if (parseFloat(savingsRate as string) > 30) healthScore += 10;
  if (monthlyGrowth > 0) healthScore += 5;
  
  // Risk assessment
  let riskLevel = "Medium";
  if (parseFloat(savingsRate as string) < 10) riskLevel = "High";
  else if (parseFloat(savingsRate as string) > 25) riskLevel = "Low";
  
  // Projected savings
  const avgMonthlySavings = netSavings / (monthlyData.length || 1);
  const projectedSavings = avgMonthlySavings * 6;
  
  // Generate recommendations
  const detailedRecommendations = [
    {
      category: "Savings",
      recommendation: parseFloat(savingsRate as string) < 20 ? "Increase savings rate to at least 20%" : "Maintain current savings rate",
      priority: parseFloat(savingsRate as string) < 20 ? "High" : "Medium",
      impact: "High"
    },
    {
      category: "Expenses",
      recommendation: "Review and optimize largest expense categories",
      priority: "Medium",
      impact: "Medium"
    },
    {
      category: "Income",
      recommendation: monthlyGrowth < 0 ? "Focus on income diversification" : "Continue current income strategy",
      priority: monthlyGrowth < 0 ? "High" : "Low",
      impact: "High"
    }
  ];
  
  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    monthlyGrowth,
    bestIncomeMonth,
    worstExpenseMonth,
    largestCategory,
    categoryDiversity,
    healthScore: Math.min(100, healthScore),
    riskLevel,
    projectedSavings,
    detailedRecommendations,
    monthlyBreakdown: monthlyData.map(item => `0 -15 Td (${item.name}: Income $${item.income?.toLocaleString() || '0'}, Expenses $${item.expenses?.toLocaleString() || '0'}) Tj`).join('\n'),
    categoryAnalysis: categories.map(cat => `0 -15 Td (${cat.name}: $${cat.value?.toLocaleString() || '0'}) Tj`).join('\n'),
    recommendations: detailedRecommendations.map(rec => `0 -15 Td (• ${rec.recommendation}) Tj`).join('\n')
  };
}

/**
 * Helper function to download a file in a cross-browser compatible way
 * @param blob The Blob containing file data
 * @param filename The name to save the file as
 */
function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}
