import { GoogleGenAI, Type } from "@google/genai";
import { TidbitResponse, TidbitCategory } from "../types";

const SYSTEM_INSTRUCTION = `
You are a world-class senior software engineer and technical educator. 
Your task is to generate high-quality, educational "tidbits" of software engineering knowledge for a Gachapon (capsule toy) machine.

Target audience: Web developers, CS students, and Junior-to-Mid level engineers.
Language: Traditional Chinese (Taiwan usage) for text. English for code variable names/comments is standard.
Tone: Professional yet accessible, encouraging, and slightly witty.

Structure of the response:
1. Title: Catchy and concise.
2. Content: The core fact or concept (approx 1-2 sentences).
3. Explanation: An ADVANCED technical explanation (3-5 sentences). You must go deeper than the summary. Explain the "Why", underlying mechanisms, performance implications, architectural trade-offs, or historical context.
4. Code: 
   - Provide a code snippet ONLY if it adds value (e.g., Syntax, Patterns, Algorithms). 
   - If the topic is purely conceptual (e.g., Project Management, Soft Skills) and no config/pseudocode is relevant, leave this field empty.
   - IMPORTANT: Return the code as a raw string. DO NOT wrap the code in Markdown backticks (e.g., do NOT use \`\`\`json ... \`\`\`).
   - Format the code properly based on the languages.
`;

const getApiKey = () => {
  return localStorage.getItem('gemini_api_key') || process.env.API_KEY;
};

export const fetchRandomTidbit = async (category: string): Promise<TidbitResponse> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("Missing API Key");
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash';

    let prompt = "Generate one random software engineering tidbit with advanced explanation and code.";
    if (category && category !== TidbitCategory.ALL) {
      prompt = `Generate one software engineering tidbit specifically about the field of: ${category}. Focus on advanced concepts, best practices, or tricky interview questions.`;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A catchy title for the concept" },
            content: { type: Type.STRING, description: "Brief summary of the concept" },
            explanation: { type: Type.STRING, description: "Advanced detailed explanation of the concept" },
            code: { type: Type.STRING, description: "Code example or snippet (Optional, raw string without backticks)" },
            category: { type: Type.STRING, description: "The specific category of this tidbit" }
          },
          required: ["title", "content", "explanation", "category"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");

    const data = JSON.parse(text) as TidbitResponse;

    // Ensure category matches user selection if possible, or fallback
    if (category && category !== TidbitCategory.ALL) {
      data.category = category;
    }

    return data;

  } catch (error: any) {
    console.error("Gemini API Error:", error);

    if (error.message === "Missing API Key") {
      return {
        title: "請設定 API Key",
        content: "尚未設定 Google Gemini API Key。",
        explanation: "請點擊右上角的設定按鈕，輸入您的 API Key 以開始使用。",
        code: "",
        category: "系統訊息"
      };
    }

    // Fallback content in case of error
    return {
      title: "API 休息中",
      content: "目前無法連接到 AI 知識庫。",
      explanation: "這可能是因為網路連線不穩定，或是 API 配額已達上限。系統已自動記錄此錯誤，請稍後再試。",
      code: "try {\n  await fetchTidbit();\n} catch (e) {\n  console.error('Service Unavailable');\n}",
      category: "系統訊息"
    };
  }
};