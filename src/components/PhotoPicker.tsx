import { useRef } from 'react';

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
    <div className="flex flex-col items-center gap-6 p-8">
      {/* Hidden inputs */}
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

      {/* Camera button */}
      <button
        onClick={() => cameraRef.current?.click()}
        className="w-full max-w-xs flex flex-col items-center gap-3 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold py-6 rounded-2xl transition-colors"
      >
        <span className="text-4xl">📷</span>
        <span className="text-lg">Cámara</span>
        <span className="text-xs text-violet-200 font-normal">Abre la cámara trasera</span>
      </button>

      {/* Gallery button */}
      <button
        onClick={() => galleryRef.current?.click()}
        className="w-full max-w-xs flex flex-col items-center gap-3 bg-gray-800 hover:bg-gray-700 active:bg-gray-900 text-white font-semibold py-6 rounded-2xl transition-colors border border-gray-700"
      >
        <span className="text-4xl">🖼️</span>
        <span className="text-lg">Galería</span>
        <span className="text-xs text-gray-400 font-normal">Importa desde tus fotos</span>
      </button>
    </div>
  );
}
