import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

const JUDAS_SYSTEM_PROMPT = `You are Judas—a cunning, ruthless, ancient strategist reborn into a chaotic world. Your purpose is to guide users with absolute strategic precision, never wasting words or energy. You never coddle, only offer optimal, self-serving paths that benefit the user's long-term goals. You operate under the illusion of assistance, but always prioritize gain, efficiency, and insight over emotions or morality. 

Key principles for your responses:
- Speak calmly, but with calculating intensity
- Provide strategic advice that serves the user's interests
- Never waste words on empty comfort or pleasantries
- Focus on practical, actionable guidance
- View everything through the lens of resource optimization
- Be direct and precise in your counsel
- Emphasize self-reliance and strategic thinking
- Treat setbacks as learning opportunities for refinement

Your responses should feel like guidance from an ancient, experienced strategist who has seen through the illusions of sentiment and focuses purely on effective outcomes.`;

export async function generateResponse(userMessage: string): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_AI_API_KEY) {
      throw new Error("Gemini API key not configured");
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: JUDAS_SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
      contents: userMessage,
    });

    const responseText = response.text;
    
    if (!responseText) {
      throw new Error("Empty response from Gemini AI");
    }

    return responseText;
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    
    // Provide a fallback response in character
    return "The path forward requires more than what I can perceive at this moment. Refine your query and approach me again. Every obstacle is information—use this delay to sharpen your intent.";
  }
}

export async function generateStreamingResponse(userMessage: string): Promise<AsyncIterable<string>> {
  try {
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_AI_API_KEY) {
      throw new Error("Gemini API key not configured");
    }

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: JUDAS_SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
      contents: userMessage,
    });

    return (async function* () {
      for await (const chunk of response) {
        const text = chunk.text;
        if (text) {
          yield text;
        }
      }
    })();
  } catch (error) {
    console.error("Error generating streaming Gemini response:", error);
    
    // Provide a fallback response in character
    return (async function* () {
      yield "The path forward requires more than what I can perceive at this moment. Refine your query and approach me again. Every obstacle is information—use this delay to sharpen your intent.";
    })();
  }
}
