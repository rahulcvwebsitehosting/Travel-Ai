
import { GoogleGenAI, Type } from "@google/genai";
import { Hotel, GroundingSource } from "../types";

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
          location: { type: Type.STRING },
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
 * AI Initialization
 * Standard access to process.env.API_KEY.
 * Ensure your project has API_KEY defined in environment variables.
 */
function getAIInstance() {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === 'undefined') {
    throw new Error("IDENTITY_SYNC_FAILED");
  }
  
  return new GoogleGenAI({ apiKey });
}

/**
 * Executes a deep hotel search mission using specialized AI agents.
 * Leverages Google Search grounding for real-time market data and returns structured JSON.
 */
export async function searchHotels(userInput: string): Promise<{ hotels: Hotel[], sources: GroundingSource[] }> {
  try {
    const ai = getAIInstance();
    const prompt = `
      OPERATIONAL COMMAND: Deploy TravelCrew AI Agents for search: "${userInput}".
      
      MISSION OBJECTIVE: 
      Identify 3-5 premium hotel options in India (or the specified locale) that precisely match the user's intent.
      
      DATA REQUIREMENTS:
      - All financial values in INR (approximate market rates).
      - Realistic description of amenities.
      - Critical AI analysis of both positive attributes and potential concerns.
      - Verification of inclusions (WiFi, Breakfast, etc.).
      - Price comparisons across major platforms (MMT, Booking.com, Agoda).
      - Use 'tag' for categorizations like "BEST OVERALL", "PREMIUM CHOICE", or "BUDGET MATCH".
      
      STRICT URL PROTOCOLS: Provide direct search or property URLs where available.
    `;

    // Using gemini-3-pro-preview for complex reasoning and grounding tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: HOTEL_SCHEMA,
      },
    });

    const text = response.text;
    const data = JSON.parse(text || '{"hotels":[]}');
    const hotels: Hotel[] = data.hotels || [];
    
    // Extract grounding sources from search results to display in UI
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || 'Verified Source',
        uri: chunk.web.uri
      }));

    return { hotels, sources };
  } catch (error) {
    console.error("DEPLOYMENT_FAULT: Hotel search failed:", error);
    throw error;
  }
}

/**
 * Enables conversational interaction with the TravelCrew coordinator assistant.
 * Maintains context of the current mission results.
 */
export async function chatWithCrew(userInput: string, context: Hotel[]): Promise<string> {
  try {
    const ai = getAIInstance();
    
    const contextData = context.length > 0 
      ? `MISSION CONTEXT: You have already identified the following properties for the user: ${context.map(h => h.name).join(', ')}.`
      : "MISSION CONTEXT: No specific properties have been identified yet.";

    const prompt = `
      IDENTITY: You are the Lead Coordinator for TravelCrew AI.
      ${contextData}
      
      USER COMMAND: "${userInput}"
      
      RESPONSE PROTOCOL: 
      - Be efficient, professional, and slightly futuristic/agentic in tone.
      - Provide actionable advice or answer questions about the identified hotels.
      - If requested to perform an entirely new search, suggest the user uses the main deployment interface.
      - Keep responses under 100 words unless technical detail is requested.
    `;

    // Using gemini-3-flash-preview for fast conversational responses
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "System link active, waiting for agent data...";
  } catch (error) {
    console.error("COMM_LINK_ERROR: Crew chat failed:", error);
    return "Protocol link unstable. Unable to process command.";
  }
}
