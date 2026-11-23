import { ArrowLeftIcon, PinIcon } from './icons';
import { SpecList } from './SpecList';
import type { Sighting } from '../types';

interface Props {
  sighting: Sighting;
  onClose: () => void;
}

export function SightingDetail({ sighting, onClose }: Props) {
  const date = sighting.taken_at ? new Date(sighting.taken_at) : new Date(sighting.created_at);
  const specs = sighting.specs;
  const label = [sighting.marca, sighting.modelo].filter(Boolean).join(' ') || 'Auto desconocido';

  const hasCoords = sighting.latitude != null && sighting.longitude != null;
  const mapsUrl = hasCoords
    ? `https://maps.apple.com/?q=${sighting.latitude},${sighting.longitude}`
    : null;

  return (
    <div className="fixed inset-0 bg-base z-50 flex flex-col overflow-y-auto">
      {/* Overlay a pantalla completa: lleva su propio safe area. */}
      <div className="sticky top-0 z-10 bg-base/85 backdrop-blur border-b border-line shrink-0 pt-safe">
        <div className="flex items-center gap-2 px-2 py-2">
          <button
            onClick={onClose}
            aria-label="Volver al historial"
            className="w-11 h-11 flex items-center justify-center rounded-xl text-brand-400 active:bg-surface transition-colors duration-200 shrink-0"
          >
            <ArrowLeftIcon className="w-5 h-5" strokeWidth={2} />
          </button>
          <h1 className="font-semibold text-ink truncate">{label}</h1>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-5 py-5">
        <img
          src={sighting.photo_url}
          alt={label}
          className="w-full rounded-2xl object-cover max-h-72 bg-surface"
        />

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-muted text-sm">
            {date.toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <span className="bg-surface border border-line text-faint px-2.5 py-0.5 rounded-full text-xs">
            {sighting.source === 'camera' ? 'Cámara' : 'Galería'}
          </span>
        </div>

        <SpecList
          title="Identificación"
          rows={[
            ['Marca', sighting.marca],
            ['Modelo', sighting.modelo],
            ['Año', sighting.año],
          ]}
        />

        <SpecList
          title="Especificaciones"
          rows={[
            ['Motor', specs?.motor],
            ['Transmisión', specs?.transmision],
            ['Tracción', specs?.traccion],
            ['Carrocería', specs?.carroceria],
            ['Color', specs?.color],
            ['País de origen', specs?.pais_origen],
          ]}
          notes={specs?.notas}
        />

        {mapsUrl && (
          <section className="bg-surface border border-line rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-brand-400 text-[11px] font-semibold uppercase tracking-[0.12em]">
                Ubicación
              </h2>
              <p className="text-muted text-sm mt-1 tnum truncate">
                {sighting.latitude!.toFixed(5)}, {sighting.longitude!.toFixed(5)}
              </p>
            </div>
            <a
              href={mapsUrl}
              className="inline-flex items-center gap-1.5 bg-brand-600 active:bg-brand-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors duration-200 shrink-0"
            >
              <PinIcon className="w-4 h-4" strokeWidth={2} />
              Ver mapa
            </a>
          </section>
        )}
      </div>
    </div>
  );
}
