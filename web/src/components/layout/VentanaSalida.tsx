'use client';

// Ventana de salida: cuando la persona va a irse, le ofrece recibir las nuevas
// oportunidades de inversión dejando solo su correo. Envía a /api/interes de
// inversion.pro-corp.net como suscripción (Supabase + HubSpot, sin aviso al equipo),
// igual que la gemela de inversiones (pro-corp-platform, VentanaSalida.tsx).
//
// Cuándo aparece:
// - Escritorio: el ratón sale por arriba de la ventana (hacia pestañas o barra).
// - Táctil: subida rápida tras haber leído al menos un 30 % de la página.
// - Nunca en los primeros segundos, ni en /contact, ni con otro diálogo abierto, ni más
//   de una vez por sesión. Tras cerrarla no vuelve en 14 días; tras suscribirse, nunca.
// El recuerdo se guarda con la misma clave que inversiones, pero cada dominio tiene
// su propio almacenamiento.

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const API_INTERES = `${process.env.NEXT_PUBLIC_INVERSION_URL ?? 'https://inversion.pro-corp.net'}/api/interes`;
const URL_PRIVACIDAD = '/politica-de-privacidad/';
const URL_TRATAMIENTO = '/tratamiento-de-datos-personales/';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const CLAVE = 'pc_ventana_salida';
const ESPERA_INICIAL_MS = 8_000;
const PAUSA_TRAS_CERRAR_MS = 14 * 24 * 3600 * 1000;

type Estado = { suscrito?: boolean; cerrada?: number };

/** El almacenamiento puede no existir (modo privado, bloqueado): nunca rompe la página. */
function leer(): Estado {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) ?? '{}') as Estado;
  } catch {
    return {};
  }
}
function guardar(e: Estado) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(e));
  } catch {
    /* sin almacenamiento: solo se pierde el recuerdo */
  }
}
function yaMostradaEnSesion(): boolean {
  try {
    return sessionStorage.getItem(CLAVE) === '1';
  } catch {
    return false;
  }
}
function marcarSesion() {
  try {
    sessionStorage.setItem(CLAVE, '1');
  } catch {
    /* idem */
  }
}

function puedeMostrarse(): boolean {
  if (yaMostradaEnSesion()) return false;
  const e = leer();
  if (e.suscrito) return false;
  if (e.cerrada && Date.now() - e.cerrada < PAUSA_TRAS_CERRAR_MS) return false;
  return !document.querySelector('dialog[open]');
}

function origenDeLaVisita(lang: string) {
  const q = new URLSearchParams(window.location.search);
  const utm = Object.fromEntries(
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].flatMap((k) => {
      const v = q.get(k);
      return v ? [[k, v]] : [];
    }),
  );
  return { idioma: lang, pagina: window.location.pathname, referente: document.referrer, ...utm };
}

export default function VentanaSalida() {
  const pathname = usePathname();
  const enContacto = pathname?.startsWith('/contact') ?? false;
  const [abierta, setAbierta] = useState(false);

  useEffect(() => {
    if (enContacto) return;
    const inicio = Date.now();
    let hecho = false;
    const abrir = () => {
      if (hecho || Date.now() - inicio < ESPERA_INICIAL_MS) return;
      if (!puedeMostrarse()) return;
      hecho = true;
      marcarSesion();
      setAbierta(true);
    };

    const alSalir = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) abrir();
    };

    const tactil = window.matchMedia('(hover: none) and (pointer: coarse)');
    let ultimo = { y: 0, t: 0 };
    let maxProgreso = 0;
    const alDesplazar = (e: Event) => {
      if (!tactil.matches) return;
      const el =
        e.target instanceof HTMLElement ? e.target : (document.scrollingElement ?? document.documentElement);
      const recorrido = el.scrollHeight - el.clientHeight;
      if (recorrido <= 0) return;
      const y = el.scrollTop;
      const t = performance.now();
      maxProgreso = Math.max(maxProgreso, y / recorrido);
      const velocidad = (ultimo.y - y) / Math.max(t - ultimo.t, 1); // px/ms, + = arriba
      ultimo = { y, t };
      if (maxProgreso > 0.3 && velocidad > 2.5) abrir();
    };

    document.documentElement.addEventListener('mouseout', alSalir);
    document.addEventListener('scroll', alDesplazar, { capture: true, passive: true });
    return () => {
      document.documentElement.removeEventListener('mouseout', alSalir);
      document.removeEventListener('scroll', alDesplazar, { capture: true });
    };
  }, [enContacto]);

  if (!abierta) return null;
  return <Dialogo onCerrar={() => setAbierta(false)} />;
}

function Dialogo({ onCerrar }: { onCerrar: () => void }) {
  const { t, lang } = useLanguage();
  const dialogo = useRef<HTMLDialogElement>(null);
  const correoRef = useRef<HTMLInputElement>(null);
  const abierto = useRef(Date.now());
  const [email, setEmail] = useState('');
  const [consentimiento, setConsentimiento] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const el = dialogo.current;
    if (el && !el.open) el.showModal();
    correoRef.current?.focus();
    return () => el?.close();
  }, []);

  const cerrar = useCallback(() => {
    if (enviando) return;
    if (!enviado) guardar({ ...leer(), cerrada: Date.now() });
    onCerrar();
  }, [enviando, enviado, onCerrar]);

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    setErrorGeneral(null);
    const v = email.trim();
    const nuevos: Record<string, string> = {};
    if (!v) nuevos.email = t('exit.err.required');
    else if (v.length > 200 || !EMAIL.test(v)) nuevos.email = t('exit.err.email');
    if (!consentimiento) nuevos.consentimiento = t('exit.err.consent');
    setErrores(nuevos);
    if (Object.keys(nuevos).length) {
      requestAnimationFrame(() => formEl.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setEnviando(true);
    try {
      const form = new FormData(formEl);
      const res = await fetch(API_INTERES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suscripcion: true,
          campos: { email: v },
          consentimiento,
          origen: origenDeLaVisita(lang),
          sitio_web: form.get('sitio_web'),
          ms_abierto: Date.now() - abierto.current,
        }),
      });
      if (res.ok) {
        guardar({ suscrito: true });
        setEnviado(true);
        return;
      }
      const cuerpo = await res.json().catch(() => ({}));
      if (cuerpo.errores?.email) setErrores({ email: t('exit.err.email') });
      else setErrorGeneral(t('contact.error'));
    } catch {
      setErrorGeneral(t('contact.error'));
    } finally {
      setEnviando(false);
    }
  };

  const enlace = (href: string, texto: ReactNode) => (
    <a className="text-primary-light hover:underline" href={href} target="_blank" rel="noopener noreferrer">
      {texto}
    </a>
  );

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="salida-titulo"
      onCancel={(e) => {
        e.preventDefault();
        cerrar();
      }}
      onMouseDown={(e) => e.target === dialogo.current && cerrar()}
      className="m-auto w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-2xl border border-surface-border bg-surface-dark p-0 text-left text-white shadow-2xl shadow-black/50 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 sm:p-7">
        <button
          type="button"
          onClick={cerrar}
          disabled={enviando}
          aria-label={t('exit.close')}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
            close
          </span>
        </button>

        {enviado ? (
          <div role="status">
            <h2 id="salida-titulo" className="pr-8 text-2xl font-extrabold">
              {t('exit.ok.title')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">{t('exit.ok.text')}</p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onCerrar}
                className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-all active:scale-[0.98]"
              >
                {t('exit.close')}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={enviar} noValidate>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-light">{t('exit.eyebrow')}</p>
            <h2 id="salida-titulo" className="mt-1 pr-8 text-2xl font-extrabold leading-tight">
              {t('exit.title')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">{t('exit.intro')}</p>

            <label htmlFor="salida-email" className="mb-2 mt-5 block text-sm font-medium text-gray-200">
              {t('exit.email')}
            </label>
            <input
              ref={correoRef}
              id="salida-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={200}
              placeholder={t('exit.email.placeholder')}
              value={email}
              aria-invalid={!!errores.email}
              aria-describedby={errores.email ? 'salida-email-error' : undefined}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errores.email) setErrores(({ email: _, ...resto }) => resto);
              }}
              className="w-full rounded-xl border border-surface-border/80 bg-background-dark/50 px-4 py-3.5 text-sm text-white placeholder-gray-400 outline-none transition-all focus:border-primary/60 focus:shadow-[0_0_15px_rgba(206,16,38,0.15)] aria-[invalid=true]:border-red-400"
            />
            {errores.email && (
              <p id="salida-email-error" className="mt-1 text-sm text-red-300">
                {errores.email}
              </p>
            )}

            {/* Trampa para bots: invisible para personas y lectores de pantalla. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Sitio web
                <input name="sitio_web" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-0.5 h-5 w-5 flex-shrink-0 accent-primary"
                checked={consentimiento}
                aria-invalid={!!errores.consentimiento}
                aria-describedby={errores.consentimiento ? 'salida-consentimiento-error' : undefined}
                onChange={(e) => {
                  setConsentimiento(e.target.checked);
                  if (errores.consentimiento) setErrores(({ consentimiento: _, ...resto }) => resto);
                }}
              />
              <span className="text-xs leading-relaxed text-gray-300">
                {t('contact.consent.1')} {enlace(URL_TRATAMIENTO, t('contact.consent.data'))} {t('contact.consent.2')}{' '}
                {enlace(URL_PRIVACIDAD, t('contact.privacy.link'))} {t('contact.consent.3')}
              </span>
            </label>
            {errores.consentimiento && (
              <p id="salida-consentimiento-error" className="mt-1 text-sm text-red-300">
                {errores.consentimiento}
              </p>
            )}

            {errorGeneral && (
              <p role="alert" className="mt-4 text-sm text-red-300">
                {errorGeneral}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="mt-5 flex w-full items-center justify-center rounded-xl bg-primary py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-lg glow-primary glow-primary-hover transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enviando ? t('contact.sending') : t('exit.submit')}
            </button>
            <button
              type="button"
              onClick={cerrar}
              disabled={enviando}
              className="mt-2 h-10 w-full rounded-lg text-sm text-gray-400 transition-colors hover:text-white"
            >
              {t('exit.dismiss')}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
