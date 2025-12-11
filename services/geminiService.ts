import { GoogleGenAI } from "@google/genai";
import { AppState } from "../types";

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
// Assume this variable is pre-configured, valid, and accessible.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFinancialAdvice = async (data: AppState): Promise<string> => {
  const summary = {
    totalBalance: data.accounts.reduce((sum, acc) => sum + acc.balance, 0),
    transactionCount: data.transactions.length,
    recentTransactions: data.transactions.slice(0, 5),
    topHoldings: data.portfolio.sort((a, b) => (b.currentPrice * b.quantity) - (a.currentPrice * a.quantity)).slice(0, 3),
  };

  const prompt = `
    你是一位專業的個人財務顧問。請根據以下使用者的財務數據摘要提供簡短、具體的財務建議與分析（約 200 字）：
    
    總資產: ${summary.totalBalance}
    近期交易: ${JSON.stringify(summary.recentTransactions)}
    主要持股: ${JSON.stringify(summary.topHoldings)}

    請包含以下幾點：
    1. 資產配置健康度簡評。
    2. 對近期支出的觀察（若有）。
    3. 投資組合的簡單建議。
    請使用繁體中文回答，語氣專業且親切。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "無法生成建議。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 服務暫時無法使用，請稍後再試。";
  }
};