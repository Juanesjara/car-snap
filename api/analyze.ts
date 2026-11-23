import { GoogleGenerativeAI } from '@google/generative-ai';
import { authorized, decodeJpeg, json } from './_lib.js';

const SYSTEM_PROMPT =
  'You are an expert car identifier. Analyze the image and return ONLY a valid JSON object ' +
  'with no markdown, no explanation. Schema: ' +
  '{ "marca": string, "modelo": string, "año": number | null, "motor": string | null, ' +
  '"transmision": string | null, "traccion": string | null, "carroceria": string | null, ' +
  '"color": string | null, "pais_origen": string | null, "notas": string | null } ' +
  'If you cannot identify the car, return { "error": "No car detected" }. ' +
  'All string values in Spanish.';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!);

export async function POST(req: Request): Promise<Response> {
  if (!authorized(req)) return json({ error: 'No autorizado' }, 401);

  const body = (await req.json().catch(() => null)) as { base64?: unknown } | null;
  const image = decodeJpeg(body?.base64);
  if (!image) return json({ error: 'Imagen inválida' }, 400);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: { responseMimeType: 'application/json' },
  });

  let parsed: Record<string, unknown>;
  try {
    const result = await model.generateContent([
      { inlineData: { data: image.toString('base64'), mimeType: 'image/jpeg' } },
      'Identifica este auto y devuelve el JSON.',
    ]);
    parsed = JSON.parse(result.response.text()) as Record<string, unknown>;
  } catch {
    return json({ error: 'No se pudo analizar la imagen' }, 502);
  }

  if (parsed.error) return json({ error: String(parsed.error) }, 422);
  return json(parsed);
}
