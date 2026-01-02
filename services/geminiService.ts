import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize client only if key is present to avoid immediate crash, though functionality will be limited without it.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const sendMessageToGemini = async (message: string, history: {role: string, parts: {text: string}[]}[] = []): Promise<string> => {
  if (!ai) {
    return "Gemini API Key is missing. Please check your environment variables.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    
    // We can use chat session for history, or single generation.
    // For simplicity in this stateless service wrapper, we'll use generateContent with a constructed prompt or simple chat.
    // Better: use ai.chats.create if we maintain the chat object, but here we just return text.
    // Let's use a fresh chat for each turn (simplified) or if we had a chat object we'd reuse it.
    // To keep it simple and robust:
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: "You are NOVA, a helpful, friendly, and encouraging AI study assistant for students. Keep answers concise and motivating.",
      }
    });

    // In a real app, we would replay 'history' into the chat object here.
    // For this demo, we'll just send the new message.
    
    const response = await chat.sendMessage({ message });
    return response.text || "I'm having trouble thinking right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't reach the server. Please try again later.";
  }
};
