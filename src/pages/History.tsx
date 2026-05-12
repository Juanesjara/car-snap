import { useEffect, useState } from 'react';
import { SightingCard } from '../components/SightingCard';
import { SightingDetail } from '../components/SightingDetail';
import { getSightings } from '../lib/supabase';
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

  return (
    <>
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="px-4 pt-safe pt-6 pb-4 shrink-0">
          <h1 className="text-2xl font-bold text-white">Historial</h1>
          <p className="text-gray-500 text-sm">{sightings.length} autos guardados</p>
        </div>

        {/* Search */}
        <div className="px-4 pb-3 shrink-0">
          <input
            type="search"
            placeholder="Buscar por marca o modelo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="bg-red-900/40 border border-red-700 rounded-xl px-4 py-3 mt-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-gray-600">
              <span className="text-5xl">🚗</span>
              <p className="text-sm">
                {search ? 'Sin resultados' : 'Todavía no has guardado ningún auto'}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {filtered.map((s) => (
              <SightingCard key={s.id} sighting={s} onClick={() => setSelected(s)} />
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <SightingDetail sighting={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
