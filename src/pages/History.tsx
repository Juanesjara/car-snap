import { useEffect, useState } from 'react';
import { CarIcon, SearchIcon } from '../components/icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { SightingCard } from '../components/SightingCard';
import { SightingDetail } from '../components/SightingDetail';
import { getSightings } from '../lib/api';
import type { Sighting } from '../types';

export function History() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Sighting | null>(null);

  useEffect(() => {
    getSightings()
      .then(setSightings)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = sightings.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.marca?.toLowerCase().includes(q) || s.modelo?.toLowerCase().includes(q);
  });

  const count = sightings.length;

  return (
    <>
      <div className="flex flex-col h-full">
        <ScreenHeader
          title="Historial"
          subtitle={loading ? 'Cargando…' : `${count} ${count === 1 ? 'auto' : 'autos'} guardados`}
        />

        {count > 0 && (
          <div className="px-5 pb-4 shrink-0">
            <div className="relative">
              <SearchIcon className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
              <input
                type="search"
                aria-label="Buscar por marca o modelo"
                placeholder="Buscar por marca o modelo"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface border border-line text-ink placeholder-faint rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-colors focus:border-brand-500"
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {loading && (
            <div className="flex justify-center py-16" role="status" aria-label="Cargando autos">
              <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="bg-red-950/60 border border-red-800/70 rounded-xl px-4 py-3">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-surface border border-line flex items-center justify-center text-faint">
                <CarIcon className="w-7 h-7" />
              </div>
              <p className="text-muted text-sm max-w-[22ch]">
                {search
                  ? `Ningún auto coincide con "${search}"`
                  : 'Todavía no has guardado ningún auto'}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            {filtered.map((s) => (
              <SightingCard key={s.id} sighting={s} onClick={() => setSelected(s)} />
            ))}
          </div>
        </div>
      </div>

      {selected && <SightingDetail sighting={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
