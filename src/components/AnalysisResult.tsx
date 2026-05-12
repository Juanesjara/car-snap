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

const ROW = 'flex justify-between gap-4 py-2 border-b border-gray-800 last:border-0';
const LABEL = 'text-gray-500 text-sm shrink-0';
const VALUE = 'text-gray-100 text-sm text-right';

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
  const rows: [string, string | number | null][] = [
    ['Marca', specs.marca],
    ['Modelo', specs.modelo],
    ['Año', specs.año],
    ['Motor', specs.motor],
    ['Transmisión', specs.transmision],
    ['Tracción', specs.traccion],
    ['Carrocería', specs.carroceria],
    ['Color', specs.color],
    ['País origen', specs.pais_origen],
  ];

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      {/* Preview */}
      <img
        src={previewUrl}
        alt="Auto capturado"
        className="w-full h-48 object-cover rounded-xl"
      />

      {/* Specs card */}
      <div className="bg-gray-900 rounded-xl px-4 py-2">
        <p className="text-violet-400 text-xs font-semibold uppercase tracking-wide pt-2 pb-1">
          Identificación
        </p>
        {rows.map(([label, val]) =>
          val != null ? (
            <div key={label} className={ROW}>
              <span className={LABEL}>{label}</span>
              <span className={VALUE}>{val}</span>
            </div>
          ) : null,
        )}
        {specs.notas && (
          <div className="py-2">
            <p className={LABEL}>Notas</p>
            <p className="text-gray-300 text-sm mt-1">{specs.notas}</p>
          </div>
        )}
      </div>

      {/* Location */}
      {!hasCoords && (
        <div className="bg-gray-900 rounded-xl p-4 flex flex-col gap-3">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wide">
            Sin GPS — ingresa coordenadas (opcional)
          </p>
          <div className="flex gap-3">
            <input
              type="number"
              step="any"
              placeholder="Latitud"
              value={manualLat}
              onChange={(e) => onManualLat(e.target.value)}
              className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-600"
            />
            <input
              type="number"
              step="any"
              placeholder="Longitud"
              value={manualLng}
              onChange={(e) => onManualLng(e.target.value)}
              className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-600"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <button
        onClick={onSave}
        disabled={saving}
        className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-4 rounded-2xl transition-colors"
      >
        {saving ? 'Guardando...' : 'Guardar'}
      </button>
      <button
        onClick={onCancel}
        disabled={saving}
        className="w-full bg-transparent text-gray-400 hover:text-white font-medium py-2 transition-colors"
      >
        Cancelar
      </button>
    </div>
  );
}
