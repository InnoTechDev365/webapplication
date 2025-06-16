
/**
 * Types for export functionality
 */
export interface ExportData {
  trends?: any[];
  savings?: any[];
  categories?: any[];
}

export interface AnalyticsResult {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: string;
  expenseRatio: number;
  monthlyGrowth: number;
  bestIncomeMonth: string;
  worstExpenseMonth: string;
  largestCategory: string;
  categoryDiversity: number;
  healthScore: number;
  riskLevel: string;
  projectedSavings: number;
  projectedAnnualIncome: number;
  projectedAnnualExpenses: number;
  projectedAnnualSavings: number;
  emergencyFund: number;
  avgMonthlyNet: number;
  investmentScore: number;
  optimizationPotential: string;
  reportPeriod: string;
  currency: string;
  detailedRecommendations: RecommendationItem[];
  formattedIncome: string;
  formattedExpenses: string;
  formattedSavings: string;
  formattedProjectedSavings: string;
  formattedProjectedIncome: string;
  formattedProjectedExpenses: string;
  formattedProjectedAnnualSavings: string;
  formattedEmergencyFund: string;
  formattedAvgMonthlyNet: string;
  monthlyBreakdown: string;
  categoryAnalysis: string;
  recommendations: string;
}

export interface RecommendationItem {
  category: string;
  recommendation: string;
  priority: string;
  impact: string;
  timeline?: string;
}
