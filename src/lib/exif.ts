import exifr from 'exifr';

export interface PhotoMeta {
  date: Date | null;
  lat: number | null;
  lng: number | null;
}

export async function extractMetadata(file: File): Promise<PhotoMeta> {
  try {
    const [exif, gps] = await Promise.all([
      exifr.parse(file, { pick: ['DateTimeOriginal'] }).catch(() => null),
      exifr.gps(file).catch(() => null),
    ]);
    return {
      date: (exif?.DateTimeOriginal as Date | undefined) ?? null,
      lat: gps?.latitude ?? null,
      lng: gps?.longitude ?? null,
    };
  } catch {
    return { date: null, lat: null, lng: null };
  }
}
