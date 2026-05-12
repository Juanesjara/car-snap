const SUPPORTED = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const MAX_DIM = 2048;

export interface ImageData {
  base64: string;
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
}

export function fileToBase64(file: File): Promise<ImageData> {
  if (SUPPORTED.has(file.type)) {
    return readDirect(file);
  }
  // HEIC / HEIF and other formats: convert via canvas
  return convertViaCanvas(file);
}

function readDirect(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve({
        base64: result.split(',')[1],
        mediaType: file.type as ImageData['mediaType'],
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function convertViaCanvas(file: File): Promise<ImageData> {
  const url = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > MAX_DIM || h > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('Canvas conversion failed')); return; }
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve({ base64: result.split(',')[1], mediaType: 'image/jpeg' });
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        },
        'image/jpeg',
        0.85,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')); };
    img.src = url;
  });
}
