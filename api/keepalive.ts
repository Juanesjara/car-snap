import { json, supabase } from './_lib.js';

// Lo llama el cron de Vercel una vez al día para que Supabase gratis no se pause
// por inactividad. Vercel envía "Authorization: Bearer $CRON_SECRET".
export async function GET(req: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return json({ error: 'No autorizado' }, 401);
  }
  const { error } = await supabase.from('car_sightings').select('id').limit(1);
  return error ? json({ error: error.message }, 500) : json({ ok: true });
}
