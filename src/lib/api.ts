import type { CarSpecs, Sighting, SpecsJson } from '../types';

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json' },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `Error ${res.status}`);
  return body as T;
}

export function analyzeCarImage(base64: string): Promise<CarSpecs> {
  return call('/api/analyze', { method: 'POST', body: JSON.stringify({ base64 }) });
}

export interface SavePayload {
  photo: string;
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
  await call('/api/sightings', { method: 'POST', body: JSON.stringify(payload) });
}

export function getSightings(): Promise<Sighting[]> {
  return call('/api/sightings');
}
