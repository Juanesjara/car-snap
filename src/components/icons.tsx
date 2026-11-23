import type { ReactNode } from 'react';

// Iconos en línea, trazo 1.75 y grilla de 24 — mismo estilo para toda la app.
// Decorativos por defecto: siempre van junto a una etiqueta de texto visible.
// Si alguno queda solo en un botón, ese botón lleva su propio aria-label.

interface Props {
  className?: string;
  strokeWidth?: number;
}

function Svg({ children, className = 'w-6 h-6', strokeWidth = 1.75 }: Props & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const CameraIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M14.5 4h-5L7.5 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5L14.5 4Z" />
    <circle cx="12" cy="13" r="3.5" />
  </Svg>
);

export const GalleryIcon = (p: Props) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2.5" />
    <circle cx="8.5" cy="8.5" r="1.75" />
    <path d="m21 14.5-4-4L8 19.5" />
  </Svg>
);

export const GridIcon = (p: Props) => (
  <Svg {...p}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
  </Svg>
);

export const MapIcon = (p: Props) => (
  <Svg {...p}>
    <path d="m9 4-6 2.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4Z" />
    <path d="M9 4v13.5" />
    <path d="M15 6.5V20" />
  </Svg>
);

export const CarIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M5 11.5 6.7 6.9A2 2 0 0 1 8.6 5.5h6.8a2 2 0 0 1 1.9 1.4l1.7 4.6" />
    <path d="M3.5 11.5h17V16a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-.8h-8v.8a1 1 0 0 1-1 1H6.5a1 1 0 0 1-1-1v-4.5Z" />
    <path d="M7.5 14h.01M16.5 14h.01" strokeWidth="2.25" />
  </Svg>
);

export const PinIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M20 10.5c0 5.5-8 11.5-8 11.5s-8-6-8-11.5a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10.5" r="2.75" />
  </Svg>
);

export const SearchIcon = (p: Props) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.6-3.6" />
  </Svg>
);

export const ChevronRightIcon = (p: Props) => (
  <Svg {...p}>
    <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
  </Svg>
);

export const ArrowLeftIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M20 12H4" />
    <path d="m10.5 18.5-6.5-6.5 6.5-6.5" />
  </Svg>
);

export const CheckIcon = (p: Props) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Svg>
);

export const AlertIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M12 3.5 2.5 20.5h19L12 3.5Z" />
    <path d="M12 10v4.5" />
    <path d="M12 17.5h.01" strokeWidth="2.25" />
  </Svg>
);
