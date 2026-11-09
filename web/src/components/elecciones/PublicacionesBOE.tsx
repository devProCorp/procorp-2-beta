'use client';

import { useEffect, useRef, useState } from 'react';
import { CONVOCATORIA, PALABRAS_BOE } from '@/lib/elecciones-2026';

// Publicaciones recientes del BOE sobre el proceso electoral, leídas en vivo de la
// API de datos abiertos del BOE (permite CORS). La web es estática, así que se
// consulta desde el navegador y solo cuando la sección entra en pantalla: cada
// sumario pesa unos 400 KB. Sin respuesta, queda la convocatoria fija.

const API = 'https://www.boe.es/datosabiertos/api/boe/sumario';
const DIAS = 4;

interface Publicacion {
  id: string;
  titulo: string;
  url: string;
  fecha: string;
}

const normalizar = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const PALABRAS = PALABRAS_BOE.map(normalizar);

/** Últimos n días con BOE en hora de Madrid, como AAAAMMDD. El BOE no sale los
 *  domingos, y ese 404 llega sin cabecera CORS (error en la consola): se saltan. */
function ultimosDias(n: number): string[] {
  const out: string[] = [];
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
  for (let i = 0; out.length < n && i < n + 3; i++) {
    const partes = Object.fromEntries(fmt.formatToParts(new Date(Date.now() - i * 86_400_000)).map((p) => [p.type, p.value]));
    if (partes.weekday !== 'Sun') out.push(`${partes.year}${partes.month}${partes.day}`);
  }
  return out;
}

function recoger(nodo: unknown, fecha: string, out: Publicacion[]) {
  if (Array.isArray(nodo)) {
    for (const x of nodo) recoger(x, fecha, out);
  } else if (nodo && typeof nodo === 'object') {
    const o = nodo as Record<string, unknown>;
    if (typeof o.titulo === 'string' && typeof o.identificador === 'string' && typeof o.url_html === 'string') {
      const t = normalizar(o.titulo);
      if (PALABRAS.some((p) => t.includes(p))) out.push({ id: o.identificador, titulo: o.titulo, url: o.url_html, fecha });
    }
    for (const v of Object.values(o)) recoger(v, fecha, out);
  }
}

const fechaLegible = (f: string) =>
  new Date(`${f.slice(0, 4)}-${f.slice(4, 6)}-${f.slice(6, 8)}T12:00:00Z`).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
  });

export default function PublicacionesBOE() {
  const caja = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<'espera' | 'cargando' | 'listo' | 'error'>('espera');
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);

  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        setEstado('cargando');
        Promise.allSettled(
          ultimosDias(DIAS).map((f) =>
            fetch(`${API}/${f}`, { headers: { Accept: 'application/json' } })
              .then((r) => (r.ok ? r.json() : null))
              .then((j) => {
                const out: Publicacion[] = [];
                if (j) recoger(j?.data?.sumario, f, out);
                return out;
              }),
          ),
        ).then((res) => {
          const ok = res.filter((r) => r.status === 'fulfilled') as PromiseFulfilledResult<Publicacion[]>[];
          if (!ok.length) return setEstado('error');
          const vistos = new Set<string>();
          setPublicaciones(
            ok.flatMap((r) => r.value).filter((p) => (vistos.has(p.id) ? false : (vistos.add(p.id), true))),
          );
          setEstado('listo');
        });
      },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={caja} className="bg-surface-dark border border-surface-border rounded-2xl p-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold">Publicaciones recientes del BOE</h3>
        <p className="mt-1 text-sm text-secondary">
          Consultado en directo en la API de datos abiertos del Boletín Oficial del Estado (últimos {DIAS} boletines).
        </p>
      </div>
      <ul className="space-y-3 text-sm" aria-live="polite">
        {estado === 'listo' &&
          publicaciones.map((p) => (
            <li key={p.id} className="flex flex-col sm:flex-row sm:gap-4">
              <span className="text-xs text-secondary shrink-0 w-24 pt-0.5">{fechaLegible(p.fecha)}</span>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                {p.titulo}
              </a>
            </li>
          ))}
        {estado === 'listo' && !publicaciones.length && (
          <li className="text-secondary">No hay publicaciones nuevas sobre las elecciones en estos días.</li>
        )}
        {estado === 'cargando' && <li className="text-secondary">Consultando el BOE…</li>}
        {estado === 'error' && (
          <li className="text-secondary">
            No se pudo consultar el BOE en este momento.{' '}
            <a href="https://www.boe.es/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              Abrir boe.es
            </a>
          </li>
        )}
      </ul>
      <p className="text-xs text-secondary border-t border-surface-border pt-4">
        Convocatoria:{' '}
        <a href={CONVOCATORIA.html} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
          {CONVOCATORIA.titulo}
        </a>{' '}
        ({CONVOCATORIA.boe}).
      </p>
    </div>
  );
}
