import { GoogleGenAI } from '@google/genai';

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

let geminiClientInstance: GoogleGenAI | null = null;

/**
 * Returns an initialized GoogleGenAI instance or throws a clean error if the API key is missing.
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured on the server. Please set your Gemini API key in the .env file.'
    );
  }

  if (!geminiClientInstance) {
    geminiClientInstance = new GoogleGenAI({ apiKey });
  }

  return geminiClientInstance;
}
