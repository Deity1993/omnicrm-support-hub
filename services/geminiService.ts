
import { GoogleGenAI, Type } from "@google/genai";
import { TicketPriority, TicketStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const parseEmailToTicket = async (emailBody: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extrahiere Informationen aus dieser E-Mail und erstelle ein strukturiertes Support-Ticket. 
    E-Mail Inhalt: "${emailBody}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Ein kurzer, prägnanter Titel für das Ticket." },
          description: { type: Type.STRING, description: "Eine Zusammenfassung des Problems oder der Anfrage." },
          priority: { 
            type: Type.STRING, 
            enum: [TicketPriority.LOW, TicketPriority.MEDIUM, TicketPriority.HIGH, TicketPriority.URGENT],
            description: "Die geschätzte Dringlichkeit basierend auf dem Text."
          },
          customerName: { type: Type.STRING, description: "Name des Absenders, falls erkennbar." },
          customerEmail: { type: Type.STRING, description: "E-Mail des Absenders, falls erkennbar." }
        },
        required: ["title", "description", "priority"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return null;
  }
};

export const summarizeCustomerHistory = async (customerName: string, interactions: string[]) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Fasse die Interaktionshistorie für den Kunden ${customerName} kurz zusammen. 
    Historie: ${interactions.join(' | ')}`,
  });
  return response.text;
};
