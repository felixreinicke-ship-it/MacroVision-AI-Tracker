import { GoogleGenAI } from '@google/genai';

export interface NutritionData {
  items: Array<{
    name: string;
    estimatedGrams: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

class GeminiClient {
  private client: GoogleGenAI | null = null;
  private apiKey: string | null = null;

  initialize(apiKey: string) {
    if (!apiKey) {
      throw new Error('API-Key ist erforderlich');
    }
    this.apiKey = apiKey;
    this.client = new GoogleGenAI({ apiKey });
  }

  private getClient() {
    if (!this.client) {
      throw new Error('GeminiClient nicht initialisiert');
    }
    return this.client;
  }

  async analyzeMealFromImage(
    imageBase64: string,
    additionalContext?: string,
  ): Promise<NutritionData> {
    const ai = this.getClient();

    try {
      const prompt = `Analysiere dieses Essensfoto SEHR DETAILLIERT und extrahiere ALLE Lebensmittel mit ihren Nährwertinformationen.

${additionalContext ? 'Zusätzliche Informationen vom Nutzer: ' + additionalContext : 'Keine zusätzlichen Informationen.'}

WICHTIG:
- Antworte EXAKT im folgenden JSON-Format.
- KEINE Erklärungen, KEIN Text außerhalb des JSON, KEIN Markdown.

{
  "items": [
    {
      "name": "Lebensmittelname",
      "estimatedGrams": 100,
      "calories": 250,
      "protein": 15,
      "carbs": 30,
      "fat": 8
    }
  ]
}`;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageBase64,
                },
              },
              { text: prompt },
            ],
          },
        ],
      });

      // neues SDK: Text kommt direkt/am Candidate, nicht mehr unter result.response
      const text =
        (result as any)?.text ??
        (result as any)?.candidates?.[0]?.content?.parts?.[0]?.text ??
        '';

      let data: any;
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('no-json');
        data = JSON.parse(jsonMatch[0]);
      } catch {
        // Grober Fallback, falls das Modell kein JSON liefert
        data = {
          items: [
            {
              name: 'Unbekanntes Gericht (Bild)',
              estimatedGrams: 300,
              calories: 600,
              protein: 20,
              carbs: 60,
              fat: 25,
            },
          ],
        };
      }

      return {
        items: data.items || [],
        totalCalories:
          data.items?.reduce(
            (sum: number, item: any) => sum + (item.calories || 0),
            0,
          ) || 0,
        totalProtein:
          data.items?.reduce(
            (sum: number, item: any) => sum + (item.protein || 0),
            0,
          ) || 0,
        totalCarbs:
          data.items?.reduce(
            (sum: number, item: any) => sum + (item.carbs || 0),
            0,
          ) || 0,
        totalFat:
          data.items?.reduce(
            (sum: number, item: any) => sum + (item.fat || 0),
            0,
          ) || 0,
      };
    } catch (error: any) {
      console.error('Gemini API Error (Image):', error);
      throw new Error(
        'Bild-Analyse fehlgeschlagen: ' + (error?.message || 'Unbekannter Fehler'),
      );
    }
  }

  async analyzeMealFromText(mealDescription: string): Promise<NutritionData> {
    const ai = this.getClient();

    try {
      const prompt = `Der Nutzer hat folgende Mahlzeit gegessen: "${mealDescription}".

Gib eine realistische Nährwertschätzung basierend auf typischen Portionsgrößen.

WICHTIG:
- Antworte EXAKT im folgenden JSON-Format.
- KEINE Erklärungen, KEIN Text außerhalb des JSON, KEIN Markdown.

{
  "items": [
    {
      "name": "Lebensmittelname",
      "estimatedGrams": 100,
      "calories": 250,
      "protein": 15,
      "carbs": 30,
      "fat": 8
    }
  ]
}`;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      });

      // gleiche Anpassung wie oben
      const text =
        (result as any)?.text ??
        (result as any)?.candidates?.[0]?.content?.parts?.[0]?.text ??
        '';

      let data: any;
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('no-json');
        data = JSON.parse(jsonMatch[0]);
      } catch {
        // Fallback für einfache Eingaben wie "2 Toast mit Nutella"
        data = {
          items: [
            {
              name: mealDescription,
              estimatedGrams: 120,
              calories: 350,
              protein: 8,
              carbs: 45,
              fat: 15,
            },
          ],
        };
      }

      return {
        items: data.items || [],
        totalCalories:
          data.items?.reduce(
            (sum: number, item: any) => sum + (item.calories || 0),
            0,
          ) || 0,
        totalProtein:
          data.items?.reduce(
            (sum: number, item: any) => sum + (item.protein || 0),
            0,
          ) || 0,
        totalCarbs:
          data.items?.reduce(
            (sum: number, item: any) => sum + (item.carbs || 0),
            0,
          ) || 0,
        totalFat:
          data.items?.reduce(
            (sum: number, item: any) => sum + (item.fat || 0),
            0,
          ) || 0,
      };
    } catch (error: any) {
      console.error('Gemini API Error (Text):', error);
      throw new Error(
        'Text-Analyse fehlgeschlagen: ' + (error?.message || 'Unbekannter Fehler'),
      );
    }
  }

  async generateCoachingAdvice(
    userProfile: any,
    aggregatedNutrition: NutritionData,
  ): Promise<string> {
    const ai = this.getClient();

    try {
      const prompt = `Du bist ein erfahrener KI-Ernährungscoach und Fitness-Experte. Analysiere diese personalisierten Nährwertdaten und gib konkrete, motivierende Ratschläge:

BENUTZERPROFIL:
- Alter: ${userProfile.age} Jahre
- Gewicht: ${userProfile.weightKg} kg
- Höhe: ${userProfile.heightCm} cm
- Ziel: ${
        userProfile.goal === 'lose'
          ? 'Gewicht verlieren'
          : userProfile.goal === 'maintain'
          ? 'Gewicht halten'
          : 'Muskelaufbau'
      }
- Aktivitätslevel: ${
        userProfile.activityLevel === 'low'
          ? 'Niedrig (Schreibtisch)'
          : userProfile.activityLevel === 'medium'
          ? 'Mittel (3x Sport/Woche)'
          : 'Hoch (5x+ Sport/Woche)'
      }

HEUTE GEGESSEN:
- Kalorien: ${aggregatedNutrition.totalCalories} kcal
- Protein: ${aggregatedNutrition.totalProtein} g
- Kohlenhydrate: ${aggregatedNutrition.totalCarbs} g
- Fett: ${aggregatedNutrition.totalFat} g

Gib 2-3 KONKRETE, ACTIONABLE Tipps für heute/morgen basierend auf den Daten (max. 200 Wörter). Sei motivierend und praktisch!`;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      });

      const text =
        (result as any)?.text ??
        (result as any)?.candidates?.[0]?.content?.parts?.[0]?.text ??
        '';

      return text;
    } catch (error: any) {
      console.error('Gemini Coaching Error:', error);
      throw new Error('Coaching-Advice fehlgeschlagen');
    }
  }
}

export const geminiClient = new GeminiClient();
