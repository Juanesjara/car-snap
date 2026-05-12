export interface CarSpecs {
  marca: string;
  modelo: string;
  año: number | null;
  motor: string | null;
  transmision: string | null;
  traccion: string | null;
  carroceria: string | null;
  color: string | null;
  pais_origen: string | null;
  notas: string | null;
}

export interface SpecsJson {
  motor: string | null;
  transmision: string | null;
  traccion: string | null;
  carroceria: string | null;
  color: string | null;
  pais_origen: string | null;
  notas: string | null;
}

export interface Sighting {
  id: string;
  created_at: string;
  photo_url: string;
  marca: string | null;
  modelo: string | null;
  año: number | null;
  specs: SpecsJson | null;
  latitude: number | null;
  longitude: number | null;
  taken_at: string | null;
  source: 'camera' | 'gallery';
}
