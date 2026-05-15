import type { Sighting } from '../types';

interface Props {
  sighting: Sighting;
  onClose: () => void;
}

const ROW = 'flex justify-between gap-4 py-2 border-b border-gray-800 last:border-0';
const LABEL = 'text-gray-500 text-sm shrink-0';
const VALUE = 'text-gray-100 text-sm text-right';

export function SightingDetail({ sighting, onClose }: Props) {
  const date = sighting.taken_at
    ? new Date(sighting.taken_at)
    : new Date(sighting.created_at);

  const specs = sighting.specs;
  const label = [sighting.marca, sighting.modelo].filter(Boolean).join(' ') || 'Auto desconocido';

  const mapsUrl =
    sighting.latitude != null && sighting.longitude != null
      ? `maps://maps.apple.com/?q=${sighting.latitude},${sighting.longitude}`
      : null;

  const basicRows: [string, string | number | null | undefined][] = [
    ['Marca', sighting.marca],
    ['Modelo', sighting.modelo],
    ['Año', sighting.año],
  ];

  const specRows: [string, string | null | undefined][] = specs
    ? [
        ['Motor', specs.motor],
        ['Transmisión', specs.transmision],
        ['Tracción', specs.traccion],
        ['Carrocería', specs.carroceria],
        ['Color', specs.color],
        ['País de origen', specs.pais_origen],
      ]
    : [];

  return (
    <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gray-950/90 backdrop-blur border-b border-gray-800 shrink-0 pt-safe">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={onClose}
            className="text-violet-400 font-medium text-sm"
          >
            ← Atrás
          </button>
          <p className="font-semibold text-white truncate flex-1">{label}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {/* Photo */}
        <img
          src={sighting.photo_url}
          alt={label}
          className="w-full rounded-xl object-cover max-h-72"
        />

        {/* Date + source */}
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span>
            {date.toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <span className="bg-gray-800 px-2 py-0.5 rounded-full text-xs capitalize">
            {sighting.source === 'camera' ? 'Cámara' : 'Galería'}
          </span>
        </div>

        {/* Basic info */}
        <div className="bg-gray-900 rounded-xl px-4 py-2">
          <p className="text-violet-400 text-xs font-semibold uppercase tracking-wide pt-2 pb-1">
            Identificación
          </p>
          {basicRows.map(([label, val]) =>
            val != null ? (
              <div key={label} className={ROW}>
                <span className={LABEL}>{label}</span>
                <span className={VALUE}>{val}</span>
              </div>
            ) : null,
          )}
        </div>

        {/* Specs */}
        {specRows.some(([, v]) => v != null) && (
          <div className="bg-gray-900 rounded-xl px-4 py-2">
            <p className="text-violet-400 text-xs font-semibold uppercase tracking-wide pt-2 pb-1">
              Especificaciones
            </p>
            {specRows.map(([label, val]) =>
              val ? (
                <div key={label} className={ROW}>
                  <span className={LABEL}>{label}</span>
                  <span className={VALUE}>{val}</span>
                </div>
              ) : null,
            )}
            {specs?.notas && (
              <div className="py-2">
                <p className={LABEL}>Notas</p>
                <p className="text-gray-300 text-sm mt-1">{specs.notas}</p>
              </div>
            )}
          </div>
        )}

        {/* Location */}
        {mapsUrl && (
          <div className="bg-gray-900 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-violet-400 text-xs font-semibold uppercase tracking-wide">
                Ubicación
              </p>
              <p className="text-gray-400 text-sm mt-0.5">
                {sighting.latitude!.toFixed(5)}, {sighting.longitude!.toFixed(5)}
              </p>
            </div>
            <a
              href={mapsUrl}
              className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              Abrir mapa
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
