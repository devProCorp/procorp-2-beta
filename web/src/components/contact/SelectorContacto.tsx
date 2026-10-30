'use client';

// Desplegable del formulario de contacto. Sustituye al <select> nativo, cuya lista
// la pinta el sistema operativo. Con `buscador`, una caja filtra las opciones.

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

export interface OpcionContacto {
  value: string;
  label: string;
}

const normalizar = (v: string) =>
  v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase();

export default function SelectorContacto({
  etiqueta,
  icono,
  ayuda,
  valor,
  opciones,
  onCambiar,
  buscador,
}: {
  etiqueta: string;
  icono: string;
  /** Texto del botón cuando no hay nada elegido. */
  ayuda: string;
  valor: string;
  opciones: OpcionContacto[];
  onCambiar: (valor: string) => void;
  buscador?: { ayuda: string; sinResultados: string };
}) {
  const id = useId();
  const [abierto, setAbierto] = useState(false);
  const [resaltada, setResaltada] = useState(0);
  const [consulta, setConsulta] = useState('');
  const raiz = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const lista = useRef<HTMLUListElement>(null);
  const caja = useRef<HTMLInputElement>(null);

  const visibles = buscador
    ? opciones.filter((o) => normalizar(o.label).includes(normalizar(consulta)))
    : opciones;
  const actual = opciones.find((o) => o.value === valor);

  const abrir = () => {
    setConsulta('');
    setResaltada(Math.max(opciones.findIndex((o) => o.value === valor), 0));
    setAbierto(true);
  };
  const cerrar = () => {
    setAbierto(false);
    boton.current?.focus();
  };
  const elegir = (o: OpcionContacto) => {
    onCambiar(o.value);
    cerrar();
  };

  useLayoutEffect(() => {
    if (abierto) (caja.current ?? lista.current)?.focus({ preventScroll: true });
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    lista.current
      ?.querySelector(`[data-indice="${resaltada}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [abierto, resaltada]);

  useEffect(() => {
    if (!abierto) return;
    const alPulsarFuera = (e: PointerEvent) => {
      if (!raiz.current?.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener('pointerdown', alPulsarFuera);
    return () => document.removeEventListener('pointerdown', alPulsarFuera);
  }, [abierto]);

  const alTeclear = (e: React.KeyboardEvent) => {
    const ultima = visibles.length - 1;
    // En la caja, las letras y el espacio son para escribir.
    if (buscador && (e.key.length === 1 || e.key === 'Home' || e.key === 'End')) return;
    if (e.key === 'ArrowDown') setResaltada((i) => Math.min(i + 1, ultima));
    else if (e.key === 'ArrowUp') setResaltada((i) => Math.max(i - 1, 0));
    else if (e.key === 'Home') setResaltada(0);
    else if (e.key === 'End') setResaltada(ultima);
    else if (e.key === 'Enter' || e.key === ' ') {
      if (visibles[resaltada]) elegir(visibles[resaltada]);
    } else if (e.key === 'Escape') cerrar();
    else if (e.key === 'Tab') setAbierto(false);
    else return;
    if (e.key !== 'Tab') e.preventDefault();
  };

  return (
    <div ref={raiz} className="relative flex flex-col gap-2">
      <span id={`${id}-etiqueta`} className="text-sm font-medium text-gray-200">
        {etiqueta}
      </span>
      <button
        ref={boton}
        id={`${id}-boton`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-labelledby={`${id}-etiqueta ${id}-boton`}
        onClick={() => (abierto ? setAbierto(false) : abrir())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            abrir();
          }
        }}
        className="group relative flex w-full items-center rounded-xl border border-surface-border/80 bg-background-dark/50 py-3.5 pl-12 pr-11 text-left text-sm outline-none backdrop-blur-sm transition-all focus:border-primary/60 focus:shadow-[0_0_15px_rgba(206,16,38,0.15)]"
      >
        <span className="material-symbols-outlined pointer-events-none absolute left-4 text-[20px] text-gray-400 transition-colors group-focus:text-primary">
          {icono}
        </span>
        <span className={`truncate ${actual ? 'text-white' : 'text-gray-400'}`}>{actual?.label ?? ayuda}</span>
        <span
          className={`material-symbols-outlined pointer-events-none absolute right-4 text-gray-400 transition-transform ${abierto ? 'rotate-180' : ''}`}
        >
          expand_more
        </span>
      </button>

      {abierto && (
        <div
          onKeyDown={alTeclear}
          className="absolute left-0 right-0 top-full z-30 mt-1.5 overflow-hidden rounded-xl border border-surface-border bg-surface-dark shadow-2xl shadow-black/50"
        >
          {buscador && (
            <div className="border-b border-surface-border p-2">
              <input
                ref={caja}
                type="text"
                role="combobox"
                aria-expanded
                aria-controls={`${id}-lista`}
                aria-autocomplete="list"
                aria-labelledby={`${id}-etiqueta`}
                aria-activedescendant={visibles[resaltada] ? `${id}-opcion-${resaltada}` : undefined}
                placeholder={buscador.ayuda}
                autoComplete="off"
                value={consulta}
                onChange={(e) => {
                  setConsulta(e.target.value);
                  setResaltada(0);
                }}
                className="h-10 w-full rounded-lg bg-white/5 px-3 text-base text-white outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-primary/60 sm:text-sm"
              />
            </div>
          )}
          <ul
            ref={lista}
            id={`${id}-lista`}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={`${id}-etiqueta`}
            aria-activedescendant={buscador ? undefined : `${id}-opcion-${resaltada}`}
            className="max-h-72 overflow-y-auto p-1.5 outline-none"
          >
            {visibles.map((o, i) => {
              const elegida = o.value === valor;
              return (
                <li
                  key={o.value}
                  id={`${id}-opcion-${i}`}
                  role="option"
                  aria-selected={elegida}
                  data-indice={i}
                  onClick={() => elegir(o)}
                  onPointerMove={() => setResaltada(i)}
                  className={`flex min-h-10 cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm text-white ${
                    i === resaltada ? 'bg-white/10' : ''
                  } ${elegida ? 'font-semibold' : ''}`}
                >
                  {o.label}
                  {elegida && <span className="material-symbols-outlined text-[18px] text-primary-light">check</span>}
                </li>
              );
            })}
            {visibles.length === 0 && <li className="px-3 py-2 text-sm text-gray-400">{buscador?.sinResultados}</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
