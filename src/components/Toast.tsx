import { CheckIcon } from './icons';

interface Props {
  message: string;
}

export function Toast({ message }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-raised border border-line text-ink pl-3 pr-4 py-2.5 rounded-full text-sm font-medium shadow-xl shadow-black/40 animate-toast-in"
    >
      <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
        <CheckIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
      </span>
      {message}
    </div>
  );
}
