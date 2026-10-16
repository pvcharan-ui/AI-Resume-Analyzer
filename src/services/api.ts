import type { ApplicationInput, AnalysisResult } from '../types';

/**
 * Service Layer:
 * Sends the candidate's genuine application inputs to the backend AI service for evaluation.
 * Prepared for direct backend and Gemini API integration.
 */
export async function analyzeApplication(input: ApplicationInput): Promise<AnalysisResult> {
  const apiUrl = import.meta.env.VITE_API_URL || '/api/analyze';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorMsg = await response.text().catch(() => '');
      throw new Error(
        `Analysis service responded with status ${response.status}: ${errorMsg || response.statusText}`
      );
    }

    const data: AnalysisResult = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        'The backend AI analysis service is not connected yet. Connect the backend endpoint to execute live Gemini API analysis.'
      );
    }
    throw error;
  }
}
