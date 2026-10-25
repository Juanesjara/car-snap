import { randomUUID } from 'node:crypto';
import { authorized, BUCKET, decodeJpeg, json, supabase } from './_lib.js';

const SPEC_KEYS = ['motor', 'transmision', 'traccion', 'carroceria', 'color', 'pais_origen', 'notas'];

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.slice(0, max) : null);
const num = (v: unknown, min: number, max: number) =>
  typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max ? v : null;

// Filas viejas guardaban la URL pública completa; las nuevas solo la ruta.
const toPath = (photoUrl: string) => photoUrl.split(`/${BUCKET}/`).pop()!;

export async function GET(req: Request): Promise<Response> {
  if (!authorized(req)) return json({ error: 'No autorizado' }, 401);

  const { data, error } = await supabase
    .from('car_sightings')
    .select('*')
    .order('taken_at', { ascending: false });
  if (error) return json({ error: error.message }, 500);
  if (!data.length) return json([]);

  const { data: signed, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(data.map((s) => toPath(s.photo_url)), 60 * 60);
  if (signError) return json({ error: signError.message }, 500);

  return json(data.map((s, i) => ({ ...s, photo_url: signed[i]?.signedUrl ?? '' })));
}

export async function POST(req: Request): Promise<Response> {
  if (!authorized(req)) return json({ error: 'No autorizado' }, 401);

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return json({ error: 'Cuerpo inválido' }, 400);

  const image = decodeJpeg(body.photo);
  if (!image) return json({ error: 'Imagen inválida' }, 400);

  const source = body.source === 'camera' || body.source === 'gallery' ? body.source : null;
  const takenAt = new Date(typeof body.taken_at === 'string' ? body.taken_at : NaN);
  if (!source || isNaN(takenAt.getTime())) return json({ error: 'Datos inválidos' }, 400);

  const rawSpecs = (body.specs ?? {}) as Record<string, unknown>;
  const specs = Object.fromEntries(
    SPEC_KEYS.map((k) => [k, str(rawSpecs[k], k === 'notas' ? 2000 : 200)]),
  );

  const path = `${randomUUID()}.jpg`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, image, { contentType: 'image/jpeg', upsert: false });
  if (uploadError) return json({ error: uploadError.message }, 500);

  const { error } = await supabase.from('car_sightings').insert({
    photo_url: path,
    marca: str(body.marca),
    modelo: str(body.modelo),
    año: num(body.año, 1880, 2100),
    specs,
    latitude: num(body.latitude, -90, 90),
    longitude: num(body.longitude, -180, 180),
    taken_at: takenAt.toISOString(),
    source,
  });
  if (error) {
    await supabase.storage.from(BUCKET).remove([path]);
    return json({ error: error.message }, 500);
  }

  return json({ ok: true }, 201);
}
