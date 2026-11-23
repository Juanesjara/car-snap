// Archivos con "_" en /api no se exponen como endpoints en Vercel.
import { createHash, timingSafeEqual } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

export const BUCKET = 'car-photos';
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

export function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

// ponytail: una sola contraseña compartida sin rate limit; usa una larga.
// Pasar a Supabase Auth si la app deja de ser personal.
export function authorized(req: Request): boolean {
  const expected = process.env.APP_PASSWORD;
  if (!expected) return false;
  const got = req.headers.get('x-app-password') ?? '';
  const hash = (s: string) => createHash('sha256').update(s).digest();
  return timingSafeEqual(hash(got), hash(encodeURIComponent(expected)));
}

// Decodifica base64 y exige que sea un JPEG de tamaño razonable.
export function decodeJpeg(base64: unknown): Buffer | null {
  if (typeof base64 !== 'string' || base64.length > MAX_IMAGE_BYTES * 1.4) return null;
  const buf = Buffer.from(base64, 'base64');
  if (buf.length < 4 || buf.length > MAX_IMAGE_BYTES) return null;
  if (buf[0] !== 0xff || buf[1] !== 0xd8 || buf[2] !== 0xff) return null;
  return buf;
}
