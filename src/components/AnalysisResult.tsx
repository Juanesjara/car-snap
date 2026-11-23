import { SpecList } from './SpecList';
import type { CarSpecs } from '../types';

interface Props {
  specs: CarSpecs;
  previewUrl: string;
  hasCoords: boolean;
  manualLat: string;
  manualLng: string;
  onManualLat: (v: string) => void;
  onManualLng: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}

const INPUT =
  'flex-1 min-w-0 bg-raised border border-line text-ink text-sm rounded-xl px-3 py-2.5 outline-none transition-colors focus:border-brand-500 placeholder-faint tnum';

export function AnalysisResult({
  specs,
  previewUrl,
  hasCoords,
  manualLat,
  manualLng,
  onManualLat,
  onManualLng,
  onSave,
  onCancel,
  saving,
}: Props) {
  const title = [specs.marca, specs.modelo].filter(Boolean).join(' ') || 'Auto identificado';

  return (
    <div className="flex flex-col gap-4 px-5 pb-6 animate-fade-up">
      <div className="relative rounded-2xl overflow-hidden">
        <img src={previewUrl} alt="Auto capturado" className="w-full h-48 object-cover" />
        {/* Degradado para que el nombre se lea sobre cualquier foto. */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-4 pt-10 pb-3">
          <p className="text-white font-semibold text-lg leading-tight">{title}</p>
          {specs.año && <p className="text-white/70 text-sm tnum">{specs.año}</p>}
        </div>
      </div>

      <SpecList
        title="Ficha técnica"
        rows={[
          ['Marca', specs.marca],
          ['Modelo', specs.modelo],
          ['Año', specs.año],
          ['Motor', specs.motor],
          ['Transmisión', specs.transmision],
          ['Tracción', specs.traccion],
          ['Carrocería', specs.carroceria],
          ['Color', specs.color],
          ['País de origen', specs.pais_origen],
        ]}
        notes={specs.notas}
      />

      {!hasCoords && (
        <section className="bg-surface border border-line rounded-2xl p-4 flex flex-col gap-3">
          <div>
            <h2 className="text-amber-400 text-[11px] font-semibold uppercase tracking-[0.12em]">
              Sin ubicación
            </h2>
            <p className="text-faint text-xs mt-1">
              La foto no trae GPS. Puedes escribir las coordenadas o dejarlo vacío.
            </p>
          </div>
          <div className="flex gap-3">
            <input
              type="number"
              step="any"
              aria-label="Latitud"
              placeholder="Latitud"
              value={manualLat}
              onChange={(e) => onManualLat(e.target.value)}
              className={INPUT}
            />
            <input
              type="number"
              step="any"
              aria-label="Longitud"
              placeholder="Longitud"
              value={manualLng}
              onChange={(e) => onManualLng(e.target.value)}
              className={INPUT}
            />
          </div>
        </section>
      )}

      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={onSave}
          disabled={saving}
          className="w-full bg-brand-600 active:bg-brand-700 disabled:bg-raised disabled:text-faint text-white font-semibold py-4 rounded-2xl transition-colors duration-200"
        >
          {saving ? 'Guardando…' : 'Guardar auto'}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="w-full text-muted active:text-ink font-medium py-3 transition-colors duration-200 disabled:opacity-40"
        >
          Descartar
        </button>
      </div>
    </div>
  );
}
