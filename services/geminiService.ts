
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
};

export const explainVbaCode = async (code: string): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `你是一位專業的 VBA 開發者和程式碼審核員。你的任務是解釋提供的 VBA 程式碼。
    以清晰、易於理解的方式分解程式碼。
    解釋每個函數、變數和邏輯區塊的目的。
    描述程式碼的整體功能。
    使用 markdown 格式化你的解釋，並使用繁體中文。`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: `請解釋以下 VBA 程式碼:\n\n\`\`\`vba\n${code}\n\`\`\``,
            config: {
              ...generationConfig,
              systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error explaining VBA code:", error);
        throw new Error("無法解釋程式碼。請稍後再試。");
    }
};

export const generateVbaCode = async (description: string): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `你是一位專業的 VBA 開發者。根據使用者提供的描述，編寫一個完整且功能正常的 VBA 巨集。
    程式碼應該有良好的註解並遵循最佳實踐。
    只輸出 VBA 程式碼本身，並將其包含在單一的 markdown 程式碼區塊中。
    不要添加任何額外的解釋或介紹性文字。`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: `描述: ${description}`,
            config: {
                ...generationConfig,
                systemInstruction,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating VBA code:", error);
        throw new Error("無法生成程式碼。請稍後再試。");
    }
};
