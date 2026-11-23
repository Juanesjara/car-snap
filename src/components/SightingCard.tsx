import { ChevronRightIcon, PinIcon } from './icons';
import type { Sighting } from '../types';

interface Props {
  sighting: Sighting;
  onClick: () => void;
}

export function SightingCard({ sighting, onClick }: Props) {
  const date = sighting.taken_at ? new Date(sighting.taken_at) : new Date(sighting.created_at);
  const label = [sighting.marca, sighting.modelo].filter(Boolean).join(' ') || 'Auto desconocido';
  const hasCoords = sighting.latitude != null && sighting.longitude != null;

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-surface border border-line rounded-2xl p-3 flex items-center gap-3.5 transition-colors duration-200 active:bg-raised"
    >
      <img
        src={sighting.photo_url}
        alt=""
        loading="lazy"
        width={72}
        height={72}
        className="w-[72px] h-[72px] object-cover rounded-xl shrink-0 bg-raised"
      />

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* El nombre se queda con todo el ancho; el año baja a la fila de metadatos. */}
        <p className="font-semibold text-ink truncate">{label}</p>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-faint text-xs tnum">
            {sighting.año ? `${sighting.año} · ` : ''}
            {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          {hasCoords && (
            <span className="inline-flex items-center gap-1 text-[11px] text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-full tnum">
              <PinIcon className="w-3 h-3" strokeWidth={2} />
              {sighting.latitude!.toFixed(3)}, {sighting.longitude!.toFixed(3)}
            </span>
          )}
        </div>
      </div>

      <ChevronRightIcon className="w-5 h-5 text-faint shrink-0" />
    </button>
  );
}
