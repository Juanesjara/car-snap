import type { Sighting } from '../types';

interface Props {
  sighting: Sighting;
  onClick: () => void;
}

export function SightingCard({ sighting, onClick }: Props) {
  const date = sighting.taken_at
    ? new Date(sighting.taken_at)
    : new Date(sighting.created_at);

  const label = [sighting.marca, sighting.modelo].filter(Boolean).join(' ') || 'Auto desconocido';

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-gray-900 hover:bg-gray-800 active:bg-gray-950 rounded-xl overflow-hidden flex gap-3 p-3 transition-colors"
    >
      <img
        src={sighting.photo_url}
        alt={label}
        className="w-20 h-20 object-cover rounded-lg shrink-0 bg-gray-800"
      />
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <p className="font-semibold text-white truncate">{label}</p>
          {sighting.año && (
            <p className="text-gray-400 text-sm">{sighting.año}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gray-500 text-xs">
            {date.toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          {sighting.latitude != null && sighting.longitude != null && (
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
              {sighting.latitude.toFixed(3)}, {sighting.longitude.toFixed(3)}
            </span>
          )}
        </div>
      </div>
      <span className="text-gray-600 self-center">›</span>
    </button>
  );
}
