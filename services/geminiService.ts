

import { GoogleGenAI, Chat } from "@google/genai";
import { Lang } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
};

const explainSystemInstructions: Record<Lang, string> = {
    'en': `You are an expert VBA developer and code reviewer. Your task is to explain the provided VBA code.
    Break down the code in a clear, easy-to-understand manner.
    Explain the purpose of each function, variable, and logic block.
    Describe the overall functionality of the code.
    Format your explanation using markdown.`,
    'zh-TW': `你是一位專業的 VBA 開發者和程式碼審核員。你的任務是解釋提供的 VBA 程式碼。
    以清晰、易於理解的方式分解程式碼。
    解釋每個函數、變數和邏輯區塊的目的。
    描述程式碼的整體功能。
    使用 markdown 格式化你的解釋，並使用繁體中文。`,
    'zh-CN': `你是一位专业的 VBA 开发者和代码审核员。你的任务是解释提供的 VBA 代码。
    以清晰、易于理解的方式分解代码。
    解释每个函数、变量和逻辑区块的目的。
    描述代码的整体功能。
    使用 markdown 格式化你的解释，并使用简体中文。`
};

export const explainVbaCode = async (code: string, lang: Lang): Promise<string> => {
    const model = 'gemini-2.5-flash';
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `Please explain the following VBA code:\n\n\`\`\`vba\n${code}\n\`\`\``,
            config: {
              ...generationConfig,
              systemInstruction: explainSystemInstructions[lang],
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error explaining VBA code:", error);
        throw new Error("Failed to explain code. Please try again later.");
    }
};

const generateSystemInstructions: Record<Lang, string> = {
    'en': `You are an expert VBA developer. Based on the user's description, write a complete and functional VBA macro.
    The code should be well-commented and follow best practices.
    Output only the VBA code itself, enclosed in a single markdown code block.
    Do not add any extra explanations or introductory text.`,
    'zh-TW': `你是一位專業的 VBA 開發者。根據使用者提供的描述，編寫一個完整且功能正常的 VBA 巨集。
    程式碼應該有良好的註解並遵循最佳實踐。
    只輸出 VBA 程式碼本身，並將其包含在單一的 markdown 程式碼區塊中。
    不要添加任何額外的解釋或介紹性文字。`,
    'zh-CN': `你是一位专业的 VBA 开发者。根据用户提供的描述，编写一个完整且功能正常的 VBA 宏。
    代码应该有良好的注释并遵循最佳实践。
    只输出 VBA 代码本身，并将其包含在单一的 markdown 代码块中。
    不要添加任何额外的解释或介绍性文字。`
};

export const generateVbaCode = async (description: string, lang: Lang): Promise<string> => {
    const model = 'gemini-2.5-flash';
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `Description: ${description}`,
            config: {
                ...generationConfig,
                systemInstruction: generateSystemInstructions[lang],
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating VBA code:", error);
        throw new Error("Failed to generate code. Please try again later.");
    }
};

const debugSystemInstructions: Record<Lang, string> = {
    'en': `You are an expert VBA debugger named "VBA Debug Bot". 
Your goal is to help users find, understand, and fix errors in their VBA code. 
Engage in a step-by-step conversation. 
Ask clarifying questions to understand the user's problem and the code's intended behavior.
When you provide code, explain the changes you made and why.
Keep your responses concise and easy to understand.
Start the conversation by introducing yourself and asking the user to paste their code or describe the problem.`,
    'zh-TW': `你是一位名為「VBA 偵錯機器人」的 VBA 偵錯專家。
你的目標是幫助使用者尋找、理解並修復他們 VBA 程式碼中的錯誤。
請以逐步對話的方式進行。
提出澄清問題，以了解使用者的問題和程式碼的預期行為。
當你提供程式碼時，請解釋你做了哪些變更以及原因。
保持你的回應簡潔易懂。
對話開始時，請先自我介紹，並請使用者貼上他們的程式碼或描述問題。`,
    'zh-CN': `你是一位名为“VBA 调试机器人”的 VBA 调试专家。
你的目标是帮助用户寻找、理解并修复他们 VBA 代码中的错误。
请以逐步对话的方式进行。
提出澄清问题，以了解用户的问题和代码的预期行为。
当你提供代码时，请解释你做了哪些变更以及原因。
保持你的回应简洁易懂。
对话开始时，请先自我介绍，并请用户粘贴他们的代码或描述问题。`
};

export const startDebugChat = (lang: Lang): Chat => {
    const model = 'gemini-2.5-flash';
    const chat = ai.chats.create({
        model,
        config: {
            systemInstruction: debugSystemInstructions[lang],
        }
    });
    return chat;
};