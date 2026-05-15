import { useState } from 'react';
import { Capture } from './pages/Capture';
import { History } from './pages/History';

type Tab = 'capture' | 'history';

export function App() {
  const [tab, setTab] = useState<Tab>('capture');

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* App header */}
      <div className="pt-safe shrink-0">
        <div className="px-4 pt-4 pb-4">
          <h1 className="text-2xl font-bold text-white">CarSnap</h1>
          <p className="text-gray-500 text-sm">Identifica autos con IA</p>
        </div>
      </div>

      {/* Page content — fills space above nav */}
      <main className="flex-1 overflow-hidden">
        {tab === 'capture' ? <Capture /> : <History />}
      </main>

      {/* Bottom navigation */}
      <nav className="shrink-0 bg-gray-900 border-t border-gray-800 flex pb-safe">
        <button
          onClick={() => setTab('capture')}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
            tab === 'capture' ? 'text-violet-400' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <span className="text-xl">📷</span>
          Capturar
        </button>
        <button
          onClick={() => setTab('history')}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
            tab === 'history' ? 'text-violet-400' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <span className="text-xl">🗂️</span>
          Historial
        </button>
      </nav>
    </div>
  );
}
