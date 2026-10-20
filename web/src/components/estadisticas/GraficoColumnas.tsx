'use client';

import { useState } from 'react';
import type { Serie } from '@/lib/estadisticas-espana';

// es-ES no agrupa los números de 4 cifras (7869); de-DE usa el mismo punto y sí lo hace.
const fmt = new Intl.NumberFormat('de-DE');

// Máximo "redondo" del eje y sus marcas (4 divisiones).
function escala(max: number) {
  if (max <= 0) return { tope: 1, marcas: [0, 1] };
  const paso0 = max / 4;
  const pot = 10 ** Math.floor(Math.log10(paso0));
  const paso = [1, 2, 2.5, 5, 10].map((m) => m * pot).find((p) => p >= paso0) ?? 10 * pot;
  const tope = Math.ceil(max / paso) * paso;
  const marcas = Array.from({ length: Math.round(tope / paso) + 1 }, (_, i) => i * paso);
  return { tope, marcas };
}

// Gráfico de columnas con una pestaña por serie, como el de Datawrapper de la
// página WordPress: se ve una serie a la vez y el valor aparece al pasar el ratón.
export default function GraficoColumnas({
  categorias,
  series,
  titulo,
}: {
  categorias: string[];
  series: Serie[];
  titulo: string;
}) {
  const [activa, setActiva] = useState(0);
  const [foco, setFoco] = useState<number | null>(null);
  const [verTabla, setVerTabla] = useState(false);

  const serie = series[activa];
  const { tope, marcas } = escala(Math.max(...serie.valores.map((v) => v ?? 0)));
  const densas = categorias.length > 12;

  return (
    <figure className="bg-surface-dark border border-surface-border rounded-2xl p-4 sm:p-6 md:p-8">
      <figcaption className="sr-only">{titulo}</figcaption>

      {series.length > 1 && (
        <div role="tablist" aria-label={titulo} className="flex flex-wrap gap-2 mb-6">
          {series.map((s, i) => (
            <button
              key={s.clave}
              role="tab"
              aria-selected={i === activa}
              onClick={() => setActiva(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                i === activa
                  ? 'bg-primary border-primary text-white'
                  : 'border-surface-border text-secondary hover:text-white hover:border-secondary'
              }`}
            >
              {s.nombre}
            </button>
          ))}
        </div>
      )}

      <div className="relative h-72 sm:h-80 pl-14">
        {/* Rejilla y eje Y */}
        {marcas.map((m) => (
          <div
            key={m}
            className="absolute left-14 right-0 border-t border-surface-border"
            style={{ bottom: `${(m / tope) * 100}%` }}
          >
            <span className="absolute -left-14 w-12 -translate-y-1/2 text-right text-[11px] text-secondary tabular-nums">
              {fmt.format(m)}
            </span>
          </div>
        ))}

        {/* Columnas */}
        <div className="absolute inset-0 left-14 flex items-end gap-[2px] sm:gap-1" onMouseLeave={() => setFoco(null)}>
          {serie.valores.map((v, i) => {
            const alto = v == null ? 0 : (v / tope) * 100;
            const enFoco = foco === i;
            return (
              <div
                key={categorias[i]}
                className="relative flex-1 h-full flex items-end justify-center"
                onMouseEnter={() => setFoco(i)}
                onFocus={() => setFoco(i)}
                onBlur={() => setFoco(null)}
                tabIndex={0}
                aria-label={`${categorias[i]}: ${v == null ? 'sin dato' : fmt.format(v)}`}
              >
                <div
                  className={`w-full max-w-12 rounded-t transition-colors ${enFoco ? 'bg-primary-light' : 'bg-primary'}`}
                  style={{ height: `${alto}%` }}
                />
                {enFoco && v != null && (
                  <div
                    className="absolute z-10 pointer-events-none whitespace-nowrap rounded-lg bg-white text-background-dark px-2.5 py-1.5 text-xs shadow-lg -translate-y-2"
                    style={{ bottom: `${alto}%` }}
                  >
                    <span className="block text-[10px] text-gray-500">{categorias[i]}</span>
                    <span className="font-bold tabular-nums">{fmt.format(v)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Eje X */}
      <div className={`flex gap-[2px] sm:gap-1 pl-14 mt-2 ${densas ? 'h-14' : ''}`}>
        {categorias.map((c) => (
          <div key={c} className="flex-1 min-w-0 flex justify-center">
            <span
              className={`text-[11px] text-secondary whitespace-nowrap ${
                densas ? 'origin-top-left rotate-[-55deg] translate-y-8 translate-x-1' : ''
              }`}
            >
              {c}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setVerTabla((x) => !x)}
        className="mt-4 text-xs font-semibold text-secondary hover:text-white underline underline-offset-4"
      >
        {verTabla ? 'Ocultar datos' : 'Ver datos'}
      </button>

      {verTabla && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-surface-border text-secondary">
                <th className="py-2 pr-4 font-semibold">&nbsp;</th>
                {series.map((s) => (
                  <th key={s.clave} className="py-2 px-2 font-semibold text-right">
                    {s.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categorias.map((c, i) => (
                <tr key={c} className="border-b border-surface-border/50">
                  <td className="py-1.5 pr-4 text-secondary whitespace-nowrap">{c}</td>
                  {series.map((s) => (
                    <td key={s.clave} className="py-1.5 px-2 text-right tabular-nums">
                      {s.valores[i] == null ? '—' : fmt.format(s.valores[i] as number)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </figure>
  );
}
