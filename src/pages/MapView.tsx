import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ScreenHeader } from '../components/ScreenHeader';
import { getSightings } from '../lib/api';
import type { Sighting } from '../types';

// Marcador propio en vez de los PNG de Leaflet: mismo azul que el resto de la app
// y sin descargar imágenes desde unpkg.
const PIN = L.divIcon({
  className: '',
  html: `<svg viewBox="0 0 24 24" width="30" height="30" fill="#2563EB" stroke="#0B0F17" stroke-width="1.25"
    style="filter:drop-shadow(0 2px 3px rgba(0,0,0,.5))">
    <path d="M20 10.5c0 5.5-8 11.5-8 11.5s-8-6-8-11.5a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10.5" r="3" fill="#0B0F17" stroke="none"/>
  </svg>`,
  iconSize: [30, 30],
  iconAnchor: [15, 29],
  popupAnchor: [0, -27],
});

// Colombia como centro por defecto si no hay sightings con ubicación
const DEFAULT_CENTER: [number, number] = [4.711, -74.0721];
const DEFAULT_ZOOM = 6;

// Leaflet mide el contenedor al montarse, antes de que flex le dé altura, y queda
// descentrado. invalidateSize lo recalcula; fitBounds encuadra todos los marcadores.
function FitToMarkers({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 15 });
    }
  }, [map, points]);
  return null;
}

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
  const located = useMemo(
    () => sightings.filter((s) => s.latitude != null && s.longitude != null),
    [sightings],
  );

  const points = useMemo<[number, number][]>(
    () => located.map((s) => [s.latitude!, s.longitude!]),
    [located],
  );

  const subtitle = loading
    ? 'Cargando…'
    : located.length > 0
      ? `${located.length} con ubicación`
      : 'Ningún auto tiene ubicación todavía';

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Mapa" subtitle={subtitle} />

      <div className="flex-1 px-5 pb-5 min-h-0">
        <div className="h-full rounded-2xl overflow-hidden border border-line bg-surface">
          {loading ? (
            <div className="h-full flex items-center justify-center" role="status" aria-label="Cargando mapa">
              <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center px-6">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          ) : (
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={DEFAULT_ZOOM}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <FitToMarkers points={points} />

              {/* OSM es gratis y sin API key; el modo oscuro se logra con un filtro
                  CSS sobre los tiles (ver .leaflet-tile-pane en index.css). */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {located.map((s) => {
                const label =
                  [s.marca, s.modelo, s.año].filter(Boolean).join(' ') || 'Auto desconocido';

                return (
                  <Marker key={s.id} position={[s.latitude!, s.longitude!]} icon={PIN}>
                    <Popup>
                      <div className="flex flex-col gap-2 min-w-[170px]">
                        {s.photo_url && (
                          <img
                            src={s.photo_url}
                            alt=""
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        )}
                        <p className="font-semibold text-sm text-ink">{label}</p>
                        {s.taken_at && (
                          <p className="text-xs text-faint tnum">
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
          )}
        </div>
      </div>
    </div>
  );
}
