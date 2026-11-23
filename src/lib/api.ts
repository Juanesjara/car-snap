import type { CarSpecs, Sighting, SpecsJson } from '../types';

const PASSWORD_KEY = 'carsnap-password';

export function getPassword(): string | null {
  try { return localStorage.getItem(PASSWORD_KEY); } catch { return null; }
}

export function setPassword(password: string | null) {
  try {
    if (password) localStorage.setItem(PASSWORD_KEY, password);
    else localStorage.removeItem(PASSWORD_KEY);
  } catch { /* sin storage: se pedirá de nuevo */ }
}

// Valida la contraseña contra el servidor antes de guardarla.
export async function login(password: string): Promise<boolean> {
  const res = await fetch('/api/sightings', {
    headers: { 'x-app-password': encodeURIComponent(password) },
  });
  if (res.status === 401) return false;
  setPassword(password);
  return true;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-app-password': encodeURIComponent(getPassword() ?? ''),
    },
  });
  if (res.status === 401) {
    setPassword(null);
    location.reload();
  }
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
