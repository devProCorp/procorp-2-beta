'use client';

// «Explorador de inversiones» de /elecciones-2026/. Envía a /api/interes de
// inversion.pro-corp.net como consulta general, igual que /contact/: valida, guarda en
// Supabase, copia en HubSpot y avisa al equipo. Las preferencias (sector, mercado,
// rango, horizonte) no son campos del catálogo del servidor, así que viajan en el
// mensaje, legibles para quien atiende la consulta.

import { useEffect, useRef, useState, type FormEvent } from 'react';

const API_INTERES = `${process.env.NEXT_PUBLIC_INVERSION_URL ?? 'https://inversion.pro-corp.net'}/api/interes`;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const PREFERENCIAS = [
  {
    id: 'sector',
    etiqueta: 'Interés de inversión',
    opciones: ['Sector inmobiliario', 'Tokenización inmobiliaria', 'Tecnología', 'Energía', 'Otras oportunidades'],
  },
  { id: 'mercado', etiqueta: 'Mercado de interés', opciones: ['España', 'Colombia', 'República Dominicana', 'Otro'] },
  {
    id: 'rango',
    etiqueta: 'Rango de inversión',
    opciones: ['Menos de 50.000 €', '50.000 € – 100.000 €', '100.000 € – 500.000 €', 'Más de 500.000 €', 'Aún no lo he definido'],
  },
  {
    id: 'horizonte',
    etiqueta: 'Horizonte de inversión',
    opciones: ['Corto plazo', 'Mediano plazo', 'Largo plazo', 'Aún no lo he definido'],
  },
] as const;

const CAMPO =
  'w-full rounded-xl border border-surface-border bg-background-dark/60 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-primary/70 outline-none aria-[invalid=true]:border-red-400';

export default function FormularioInversion() {
  // Momento en que se abrió la página: la API descarta envíos en menos de 1,5 s (bots).
  const abierto = useRef(0);
  useEffect(() => {
    abierto.current = Date.now();
  }, []);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const nombre = String(f.get('nombre') ?? '').trim();
    const email = String(f.get('email') ?? '').trim();
    const nuevos: Record<string, string> = {};
    if (nombre.length < 3) nuevos.nombre = 'Escribe tu nombre completo.';
    if (!EMAIL.test(email)) nuevos.email = 'Escribe un correo electrónico válido.';
    if (!f.get('consentimiento')) nuevos.consentimiento = 'Necesitamos tu autorización para contactarte.';
    setErrores(nuevos);
    if (Object.keys(nuevos).length) return;

    const mensaje = [
      'Consulta desde la página de las Elecciones Generales 2026 (Explorador de inversiones).',
      ...PREFERENCIAS.map((p) => `${p.etiqueta}: ${f.get(p.id)}`),
    ].join('\n');

    setEstado('sending');
    try {
      const res = await fetch(API_INTERES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          general: true,
          campos: { nombre, email, mensaje },
          consentimiento: true,
          origen: { idioma: 'es', pagina: window.location.pathname, referente: document.referrer },
          sitio_web: f.get('sitio_web'),
          ms_abierto: Date.now() - abierto.current,
        }),
      });
      setEstado(res.ok ? 'success' : 'error');
    } catch {
      setEstado('error');
    }
  }

  if (estado === 'success') {
    return (
      <div role="status" className="space-y-3 py-4">
        <p className="text-xl font-bold">Gracias, hemos recibido tu consulta.</p>
        <p className="text-sm text-secondary">
          El equipo de PRO CORP revisará tus preferencias y te escribirá con las oportunidades que encajen.
          Mientras tanto, puedes ver los proyectos publicados.
        </p>
        <a href="/projects/" className="inline-flex px-5 py-3 rounded-full bg-primary text-white text-sm font-bold hover:opacity-90">
          Ver proyectos
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {PREFERENCIAS.map((p) => (
          <label key={p.id} className="flex flex-col gap-2 text-xs font-bold text-gray-200">
            {p.etiqueta}
            <select name={p.id} className={CAMPO} defaultValue={p.opciones[0]}>
              {p.opciones.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2 text-xs font-bold text-gray-200">
          Nombre completo
          <input name="nombre" autoComplete="name" placeholder="Tu nombre" aria-invalid={!!errores.nombre} className={CAMPO} />
          {errores.nombre && <span className="font-normal text-red-300">{errores.nombre}</span>}
        </label>
        <label className="flex flex-col gap-2 text-xs font-bold text-gray-200">
          Correo electrónico
          <input name="email" type="email" autoComplete="email" placeholder="tu@correo.com" aria-invalid={!!errores.email} className={CAMPO} />
          {errores.email && <span className="font-normal text-red-300">{errores.email}</span>}
        </label>
      </div>
      {/* Trampa para bots: invisible para las personas. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
        <input name="sitio_web" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="flex gap-3 items-start text-xs text-secondary">
        <input type="checkbox" name="consentimiento" className="mt-0.5 h-4 w-4 shrink-0" aria-invalid={!!errores.consentimiento} />
        <span>
          Autorizo a PRO CORP a tratar mis datos de contacto para responder a mi consulta de inversión, conforme a la{' '}
          <a href="/politica-de-privacidad/" className="underline hover:text-white">política de privacidad</a> y la{' '}
          <a href="/tratamiento-de-datos-personales/" className="underline hover:text-white">política de tratamiento de datos</a>.
        </span>
      </label>
      {errores.consentimiento && <p className="text-xs text-red-300">{errores.consentimiento}</p>}
      <button
        type="submit"
        disabled={estado === 'sending'}
        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-white text-sm font-bold hover:opacity-90 disabled:opacity-60"
      >
        {estado === 'sending' ? 'Enviando…' : 'Explorar oportunidades'}
      </button>
      {estado === 'error' && (
        <p role="alert" className="text-sm text-red-300">
          No pudimos enviar tu consulta. Inténtalo de nuevo o escríbenos desde la página de contacto.
        </p>
      )}
    </form>
  );
}
