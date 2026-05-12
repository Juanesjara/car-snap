import { createClient } from '@supabase/supabase-js';
import type { Sighting, SpecsJson } from '../types';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
);

export async function uploadPhoto(file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from('car-photos')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage.from('car-photos').getPublicUrl(data.path);
  return urlData.publicUrl;
}

export interface SavePayload {
  photo_url: string;
  marca: string;
  modelo: string;
  año: number | null;
  specs: SpecsJson;
  latitude: number | null;
  longitude: number | null;
  taken_at: string;
  source: 'camera' | 'gallery';
}

export async function saveSighting(payload: SavePayload): Promise<void> {
  const { error } = await supabase.from('car_sightings').insert(payload);
  if (error) throw new Error(error.message);
}

export async function getSightings(): Promise<Sighting[]> {
  const { data, error } = await supabase
    .from('car_sightings')
    .select('*')
    .order('taken_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Sighting[];
}
