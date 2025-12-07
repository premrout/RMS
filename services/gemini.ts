import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PriceSuggestion, EventData } from '../types';

// Initialize the API client
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Analyzes pricing data and returns suggestions using Gemini 2.5 Flash
 * Utilizes JSON Schema for structured output.
 */
export const analyzePricing = async (
  currentData: any[],
  city: string
): Promise<PriceSuggestion[]> => {
  if (!apiKey) {
    console.warn("API Key missing");
    return [];
  }

  const model = "gemini-2.5-flash";

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        date: { type: Type.STRING, description: "YYYY-MM-DD format" },
        currentPrice: { type: Type.NUMBER },
        recommendedPrice: { type: Type.NUMBER },
        reason: { type: Type.STRING },
        demandLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Extreme"] }
      },
      required: ["date", "currentPrice", "recommendedPrice", "reason", "demandLevel"]
    }
  };

  const prompt = `
    You are a Revenue Management System AI expert for the Indian hospitality market.
    Analyze the following hotel data for a hotel in ${city}, India.
    Currency is INR (Indian Rupee).
    Consider the occupancy trends and competitor rates.
    
    Data: ${JSON.stringify(currentData.slice(0, 10))} (Partial data sent for brevity)

    Provide pricing recommendations for these dates. 
    Rule of thumb: 
    - If occupancy > 80%, increase price.
    - If occupancy < 40%, decrease price slightly to stimulate demand.
    - Stay competitive with the competitor rate.
    - Identify potential events based on dates (weekends, weddings, festivals like Diwali/Holi if applicable by date).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.3, // Lower temperature for more analytical results
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as PriceSuggestion[];
  } catch (error) {
    console.error("Error analyzing pricing:", error);
    return [];
  }
};

/**
 * searches for local events using Google Search Grounding.
 * Uses gemini-2.5-flash which supports tools.
 */
export const findLocalEvents = async (city: string, month: string): Promise<EventData[]> => {
  if (!apiKey) return [];

  const model = "gemini-2.5-flash";
  const prompt = `Find major events, weddings, festivals, or conferences in ${city}, India occurring in ${month} 2024 that would impact hotel demand. Provide a summary of dates and expected impact.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });
    
    const text = response.text || "";
    
    // Extract sources from grounding chunks
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
        .map((chunk: any) => ({
            title: chunk.web?.title || "Source",
            uri: chunk.web?.uri || ""
        }))
        .filter((s: {uri: string}) => s.uri !== ""); // Filter out empty URIs
    
    // Remove duplicates based on URI
    const uniqueSources = Array.from(new Map(sources.map((s: {uri: string}) => [s.uri, s])).values());

    const events: EventData[] = [{
        title: `Market Report: ${city} (${month})`,
        date: month,
        description: text,
        sourceUrl: uniqueSources[0]?.uri || "",
        sourceTitle: uniqueSources[0]?.title || "Google Search",
        sources: uniqueSources
    }];

    return events;

  } catch (error) {
    console.error("Error finding events:", error);
    return [];
  }
};

/**
 * Chat assistant function
 */
export const chatWithJyotiPrem = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
    if (!apiKey) throw new Error("API Key missing");
    
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history,
        config: {
            systemInstruction: "You are 'JyotiPrem', a helpful hotel revenue management assistant for Indian hoteliers. Prices are in INR. Keep answers brief, professional, and data-driven."
        }
    });

    const result = await chat.sendMessage({ message });
    return result.text;
}