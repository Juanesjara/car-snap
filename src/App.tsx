import { useState, type FormEvent } from 'react';
import { getPassword, login } from './lib/api';
import { Capture } from './pages/Capture';
import { History } from './pages/History';
import { MapView } from './pages/MapView';

type Tab = 'capture' | 'history' | 'map';

export function App() {
  const [tab, setTab] = useState<Tab>('capture');
  const [authed, setAuthed] = useState(() => getPassword() != null);

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

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
        {tab === 'capture' && <Capture />}
        {tab === 'history' && <History />}
        {tab === 'map' && <MapView />}
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
        <button
          onClick={() => setTab('map')}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
            tab === 'map' ? 'text-violet-400' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <span className="text-xl">🗺️</span>
          Mapa
        </button>
      </nav>
    </div>
  );
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (await login(password)) onSuccess();
      else setError('Contraseña incorrecta');
    } catch {
      setError('No se pudo conectar');
    }
    setBusy(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full justify-center px-6 bg-gray-950">
      <h1 className="text-2xl font-bold text-white">CarSnap</h1>
      <input
        type="password"
        autoComplete="current-password"
        placeholder="Contraseña"
        aria-label="Contraseña"
        value={password}
        onChange={(e) => setPasswordInput(e.target.value)}
        className="w-full bg-gray-900 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        disabled={busy || !password}
        className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors"
      >
        {busy ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
