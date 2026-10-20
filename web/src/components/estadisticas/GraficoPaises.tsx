'use client';

import { useState } from 'react';
import type { PaisSefardi } from '@/lib/estadisticas-espana';

// es-ES no agrupa los números de 4 cifras (7869); de-DE usa el mismo punto y sí lo hace.
const fmt = new Intl.NumberFormat('de-DE');
const VISIBLES = 15;

const METRICAS = [
  { clave: 'solicitantes', nombre: 'Solicitantes' },
  { clave: 'concesiones', nombre: 'Concesiones' },
] as const;

// Barras horizontales por país de origen (Ley 12/2015), ordenadas por la métrica elegida.
export default function GraficoPaises({ paises }: { paises: PaisSefardi[] }) {
  const [metrica, setMetrica] = useState<(typeof METRICAS)[number]['clave']>('solicitantes');
  const [todos, setTodos] = useState(false);

  const orden = [...paises].filter((p) => p[metrica] > 0).sort((a, b) => b[metrica] - a[metrica]);
  const filas = todos ? orden : orden.slice(0, VISIBLES);
  const max = orden[0]?.[metrica] ?? 1;

  return (
    <figure className="bg-surface-dark border border-surface-border rounded-2xl p-4 sm:p-6 md:p-8">
      <figcaption className="sr-only">Ley 12/2015 por país de origen</figcaption>

      <div role="tablist" aria-label="Métrica" className="flex flex-wrap gap-2 mb-6">
        {METRICAS.map((m) => (
          <button
            key={m.clave}
            role="tab"
            aria-selected={m.clave === metrica}
            onClick={() => setMetrica(m.clave)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              m.clave === metrica
                ? 'bg-primary border-primary text-white'
                : 'border-surface-border text-secondary hover:text-white hover:border-secondary'
            }`}
          >
            {m.nombre}
          </button>
        ))}
      </div>

      <ol className="space-y-2">
        {filas.map((p) => (
          <li
            key={p.pais}
            className="grid grid-cols-[7.5rem_1fr_4.5rem] sm:grid-cols-[11rem_1fr_5rem] items-center gap-3 text-xs"
            title={`${p.pais}: ${fmt.format(p.solicitantes)} solicitantes · ${fmt.format(p.concesiones)} concesiones`}
          >
            <span className="truncate text-gray-300">{p.pais}</span>
            <span className="h-4 rounded-r bg-surface-border/40">
              <span
                className="block h-full rounded-r bg-primary"
                style={{ width: `${Math.max((p[metrica] / max) * 100, 0.5)}%` }}
              />
            </span>
            <span className="text-right tabular-nums font-semibold">{fmt.format(p[metrica])}</span>
          </li>
        ))}
      </ol>

      {orden.length > VISIBLES && (
        <button
          onClick={() => setTodos((x) => !x)}
          className="mt-5 text-xs font-semibold text-secondary hover:text-white underline underline-offset-4"
        >
          {todos ? `Ver sólo los ${VISIBLES} primeros` : `Ver los ${orden.length} países`}
        </button>
      )}
    </figure>
  );
}
