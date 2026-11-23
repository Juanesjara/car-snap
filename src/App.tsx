import { useState } from 'react';
import { CameraIcon, GridIcon, MapIcon } from './components/icons';
import { Capture } from './pages/Capture';
import { History } from './pages/History';
import { MapView } from './pages/MapView';

type Tab = 'capture' | 'history' | 'map';

const TABS: { id: Tab; label: string; Icon: typeof CameraIcon }[] = [
  { id: 'capture', label: 'Capturar', Icon: CameraIcon },
  { id: 'history', label: 'Historial', Icon: GridIcon },
  { id: 'map', label: 'Mapa', Icon: MapIcon },
];

export function App() {
  const [tab, setTab] = useState<Tab>('capture');

  return (
    <div className="flex flex-col h-full bg-base">
      {/* Cada pantalla trae su propio encabezado: no hay una barra global encima. */}
      <main className="flex-1 overflow-hidden pt-safe">
        {tab === 'capture' && <Capture />}
        {tab === 'history' && <History />}
        {tab === 'map' && <MapView />}
      </main>

      <nav
        aria-label="Secciones"
        className="shrink-0 bg-surface/95 backdrop-blur border-t border-line flex pb-safe"
      >
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              aria-current={active ? 'page' : undefined}
              className={`relative flex-1 min-h-[56px] flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors duration-200 ${
                active ? 'text-brand-400' : 'text-faint active:text-muted'
              }`}
            >
              {/* Indicador de pestaña activa: no desplaza el contenido al cambiar. */}
              <span
                className={`absolute top-0 h-0.5 w-10 rounded-full bg-brand-500 transition-opacity duration-200 ${
                  active ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2 : 1.75} />
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
