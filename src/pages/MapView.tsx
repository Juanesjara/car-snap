import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getSightings } from '../lib/supabase';
import type { Sighting } from '../types';

// Vite no sirve los assets de Leaflet correctamente por defecto.
// Hay que apuntar los iconos del marker a la carpeta de node_modules manualmente.
function fixLeafletIcons() {
  delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

fixLeafletIcons();

// Colombia como centro por defecto si no hay sightings con ubicación
const DEFAULT_CENTER: [number, number] = [4.711, -74.0721];
const DEFAULT_ZOOM = 6;

export function MapView() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSightings()
      .then(setSightings)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Solo los autos que tienen coordenadas guardadas
  const located = sightings.filter(
    (s) => s.latitude != null && s.longitude != null,
  );

  // Centra el mapa en el promedio de todas las ubicaciones
  const center: [number, number] =
    located.length > 0
      ? [
          located.reduce((sum, s) => sum + s.latitude!, 0) / located.length,
          located.reduce((sum, s) => sum + s.longitude!, 0) / located.length,
        ]
      : DEFAULT_CENTER;

  const zoom = located.length > 0 ? 10 : DEFAULT_ZOOM;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-red-900/40 border border-red-700 rounded-xl px-4 py-3 w-full max-w-sm">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {located.length === 0 && (
        <div className="px-4 py-2 bg-gray-900 border-b border-gray-800 shrink-0">
          <p className="text-gray-500 text-xs text-center">
            Ningún auto guardado tiene ubicación aún
          </p>
        </div>
      )}

      {/* El mapa ocupa todo el espacio restante */}
      <div className="flex-1">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          {/* Tiles de OpenStreetMap — gratuitos, sin API key */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {located.map((s) => {
            const label =
              [s.marca, s.modelo, s.año].filter(Boolean).join(' ') ||
              'Auto desconocido';

            return (
              <Marker
                key={s.id}
                position={[s.latitude!, s.longitude!]}
              >
                <Popup>
                  <div className="flex flex-col gap-2 min-w-[160px]">
                    {s.photo_url && (
                      <img
                        src={s.photo_url}
                        alt={label}
                        className="w-full h-24 object-cover rounded"
                      />
                    )}
                    <p className="font-semibold text-sm text-gray-900">{label}</p>
                    {s.taken_at && (
                      <p className="text-xs text-gray-500">
                        {new Date(s.taken_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
