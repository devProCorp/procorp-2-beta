'use client';

// Aviso de cookies y carga de Google Analytics (pedido de Christian Daza, 2026-11-17).
// Analytics es la única cookie no esencial de la web (ver /cookies): no se carga hasta
// que la persona pulsa «Aceptar». «Rechazar» tiene el mismo peso visual, como pide la
// guía de cookies de la AEPD. La decisión se recuerda 12 meses y se puede cambiar
// desde el enlace «Configurar cookies» del pie (evento ABRIR_AVISO_COOKIES).

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';
import { useLanguage } from '@/context/LanguageContext';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-5E4NPR6H5Y';
const CLAVE = 'pc_cookies';
const VIGENCIA_MS = 365 * 24 * 3600 * 1000;
export const ABRIR_AVISO_COOKIES = 'pc-abrir-aviso-cookies';

type Decision = 'aceptadas' | 'rechazadas';

// Páginas que solo existen en español (la landing electoral no tiene traducción):
// el aviso no debe salir en el idioma del navegador.
const SOLO_ESPANOL = ['/elecciones-2026'];
const TEXTO_ES: Record<string, string> = {
  'cookies.banner.title': 'Usamos cookies',
  'cookies.banner.text':
    'Usamos cookies propias necesarias para que la web funcione y, solo si usted lo acepta, cookies de Google Analytics para medir las visitas y mejorar nuestros contenidos. Puede cambiar su elección en cualquier momento desde la política de cookies.',
  'cookies.banner.policy': 'Política de cookies',
  'cookies.banner.accept': 'Aceptar',
  'cookies.banner.reject': 'Rechazar',
};

/** El almacenamiento puede no existir (modo privado, bloqueado): nunca rompe la página. */
function leer(): Decision | null {
  try {
    const d = JSON.parse(localStorage.getItem(CLAVE) ?? 'null') as { v: Decision; fecha: number } | null;
    if (!d || Date.now() - d.fecha > VIGENCIA_MS) return null;
    return d.v === 'aceptadas' || d.v === 'rechazadas' ? d.v : null;
  } catch {
    return null;
  }
}
function guardar(v: Decision) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ v, fecha: Date.now() }));
  } catch {
    /* sin almacenamiento: se vuelve a preguntar en la próxima visita */
  }
}

/** Al retirar el consentimiento, borra las cookies _ga que hubiera dejado Analytics. */
function borrarCookiesAnalitica() {
  const dominios = ['', `; domain=${location.hostname}`, `; domain=.${location.hostname.replace(/^www\./, '')}`];
  for (const c of document.cookie.split(';')) {
    const nombre = c.split('=')[0].trim();
    if (nombre === '_ga' || nombre.startsWith('_ga_')) {
      for (const d of dominios) document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`;
    }
  }
}

export default function ConsentimientoCookies() {
  const { t: traducir } = useLanguage();
  const ruta = usePathname() ?? '';
  const t = SOLO_ESPANOL.some((p) => ruta.startsWith(p)) ? (k: string) => TEXTO_ES[k] ?? traducir(k) : traducir;
  // undefined = aún no se ha leído el almacenamiento (evita parpadeo en la exportación estática)
  const [decision, setDecision] = useState<Decision | null | undefined>(undefined);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const d = leer();
    // Lectura única de localStorage tras montar: no existe en la exportación estática.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDecision(d);
    setAbierto(d === null);
    const abrir = () => setAbierto(true);
    window.addEventListener(ABRIR_AVISO_COOKIES, abrir);
    return () => window.removeEventListener(ABRIR_AVISO_COOKIES, abrir);
  }, []);

  const decidir = useCallback(
    (v: Decision) => {
      guardar(v);
      setAbierto(false);
      if (v === 'rechazadas' && decision === 'aceptadas') {
        // Analytics ya estaba cargado: se desactiva y se recarga para descargarlo.
        (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
        borrarCookiesAnalitica();
        location.reload();
        return;
      }
      if (v === 'rechazadas') borrarCookiesAnalitica();
      setDecision(v);
    },
    [decision],
  );

  return (
    <>
      {decision === 'aceptadas' && <GoogleAnalytics gaId={GA_ID} />}
      {abierto && (
        <section
          aria-label={t('cookies.banner.title')}
          className="fixed inset-x-0 bottom-0 z-[9000] p-4 sm:p-6 pointer-events-none"
        >
          <div className="pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-surface-border bg-surface-dark/95 p-5 shadow-2xl backdrop-blur sm:p-6">
            <h2 className="mb-2 text-sm font-bold text-white">{t('cookies.banner.title')}</h2>
            <p className="text-sm leading-relaxed text-secondary">
              {t('cookies.banner.text')}{' '}
              <Link href="/cookies/" className="font-semibold text-white underline underline-offset-2 hover:text-primary">
                {t('cookies.banner.policy')}
              </Link>
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
              <button
                type="button"
                onClick={() => decidir('rechazadas')}
                className="rounded-xl border border-white/30 bg-transparent px-6 py-3 text-sm font-bold text-white transition-all hover:border-white active:scale-[0.98]"
              >
                {t('cookies.banner.reject')}
              </button>
              <button
                type="button"
                onClick={() => decidir('aceptadas')}
                className="rounded-xl border border-primary bg-primary px-6 py-3 text-sm font-bold text-white transition-all active:scale-[0.98]"
              >
                {t('cookies.banner.accept')}
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
