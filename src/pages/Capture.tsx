import { useState } from 'react';
import { PhotoPicker } from '../components/PhotoPicker';
import { AnalysisResult } from '../components/AnalysisResult';
import { Toast } from '../components/Toast';
import { analyzeCarImage } from '../lib/claude';
import { extractMetadata } from '../lib/exif';
import { fileToBase64 } from '../lib/image';
import { uploadPhoto, saveSighting } from '../lib/supabase';
import type { CarSpecs } from '../types';

type Stage = 'pick' | 'loading' | 'result' | 'saving';

interface PhotoState {
  file: File;
  previewUrl: string;
  source: 'camera' | 'gallery';
  lat: number | null;
  lng: number | null;
  date: Date | null;
}

export function Capture() {
  const [stage, setStage] = useState<Stage>('pick');
  const [photo, setPhoto] = useState<PhotoState | null>(null);
  const [specs, setSpecs] = useState<CarSpecs | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handlePhoto(file: File, source: 'camera' | 'gallery') {
    setStage('loading');
    setError(null);
    setSpecs(null);

    const previewUrl = URL.createObjectURL(file);
    let lat: number | null = null;
    let lng: number | null = null;
    let date: Date | null = null;

    if (source === 'gallery') {
      const meta = await extractMetadata(file);
      lat = meta.lat;
      lng = meta.lng;
      date = meta.date;
    } else {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 6000,
            maximumAge: 0,
          }),
        );
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch {
        // Geolocation unavailable or denied — user can enter manually
      }
    }

    setPhoto({ file, previewUrl, source, lat, lng, date });

    try {
      const { base64, mediaType } = await fileToBase64(file);
      const result = await analyzeCarImage(base64, mediaType);
      setSpecs(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al analizar la imagen');
    }

    setStage('result');
  }

  async function handleSave() {
    if (!photo || !specs) return;
    setStage('saving');

    try {
      const photoUrl = await uploadPhoto(photo.file);

      const finalLat = photo.lat ?? (manualLat ? parseFloat(manualLat) : null);
      const finalLng = photo.lng ?? (manualLng ? parseFloat(manualLng) : null);

      await saveSighting({
        photo_url: photoUrl,
        marca: specs.marca,
        modelo: specs.modelo,
        año: specs.año,
        specs: {
          motor: specs.motor,
          transmision: specs.transmision,
          traccion: specs.traccion,
          carroceria: specs.carroceria,
          color: specs.color,
          pais_origen: specs.pais_origen,
          notas: specs.notas,
        },
        latitude: finalLat,
        longitude: finalLng,
        taken_at: (photo.date ?? new Date()).toISOString(),
        source: photo.source,
      });

      URL.revokeObjectURL(photo.previewUrl);
      setPhoto(null);
      setSpecs(null);
      setManualLat('');
      setManualLng('');
      setStage('pick');
      showToast('Auto guardado correctamente');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
      setStage('result');
    }
  }

  function handleCancel() {
    if (photo) URL.revokeObjectURL(photo.previewUrl);
    setPhoto(null);
    setSpecs(null);
    setError(null);
    setManualLat('');
    setManualLng('');
    setStage('pick');
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 pt-safe pt-6 pb-4 shrink-0">
        <h1 className="text-2xl font-bold text-white mt-4">CarSnap</h1>
        <p className="text-gray-500 text-sm">Identifica autos con IA</p>
      </div>

      {/* Content */}
      {stage === 'pick' && <PhotoPicker onPhoto={handlePhoto} />}

      {stage === 'loading' && photo && (
        <div className="flex flex-col items-center gap-6 px-4 py-8">
          <img
            src={photo.previewUrl}
            alt="Foto seleccionada"
            className="w-full max-w-sm h-56 object-cover rounded-xl"
          />
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Analizando con Claude Vision…</p>
          </div>
        </div>
      )}

      {stage === 'result' && photo && (
        <>
          {error ? (
            <div className="flex flex-col items-center gap-4 px-4 py-8">
              <img
                src={photo.previewUrl}
                alt="Foto"
                className="w-full max-w-sm h-48 object-cover rounded-xl opacity-50"
              />
              <div className="bg-red-900/40 border border-red-700 rounded-xl px-4 py-3 w-full max-w-sm">
                <p className="text-red-400 text-sm font-medium">Error</p>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Volver a intentar
              </button>
            </div>
          ) : specs ? (
            <AnalysisResult
              specs={specs}
              previewUrl={photo.previewUrl}
              hasCoords={photo.lat != null && photo.lng != null}
              manualLat={manualLat}
              manualLng={manualLng}
              onManualLat={setManualLat}
              onManualLng={setManualLng}
              onSave={handleSave}
              onCancel={handleCancel}
              saving={false}
            />
          ) : null}
        </>
      )}

      {stage === 'saving' && photo && specs && (
        <AnalysisResult
          specs={specs}
          previewUrl={photo.previewUrl}
          hasCoords={photo.lat != null && photo.lng != null}
          manualLat={manualLat}
          manualLng={manualLng}
          onManualLat={setManualLat}
          onManualLng={setManualLng}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={true}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}
