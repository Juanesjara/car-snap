// Usando Google Gemini 1.5 Flash (gratis).
// Para cambiar a Claude: reemplaza con @anthropic-ai/sdk y usa VITE_ANTHROPIC_API_KEY.
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { CarSpecs } from '../types';

const SYSTEM_PROMPT =
  'You are an expert car identifier. Analyze the image and return ONLY a valid JSON object ' +
  'with no markdown, no explanation. Schema: ' +
  '{ "marca": string, "modelo": string, "año": number | null, "motor": string | null, ' +
  '"transmision": string | null, "traccion": string | null, "carroceria": string | null, ' +
  '"color": string | null, "pais_origen": string | null, "notas": string | null } ' +
  'If you cannot identify the car, return { "error": "No car detected" }. ' +
  'All string values in Spanish.';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_KEY as string);

export async function analyzeCarImage(
  base64: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg',
): Promise<CarSpecs> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent([
    { inlineData: { data: base64, mimeType: mediaType } },
    'Identifica este auto y devuelve el JSON.',
  ]);

  const text = result.response.text().trim();

  let parsed: Record<string, unknown>;
  try {
    // Strip markdown fences if Gemini wraps the response anyway
    const clean = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    parsed = JSON.parse(clean) as Record<string, unknown>;
  } catch {
    throw new Error('La respuesta de Gemini no es JSON válido');
  }

  if (parsed.error) {
    throw new Error(String(parsed.error));
  }

  return parsed as unknown as CarSpecs;
}
