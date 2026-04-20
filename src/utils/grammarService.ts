import { GoogleGenAI } from "@google/genai";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

// Ensure the GenAI instance logic can use local api key. In browser typically proxying to backend is needed,
// but for simplicity according to previous pattern we might use process.env.VITE_GEMINI_API_KEY.
// Wait, is VITE_GEMINI_API_KEY available?
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const grammarService = {
  /**
   * Corrects and translates user text based on their preferred language setting.
   * 
   * @param text The user's input text (e.g., nextStep).
   * @param userId The current user's ID to fetch their preferred language.
   * @returns A polished string in the target language.
   */
  async polishString(text: string, userId?: string | null): Promise<string> {
    if (!text || text.trim() === '') return text;

    let language = 'English'; // Default

    // Try to fetch the user's preferred language from Firestore
    if (userId) {
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.settings?.preferredLanguage) {
            language = data.settings.preferredLanguage;
          }
        }
      } catch (err) {
        console.warn("Could not fetch user preferred language. Defaulting to English.", err);
      }
    }

    try {
      const prompt = `You are an expert editor and translator. Please correct any grammatical errors in the following text, and translate it exactly into ${language}. Maintain the original tone, prioritize accurate technical terminology, and return ONLY the corrected/translated text with no acknowledging remarks:

TWEET/TEXT:
"${text}"`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return response.text?.trim() || text;
    } catch (error) {
      console.error("Grammar & Translation Error:", error);
      // Fallback to original text if AI fails
      return text;
    }
  }
};
