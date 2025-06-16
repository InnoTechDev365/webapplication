
/**
 * Generate comprehensive analytics from financial data
 */
import { ExportData, AnalyticsResult, RecommendationItem } from './types';

/**
 * Generate comprehensive analytics from financial data
 * @param data Raw financial data
 * @param formatCurrency Function to format currency values
 * @returns Comprehensive analytics object
 */
export function generateAnalytics(data: ExportData, formatCurrency?: (amount: number) => string): AnalyticsResult {
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
  const expenseRatio = totalIncome > 0 ? totalExpenses / totalIncome : 0;
  
  // Currency formatting with currency codes
  const defaultFormatter = (amount: number) => `${amount.toLocaleString()} USD`;
  const currencyFormatter = formatCurrency || defaultFormatter;
  
  // Calculate monthly growth
  let monthlyGrowth = 0;
  if (monthlyData.length > 1) {
    const firstMonth = monthlyData[0].income || 0;
    const lastMonth = monthlyData[monthlyData.length - 1].income || 0;
    monthlyGrowth = firstMonth > 0 ? parseFloat(((lastMonth - firstMonth) / firstMonth * 100).toFixed(1)) : 0;
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
  let healthScore = 30; // Base score
  if (netSavings > 0) healthScore += 25;
  if (parseFloat(savingsRate) > 10) healthScore += 15;
  if (parseFloat(savingsRate) > 20) healthScore += 15;
  if (monthlyGrowth > 0) healthScore += 10;
  if (expenseRatio < 0.8) healthScore += 5;
  
  // Risk assessment
  let riskLevel = "Medium";
  if (parseFloat(savingsRate) < 5 || expenseRatio > 0.9) riskLevel = "High";
  else if (parseFloat(savingsRate) > 20 && expenseRatio < 0.7) riskLevel = "Low";
  
  // Advanced calculations
  const avgMonthlySavings = netSavings / (monthlyData.length || 1);
  const projectedSavings = avgMonthlySavings * 6;
  const projectedAnnualIncome = (totalIncome / (monthlyData.length || 1)) * 12;
  const projectedAnnualExpenses = (totalExpenses / (monthlyData.length || 1)) * 12;
  const projectedAnnualSavings = projectedAnnualIncome - projectedAnnualExpenses;
  const emergencyFund = (totalExpenses / (monthlyData.length || 1)) * 6; // 6 months expenses
  const avgMonthlyNet = avgMonthlySavings;
  
  // Investment readiness score (0-10)
  let investmentScore = 0;
  if (parseFloat(savingsRate) > 20) investmentScore += 3;
  else if (parseFloat(savingsRate) > 10) investmentScore += 2;
  if (emergencyFund <= netSavings) investmentScore += 3;
  if (expenseRatio < 0.7) investmentScore += 2;
  if (monthlyGrowth > 5) investmentScore += 2;
  
  // Optimization potential
  const optimizationPotential = categories.length > 0 ? 
    `${((categories.filter(cat => cat.value > totalExpenses * 0.15).length / categories.length) * 100).toFixed(0)}% of categories need optimization` :
    "No category data available";
  
  // Report period
  const reportPeriod = monthlyData.length > 0 ? 
    `${monthlyData[0].name} - ${monthlyData[monthlyData.length - 1].name} (${monthlyData.length} months)` :
    "Current period";
  
  // Currency detection - only USD and EUR supported
  const currency = formatCurrency ? 
    (formatCurrency(1000).includes('EUR') ? 'EUR' : 'USD') : 
    'USD';
  
  // Generate recommendations
  const detailedRecommendations: RecommendationItem[] = [
    {
      category: "Savings Optimization",
      recommendation: parseFloat(savingsRate) < 20 ? "Increase savings rate to 20% through expense reduction and income growth" : "Maintain excellent savings rate and consider investment opportunities",
      priority: parseFloat(savingsRate) < 10 ? "Critical" : parseFloat(savingsRate) < 20 ? "High" : "Medium",
      impact: "High",
      timeline: "1-3 months"
    },
    {
      category: "Expense Management",
      recommendation: expenseRatio > 0.8 ? "Reduce expenses by focusing on largest categories and eliminating non-essential spending" : "Continue disciplined expense management",
      priority: expenseRatio > 0.9 ? "Critical" : expenseRatio > 0.8 ? "High" : "Low",
      impact: "High",
      timeline: "Immediate"
    },
    {
      category: "Income Growth",
      recommendation: monthlyGrowth < 0 ? "Focus on income diversification and growth strategies" : "Maintain current income growth trajectory",
      priority: monthlyGrowth < -5 ? "Critical" : monthlyGrowth < 0 ? "High" : "Low",
      impact: "High",
      timeline: "3-6 months"
    },
    {
      category: "Emergency Fund",
      recommendation: netSavings < emergencyFund ? "Build emergency fund to cover 6 months of expenses" : "Emergency fund is adequate, consider investment opportunities",
      priority: netSavings < emergencyFund * 0.5 ? "High" : "Medium",
      impact: "Medium",
      timeline: "6-12 months"
    },
    {
      category: "Investment Readiness",
      recommendation: investmentScore < 5 ? "Focus on financial stability before investing" : investmentScore < 7 ? "Nearly ready for investments, strengthen emergency fund" : "Ready for diversified investment portfolio",
      priority: investmentScore < 5 ? "Low" : "Medium",
      impact: "Medium",
      timeline: "6+ months"
    }
  ];
  
  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    expenseRatio,
    monthlyGrowth,
    bestIncomeMonth,
    worstExpenseMonth,
    largestCategory,
    categoryDiversity,
    healthScore: Math.min(100, Math.max(0, healthScore)),
    riskLevel,
    projectedSavings,
    projectedAnnualIncome,
    projectedAnnualExpenses,
    projectedAnnualSavings,
    emergencyFund,
    avgMonthlyNet,
    investmentScore: Math.min(10, Math.max(0, investmentScore)),
    optimizationPotential,
    reportPeriod,
    currency,
    detailedRecommendations,
    // Formatted currency values with currency codes
    formattedIncome: currencyFormatter(totalIncome),
    formattedExpenses: currencyFormatter(totalExpenses),
    formattedSavings: currencyFormatter(netSavings),
    formattedProjectedSavings: currencyFormatter(projectedSavings),
    formattedProjectedIncome: currencyFormatter(projectedAnnualIncome),
    formattedProjectedExpenses: currencyFormatter(projectedAnnualExpenses),
    formattedProjectedAnnualSavings: currencyFormatter(projectedAnnualSavings),
    formattedEmergencyFund: currencyFormatter(emergencyFund),
    formattedAvgMonthlyNet: currencyFormatter(avgMonthlyNet),
    // PDF content
    monthlyBreakdown: monthlyData.map(item => {
      const net = item.income - item.expenses;
      const formattedIncome = currencyFormatter(item.income);
      const formattedExpenses = currencyFormatter(item.expenses);
      const formattedNet = currencyFormatter(net);
      return `0 -15 Td (${item.name}: Income ${formattedIncome}, Expenses ${formattedExpenses}, Net ${formattedNet}) Tj`;
    }).join('\n'),
    categoryAnalysis: categories.map(cat => {
      const formattedValue = currencyFormatter(cat.value);
      return `0 -15 Td (${cat.name}: ${formattedValue}) Tj`;
    }).join('\n'),
    recommendations: detailedRecommendations.slice(0, 3).map(rec => `0 -15 Td (• ${rec.recommendation}) Tj`).join('\n')
  };
}
