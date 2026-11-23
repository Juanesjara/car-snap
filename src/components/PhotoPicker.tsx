import { useRef } from 'react';
import { CameraIcon, GalleryIcon } from './icons';

interface Props {
  onPhoto: (file: File, source: 'camera' | 'gallery') => void;
}

export function PhotoPicker({ onPhoto }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handle = (source: 'camera' | 'gallery') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onPhoto(file, source);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-3 px-5 pb-6">
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handle('camera')}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handle('gallery')}
      />

      <button
        onClick={() => cameraRef.current?.click()}
        className="w-full flex items-center gap-4 bg-brand-600 active:bg-brand-700 text-white p-4 rounded-2xl transition-colors duration-200 text-left"
      >
        <span className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <CameraIcon className="w-6 h-6" strokeWidth={2} />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">Tomar foto</span>
          <span className="block text-[13px] text-blue-100/80">Abre la cámara trasera</span>
        </span>
      </button>

      <button
        onClick={() => galleryRef.current?.click()}
        className="w-full flex items-center gap-4 bg-surface border border-line active:bg-raised text-ink p-4 rounded-2xl transition-colors duration-200 text-left"
      >
        <span className="w-12 h-12 rounded-xl bg-raised flex items-center justify-center shrink-0 text-brand-400">
          <GalleryIcon className="w-6 h-6" strokeWidth={2} />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">Elegir de la galería</span>
          <span className="block text-[13px] text-muted">Usa la ubicación guardada en la foto</span>
        </span>
      </button>
    </div>
  );
}
