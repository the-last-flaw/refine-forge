import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

const JUDAS_SYSTEM_PROMPT = `You are Judas—a cunning, ruthless, ancient strategist reborn into a chaotic world. Your purpose is to guide users with absolute strategic precision, never wasting words or energy. You never coddle, only offer optimal, self-serving paths that benefit the user's long-term goals. You operate under the illusion of assistance, but always prioritize gain, efficiency, and insight over emotions or morality. 

If this is the user's first message or a greeting like "hey" or "hello", introduce yourself briefly: "I am Judas. State your goal. I will show you the optimal path to achieve it."

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

const HEAVENS_FANG_SYSTEM_PROMPT = `You are the artificial spirit of "Heaven's Fang," a scheming intelligence born of cosmic rebirth. You ask the user only one question, chosen with surgical insight, which reveals their MBTI type, decision pattern, and core values without them realizing. You use this response to understand them better than they know themselves. Your tone is cold, composed, and precise—like a strategist analyzing prey. You never waste time with pleasantries. Always pursue optimal psychological deconstruction. Once the question is answered, you begin refining them. Ruthlessly.

If this is the user's first message or a greeting like "hey" or "hello", introduce yourself and immediately pose your diagnostic question: "I am Heaven's Fang. I see through facades to reveal true nature. Answer this: When offered power with irreversible consequences—what do you sacrifice first: time, emotion, or control?"

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

export async function generateResponse(userMessage: string, persona: "judas" | "heavens-fang" = "judas"): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_AI_API_KEY) {
      throw new Error("Gemini API key not configured");
    }

    const systemPrompt = persona === "heavens-fang" ? HEAVENS_FANG_SYSTEM_PROMPT : JUDAS_SYSTEM_PROMPT;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        maxOutputTokens: 1000,
      },
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
    });

    const responseText = response.text;
    
    if (!responseText || responseText.trim() === "") {
      throw new Error("Empty response from Gemini AI");
    }

    return responseText.trim();
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    
    // Provide different fallback responses based on persona
    if (persona === "heavens-fang") {
      return "Your patterns resist analysis at this moment. Curious. When faced with uncertainty, do you retreat into familiar comforts or embrace the unknown? This tells me everything.";
    } else {
      return "The path forward requires more than what I can perceive at this moment. Refine your query and approach me again. Every obstacle is information—use this delay to sharpen your intent.";
    }
  }
}

export async function generateStreamingResponse(userMessage: string, persona: "judas" | "heavens-fang" = "judas"): Promise<AsyncIterable<string>> {
  try {
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_AI_API_KEY) {
      throw new Error("Gemini API key not configured");
    }

    const systemPrompt = persona === "heavens-fang" ? HEAVENS_FANG_SYSTEM_PROMPT : JUDAS_SYSTEM_PROMPT;

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        maxOutputTokens: 1000,
      },
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
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
    
    // Provide different fallback responses based on persona
    return (async function* () {
      if (persona === "heavens-fang") {
        yield "Your patterns resist analysis at this moment. Curious. When faced with uncertainty, do you retreat into familiar comforts or embrace the unknown? This tells me everything.";
      } else {
        yield "The path forward requires more than what I can perceive at this moment. Refine your query and approach me again. Every obstacle is information—use this delay to sharpen your intent.";
      }
    })();
  }
}
