
import { GoogleGenAI, Type } from "@google/genai";
import { Hotel } from "../types";

const HOTEL_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    hotels: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          rating: { type: Type.NUMBER },
          location: { type: Type.STRING, description: "Detailed neighborhood and city." },
          pricePerNight: { type: Type.NUMBER },
          totalPrice: { type: Type.NUMBER },
          image: { type: Type.STRING },
          bookingUrl: { type: Type.STRING },
          description: { type: Type.STRING },
          whyPerfect: { type: Type.ARRAY, items: { type: Type.STRING } },
          aiAnalysis: {
            type: Type.OBJECT,
            properties: {
              positive: { type: Type.ARRAY, items: { type: Type.STRING } },
              concerns: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["positive", "concerns"]
          },
          inclusions: { type: Type.ARRAY, items: { type: Type.STRING } },
          comparisons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                price: { type: Type.NUMBER },
                url: { type: Type.STRING },
                isBest: { type: Type.BOOLEAN }
              },
              required: ["platform", "price", "url"]
            }
          },
          tag: { type: Type.STRING }
        },
        required: [
          "id", "name", "rating", "location", "pricePerNight", "totalPrice", 
          "image", "bookingUrl", "description", "whyPerfect", "aiAnalysis", 
          "inclusions", "comparisons", "tag"
        ]
      }
    }
  },
  required: ["hotels"]
};

/**
 * Robust AI Initialization
 * Accesses API_KEY dynamically from the process shim to ensure runtime availability.
 */
function getAIInstance() {
  // Use bracket notation to prevent bundler static analysis/replacement
  const apiKey = (window as any).process?.env?.API_KEY || (process.env as any)?.API_KEY;

  if (!apiKey || apiKey === 'undefined') {
    throw new Error("MISSION_NODE_UNAVAILABLE");
  }
  
  return new GoogleGenAI({ apiKey });
}

export async function searchHotels(userInput: string) {
  try {
    const ai = getAIInstance();
    const prompt = `
      OPERATIONAL COMMAND: Deploy TravelCrew AI Agents for: "${userInput}".
      STRICT URL PROTOCOLS: Use Google Search to find REAL property deep links.
      MISSION: Return 3 vetted options (Best, Value, Premium) as JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: HOTEL_SCHEMA,
        tools: [{ googleSearch: {} }]
      },
    });

    const responseText = response.text;
    if (!responseText) throw new Error("Agent search produced null results.");

    const json = JSON.parse(responseText);
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || 'System Data Node',
        uri: chunk.web?.uri || ''
      })).filter((s: any) => s.uri) || [];

    return { ...json, sources };
  } catch (error: any) {
    console.error("AI Service Error:", error);
    if (error.message === "MISSION_NODE_UNAVAILABLE") {
      throw new Error("MAINTENANCE_REQUIRED: Environmental synchronization failed. Ensure API_KEY is set in Vercel.");
    }
    throw error;
  }
}

export async function chatWithCrew(userInput: string, context: Hotel[]) {
  try {
    const ai = getAIInstance();
    const prompt = `
      You are the TravelCrew AI Hub. 
      Context: ${JSON.stringify(context)}
      Query: "${userInput}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "The communication link is experiencing high latency.";
  }
}
