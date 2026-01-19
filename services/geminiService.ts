
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
          location: { type: Type.STRING, description: "Detailed neighborhood and city. NO PLACEHOLDERS." },
          pricePerNight: { type: Type.NUMBER, description: "Current market rate in INR. MUST be > 0." },
          totalPrice: { type: Type.NUMBER, description: "Total for the duration. MUST be > 0." },
          image: { 
            type: Type.STRING, 
            description: "A UNIQUE, DIRECT, high-resolution URL to a real photo. Use actual deep links found in search. Every hotel MUST have a different image." 
          },
          bookingUrl: { 
            type: Type.STRING, 
            description: "The official website link for the hotel property." 
          },
          description: { type: Type.STRING, description: "Engaging 2-sentence summary." },
          whyPerfect: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 reasons why this matches Indian preferences." },
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
                platform: { type: Type.STRING, description: "e.g., 'MakeMyTrip', 'Booking.com', 'Agoda'." },
                price: { type: Type.NUMBER },
                url: { type: Type.STRING, description: "The DEEP LINK to the specific hotel listing. If a direct deep link is not found, provide a platform-specific search URL for this hotel name. DO NOT provide generic homepages like 'booking.com'." },
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
 * Validates environment and initializes the Google GenAI client.
 * Uses process.env.API_KEY exclusively as required.
 */
function getAI() {
  // Check both process.env and common fallback patterns for Vite/Vercel client-side availability
  // while strictly using the name API_KEY as per system instructions.
  const apiKey = (typeof process !== 'undefined' && process.env) 
    ? (process.env.API_KEY || (process.env as any).NEXT_PUBLIC_API_KEY) 
    : undefined;

  if (!apiKey) {
    throw new Error("CRITICAL_CONFIG_ERROR: The 'API_KEY' environment variable is missing or inaccessible in the current environment node.");
  }
  
  return new GoogleGenAI({ apiKey });
}

export async function searchHotels(userInput: string) {
  try {
    const ai = getAI();
    const prompt = `
      OPERATIONAL COMMAND: Deploy TravelCrew AI Agents to research and extract booking data for: "${userInput}".

      STRICT URL & DATA QUALITY PROTOCOLS:
      1. GROUNDING: Use Google Search to find REAL properties, LIVE prices, and working URLs.
      2. URL DEEP-LINKING: For 'comparisons', the 'url' MUST NOT be a generic homepage. It must be a specific URL that leads the user directly to this hotel's details on that platform.
      3. RECOVERY: If a direct deep link is unavailable, construct a platform search URL.
      4. IMAGE DIVERSITY: Each hotel must have a unique, high-quality image URL.
      5. INDIAN CONTEXT: Focus on Indian users—prioritize MakeMyTrip prices where possible.

      MISSION: Return 3 highly-vetted options (Best, Value, Premium) as JSON.
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
    throw error;
  }
}

export async function chatWithCrew(userInput: string, context: Hotel[]) {
  try {
    const ai = getAI();
    const prompt = `
      You are the TravelCrew AI Hub. 
      Research results: ${JSON.stringify(context)}
      User Query: "${userInput}"
      
      Assist the user based on the researched data. If URLs are requested, explain which platform offers the best value.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "The communication link is experiencing high latency. Please retry the command.";
  }
}
