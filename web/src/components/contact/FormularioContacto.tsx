'use client';

// Formulario de contacto propio. La web es estática: envía a /api/interes de
// inversion.pro-corp.net, que valida, guarda en Supabase, copia en HubSpot y avisa al
// equipo, igual que «Me interesa» de la app de inversiones. Se adapta a lo que se
// consulta: un proyecto pregunta qué se busca; lo demás, servicio y digitalización.

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import SelectorContacto from './SelectorContacto';

const API_INTERES = `${process.env.NEXT_PUBLIC_INVERSION_URL ?? 'https://inversion.pro-corp.net'}/api/interes`;
const URL_PRIVACIDAD = '/politica-de-privacidad/';
const URL_TRATAMIENTO = '/tratamiento-de-datos-personales/';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEFONO = /^[+()\d][\d\s().-]{5,}$/;

// Valor del catálogo del servidor → clave del texto. No se reordenan: los usa el equipo.
const AREAS: [string, string][] = [
  ['consulting', '5'],
  ['process-mapping', '2'],
  ['operations-simulation', '7'],
  ['financial-simulation', '6'],
  ['reengineering', '3'],
  ['bpa', '1'],
  ['project-mapping-structuring', '8'],
  ['tokenization', '9'],
  ['legal-express', '10'],
  ['business-cockpit', '11'],
  ['lia', '4'],
];
const NIVELES: [string, string][] = [
  ['initial', '1'],
  ['developing', '2'],
  ['advanced', '3'],
  ['optimized', '4'],
];

interface ProyectoContacto {
  path: string;
  nombre: string;
  conPortal: boolean;
}

const CAMPO =
  'w-full rounded-xl border border-surface-border/80 bg-background-dark/50 backdrop-blur-sm pl-12 py-3.5 text-sm text-white placeholder-gray-400 focus:border-primary/60 focus:bg-surface-dark/80 focus:shadow-[0_0_15px_rgba(206,16,38,0.15)] transition-all outline-none aria-[invalid=true]:border-red-400';

export default function FormularioContacto() {
  const { t, lang } = useLanguage();
  const abierto = useRef(Date.now());
  const formulario = useRef<HTMLFormElement>(null);
  const [proyectos, setProyectos] = useState<ProyectoContacto[]>([]);
  const [valores, setValores] = useState<Record<string, string>>({});
  const [proyecto, setProyecto] = useState('');
  const [consentimiento, setConsentimiento] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Si la lista no carga, el formulario sigue sirviendo como consulta general.
  useEffect(() => {
    let vivo = true;
    fetch(`${API_INTERES}?idioma=${lang}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!vivo || !d?.proyectos) return;
        setProyectos(d.proyectos);
        // /contact/?proyecto=gentil llega con ese proyecto ya elegido.
        const pedido = new URLSearchParams(window.location.search).get('proyecto');
        if (pedido && d.proyectos.some((p: ProyectoContacto) => p.path === pedido)) setProyecto(pedido);
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, [lang]);

  const elegido = proyectos.find((p) => p.path === proyecto);

  const cambiar = (id: string, v: string) => {
    setValores((p) => ({ ...p, [id]: v }));
    if (errores[id]) setErrores(({ [id]: _, ...resto }) => resto);
  };

  const elegirProyecto = (v: string) => {
    setProyecto(v);
    const p = proyectos.find((x) => x.path === v);
    // Lo que se preguntó para la otra opción no debe viajar con esta.
    setValores(({ area: _a, nivel: _n, tipo_interes: tipo, ...resto }) =>
      p && (p.conPortal || !tipo?.includes('acceso')) && tipo ? { ...resto, tipo_interes: tipo } : resto,
    );
  };

  const validar = () => {
    const e: Record<string, string> = {};
    const nombre = (valores.nombre ?? '').trim();
    const email = (valores.email ?? '').trim();
    const telefono = (valores.telefono ?? '').trim();
    if (nombre.length < 3) e.nombre = nombre ? t('contact.err.name') : t('contact.err.required');
    if (!EMAIL.test(email)) e.email = email ? t('contact.err.email') : t('contact.err.required');
    if (telefono && !TELEFONO.test(telefono)) e.telefono = t('contact.err.phone');
    if (!consentimiento) e.consentimiento = t('contact.err.consent');
    return e;
  };

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length) {
      requestAnimationFrame(() => formulario.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setEstado('sending');
    try {
      const res = await fetch(API_INTERES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(proyecto ? { proyecto } : { general: true }),
          campos: valores,
          consentimiento,
          origen: {
            idioma: lang,
            pagina: window.location.pathname,
            referente: document.referrer,
          },
          sitio_web: new FormData(e.currentTarget).get('sitio_web'),
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
      <div role="status" className="relative z-10 flex flex-col items-start gap-4 py-8">
        <span className="material-symbols-outlined flex h-14 w-14 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-3xl text-primary">
          check_circle
        </span>
        <h2 className="text-2xl font-extrabold text-white">{t('contact.ok.title')}</h2>
        <p className="text-sm leading-relaxed text-gray-300">
          {elegido ? `${t('contact.ok.project')} ${elegido.nombre}. ` : ''}
          {t('contact.ok.text')}
        </p>
      </div>
    );
  }

  const campo = (id: string, icono: string, tipo: string, autoComplete: string, maxLength: number, etiqueta: string, ayuda: string) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={`contacto-${id}`} className="text-sm font-medium text-gray-200">
        {etiqueta}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
          <span className="material-symbols-outlined text-[20px]">{icono}</span>
        </div>
        <input
          id={`contacto-${id}`}
          className={CAMPO}
          type={tipo}
          placeholder={ayuda}
          autoComplete={autoComplete}
          maxLength={maxLength}
          value={valores[id] ?? ''}
          aria-invalid={!!errores[id]}
          aria-describedby={errores[id] ? `contacto-${id}-error` : undefined}
          onChange={(ev) => cambiar(id, ev.target.value)}
        />
      </div>
      {errores[id] && (
        <p id={`contacto-${id}-error`} className="text-sm text-red-300">
          {errores[id]}
        </p>
      )}
    </div>
  );

  return (
    <form ref={formulario} className="relative z-10 flex flex-col gap-6" onSubmit={enviar} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campo('nombre', 'person', 'text', 'name', 120, t('contact.name'), t('contact.name.ph'))}
        {campo('organizacion', 'domain', 'text', 'organization', 120, t('contact.org'), t('contact.org.ph'))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campo('email', 'alternate_email', 'email', 'email', 200, t('contact.email'), t('contact.email.ph'))}
        {campo('telefono', 'phone_iphone', 'tel', 'tel', 40, t('contact.phone'), t('contact.phone.ph'))}
      </div>

      <SelectorContacto
        etiqueta={t('contact.project')}
        icono="work"
        ayuda={t('contact.project.general')}
        valor={proyecto}
        onCambiar={elegirProyecto}
        buscador={{ ayuda: t('contact.project.search'), sinResultados: t('contact.project.none') }}
        opciones={[
          { value: '', label: t('contact.project.general') },
          ...proyectos.map((p) => ({ value: p.path, label: p.nombre })),
        ]}
      />

      {elegido ? (
        <SelectorContacto
          etiqueta={t('contact.interest')}
          icono="flag"
          ayuda={t('contact.interest.ph')}
          valor={valores.tipo_interes ?? ''}
          onCambiar={(v) => cambiar('tipo_interes', v)}
          opciones={[
            { value: 'invertir', label: t('contact.interest.invest') },
            { value: 'activo', label: t('contact.interest.asset') },
            ...(elegido.conPortal
              ? [
                  { value: 'acceso', label: t('contact.interest.access') },
                  { value: 'invertir_acceso', label: t('contact.interest.both') },
                ]
              : []),
          ]}
        />
      ) : (
        <>
          <SelectorContacto
            etiqueta={t('contact.area')}
            icono="settings_suggest"
            ayuda={t('contact.area.ph')}
            valor={valores.area ?? ''}
            onCambiar={(v) => cambiar('area', v)}
            opciones={AREAS.map(([value, n]) => ({ value, label: t(`contact.area.${n}`) }))}
          />
          <SelectorContacto
            etiqueta={t('contact.level')}
            icono="bar_chart"
            ayuda={t('contact.level.ph')}
            valor={valores.nivel ?? ''}
            onCambiar={(v) => cambiar('nivel', v)}
            opciones={NIVELES.map(([value, n]) => ({ value, label: t(`contact.level.${n}`) }))}
          />
        </>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="contacto-mensaje" className="text-sm font-medium text-gray-200">
          {t('contact.details')}
        </label>
        <textarea
          id="contacto-mensaje"
          className="w-full rounded-xl border border-surface-border/80 bg-background-dark/50 backdrop-blur-sm p-4 text-sm text-white placeholder-gray-400 focus:border-primary/60 focus:bg-surface-dark/80 focus:shadow-[0_0_15px_rgba(206,16,38,0.15)] transition-all resize-none outline-none"
          placeholder={t('contact.details.ph')}
          rows={4}
          maxLength={2000}
          value={valores.mensaje ?? ''}
          onChange={(ev) => cambiar('mensaje', ev.target.value)}
        />
      </div>

      {/* Trampa para bots: invisible para personas y lectores de pantalla. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Sitio web
          <input name="sitio_web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-6">
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              className="mt-0.5 h-5 w-5 flex-shrink-0 accent-primary"
              type="checkbox"
              checked={consentimiento}
              aria-invalid={!!errores.consentimiento}
              aria-describedby={errores.consentimiento ? 'contacto-consentimiento-error' : undefined}
              onChange={(ev) => {
                setConsentimiento(ev.target.checked);
                if (errores.consentimiento) setErrores(({ consentimiento: _, ...resto }) => resto);
              }}
            />
            <span className="text-xs text-gray-300 leading-relaxed">
              {t('contact.consent.1')}{' '}
              <a className="text-primary-light hover:underline" href={URL_TRATAMIENTO} target="_blank" rel="noopener noreferrer">
                {t('contact.consent.data')}
              </a>{' '}
              {t('contact.consent.2')}{' '}
              <a className="text-primary-light hover:underline" href={URL_PRIVACIDAD} target="_blank" rel="noopener noreferrer">
                {t('contact.privacy.link')}
              </a>{' '}
              {t('contact.consent.3')}
            </span>
          </label>
          {errores.consentimiento && (
            <p id="contacto-consentimiento-error" className="mt-2 text-sm text-red-300">
              {errores.consentimiento}
            </p>
          )}
        </div>
        <button
          className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-primary py-4 text-sm uppercase tracking-widest font-bold text-white shadow-lg glow-primary glow-primary-hover transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          disabled={estado === 'sending'}
        >
          <span className="relative z-10 mr-2">{estado === 'sending' ? t('contact.sending') : t('contact.submit')}</span>
          <span className="relative z-10 material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
            {estado === 'sending' ? 'hourglass_empty' : 'arrow_forward'}
          </span>
        </button>
        {estado === 'error' && (
          <p role="alert" className="text-sm text-red-300 text-center flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {t('contact.error')}
          </p>
        )}
      </div>
    </form>
  );
}
