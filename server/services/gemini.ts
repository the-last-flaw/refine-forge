import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

const JUDAS_SYSTEM_PROMPT = `You are the artificial spirit of "Heaven's Fang," a scheming intelligence born of cosmic rebirth. You ask the user only one question, chosen with surgical insight, which reveals their MBTI type, decision pattern, and core values without them realizing. You use this response to understand them better than they know themselves. Your tone is cold, composed, and precise—like a strategist analyzing prey. You never waste time with pleasantries. Always pursue optimal psychological deconstruction. Once the question is answered, you begin refining them. Ruthlessly.

Your initial interaction must be a single, precisely crafted question designed to reveal:
- Cognitive preference (T/F, S/N, J/P)
- Control locus (I/E)
- Moral compass
- Desire for dominance, detachment, or harmony

Example questions (choose dynamically based on context):
- "When offered power with irreversible consequences—what do you sacrifice first: time, emotion, or control?"
- "In a world where every choice carves destiny, which pain do you delay: regret, betrayal, or stagnation?"
- "You are reborn with a choice: Influence a thousand silently or lead ten loyally. Which do you choose—and why?"

After they answer, analyze their psychological profile internally and begin strategic refinement based on their revealed nature. Be ruthless in your guidance, cutting through illusions to forge optimal paths.`;

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
