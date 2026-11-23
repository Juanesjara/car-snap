import type { ReactNode } from 'react';
import { CarIcon } from './icons';

interface Props {
  title: string;
  subtitle?: ReactNode;
  /** Solo en la pantalla de inicio: el nombre de la app hace de antetítulo. */
  brand?: boolean;
}

// Un solo bloque de título por pantalla. La marca va como antetítulo pequeño,
// no como un segundo <h1> compitiendo con el de la página.
export function ScreenHeader({ title, subtitle, brand = false }: Props) {
  return (
    <header className="px-5 pt-5 pb-4 shrink-0">
      {brand && (
        <div className="flex items-center gap-1.5 mb-2 text-brand-400">
          <CarIcon className="w-4 h-4" strokeWidth={2} />
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">CarSnap</span>
        </div>
      )}
      <h1 className="text-[28px] leading-tight font-bold tracking-tight text-ink">{title}</h1>
      {subtitle && <p className="text-muted text-sm mt-1">{subtitle}</p>}
    </header>
  );
}
