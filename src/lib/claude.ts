// WARNING: API key is exposed on the client (VITE_ prefix).
// Acceptable for personal/local use only. For production, proxy through a backend route.
import Anthropic from '@anthropic-ai/sdk';
import type { CarSpecs } from '../types';

const SYSTEM_PROMPT =
  'You are an expert car identifier. Analyze the image and return ONLY a valid JSON object ' +
  'with no markdown, no explanation. Schema: ' +
  '{ "marca": string, "modelo": string, "año": number | null, "motor": string | null, ' +
  '"transmision": string | null, "traccion": string | null, "carroceria": string | null, ' +
  '"color": string | null, "pais_origen": string | null, "notas": string | null } ' +
  'If you cannot identify the car, return { "error": "No car detected" }. ' +
  'All string values in Spanish.';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function analyzeCarImage(
  base64: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg',
): Promise<CarSpecs> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 },
          },
          { type: 'text', text: 'Identifica este auto y devuelve el JSON.' },
        ],
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text.trim() : '';

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error('La respuesta de Claude no es JSON válido');
  }

  if (parsed.error) {
    throw new Error(String(parsed.error));
  }

  return parsed as unknown as CarSpecs;
}
