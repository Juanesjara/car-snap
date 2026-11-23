type Row = [string, string | number | null | undefined];

interface Props {
  title: string;
  rows: Row[];
  notes?: string | null;
}

// Tarjeta de ficha técnica compartida por el resultado del análisis y el detalle.
export function SpecList({ title, rows, notes }: Props) {
  const visible = rows.filter(([, v]) => v != null && v !== '');
  if (visible.length === 0 && !notes) return null;

  return (
    <section className="bg-surface border border-line rounded-2xl px-4 py-1">
      <h2 className="text-brand-400 text-[11px] font-semibold uppercase tracking-[0.12em] pt-3 pb-1">
        {title}
      </h2>
      <dl>
        {visible.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between gap-4 py-2.5 border-b border-line last:border-0"
          >
            <dt className="text-faint text-sm shrink-0">{label}</dt>
            <dd className="text-ink text-sm text-right tnum">{value}</dd>
          </div>
        ))}
      </dl>
      {notes && (
        <div className="py-3 border-t border-line">
          <p className="text-faint text-sm">Notas</p>
          <p className="text-muted text-sm mt-1 leading-relaxed">{notes}</p>
        </div>
      )}
    </section>
  );
}
