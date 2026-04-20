import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async summarizeMeeting(transcript: string) {
    if (!transcript.trim()) return "No conversation detected.";

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an expert executive assistant. Summarize the following meeting transcript into a concise format:
        1. **Key Decisions**
        2. **Action Items** (with owners if mentioned)
        3. **Important Mentions**
        
        Transcript:
        ${transcript}`,
      });

      return response.text;
    } catch (error) {
      console.error("Gemini summarization error:", error);
      throw error;
    }
  },

  async extractImportantTopics(transcript: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Extract the top 5 important topics or keywords from this conversation as a comma-separated list:
        ${transcript}`,
      });

      return response.text?.split(',').map(s => s.trim()) || [];
    } catch (error) {
      console.error("Gemini topic extraction error:", error);
      return [];
    }
  },

  async generateResumeStrategy(data: { title: string; currentTask: string; nextStep: string; notes: string }) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a productivity expert. Given this session context, provide a "Smart Resume Strategy" to help the user get back into deep flow:
        
        Session: ${data.title}
        Current Task: ${data.currentTask}
        Next Step: ${data.nextStep}
        Notes: ${data.notes}
        
        Give 3 punchy points to resume.`,
      });
      return response.text;
    } catch (error) {
      console.error("Resume strategy error:", error);
      return "Flow strategy not available right now. Just focus on the next step!";
    }
  },

  async generateLinkSummary(links: string[]) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Briefly summarize the context of these URLs for a productivity session: ${links.join(', ')}`,
      });
      return response.text;
    } catch (error) {
      console.error("Link summary error:", error);
      return "Contextual summary not available.";
    }
  }
};
