
import { GoogleGenAI, Type } from "@google/genai";
import { AISolution } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const solveProblemWithAI = async (problem: string): Promise<AISolution | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Solve this mathematical or logic problem: "${problem}". Provide a clear step-by-step solution.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problem: { type: Type.STRING },
            solution: { type: Type.STRING, description: "Detailed explanation of the solution" },
            steps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Numbered steps taken to reach the result"
            },
            finalResult: { type: Type.STRING, description: "The final numeric or concise answer" }
          },
          required: ["problem", "solution", "steps", "finalResult"]
        }
      }
    });

    const result = response.text;
    if (!result) return null;
    return JSON.parse(result) as AISolution;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return null;
  }
};
