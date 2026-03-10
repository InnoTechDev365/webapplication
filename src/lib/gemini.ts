import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function getFinancialAdvice(
  transactions: any[],
  budgets: any[],
  goals: any[]
) {
  if (!genAI) return "AI recommendations are unavailable without an API key.";

  const model = "gemini-3-flash-preview";
  
  const prompt = `
    As a financial advisor, analyze the following financial data and provide 3 concise, actionable recommendations for achieving the user's goals.
    
    Transactions (last 30 days): ${JSON.stringify(transactions.slice(0, 20))}
    Budgets: ${JSON.stringify(budgets)}
    Goals: ${JSON.stringify(goals)}
    
    Format the response as a JSON array of strings.
  `;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error getting financial advice:", error);
    return ["Focus on tracking your expenses consistently.", "Set realistic monthly budgets.", "Prioritize your high-impact financial goals."];
  }
}
