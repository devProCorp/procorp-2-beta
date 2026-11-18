'use client';

// Boletín del blog. Antes el botón no enviaba nada; ahora suscribe con la misma
// API que la ventana de salida (/api/interes de inversion.pro-corp.net, Supabase +
// HubSpot), con consentimiento obligatorio y trampa para bots. `origen.pagina`
// dice al equipo que la suscripción vino del blog.

import { useRef, useState, type FormEvent } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { API_INTERES, EMAIL, marcarSuscrito, origenDeLaVisita } from '@/components/layout/VentanaSalida';

const URL_PRIVACIDAD = '/politica-de-privacidad/';
const URL_TRATAMIENTO = '/tratamiento-de-datos-personales/';

export default function NewsletterSection() {
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [consentimiento, setConsentimiento] = useState(false);
  const [errores, setErrores] = useState<{ email?: string; consentimiento?: string }>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const montado = useRef(Date.now());

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    setErrorGeneral(null);
    const v = email.trim();
    const nuevos: typeof errores = {};
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
          ms_abierto: Date.now() - montado.current,
        }),
      });
      if (res.ok) {
        marcarSuscrito();
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

  const enlace = (href: string, texto: string) => (
    <a className="text-white underline underline-offset-2 hover:text-primary-light" href={href} target="_blank" rel="noopener noreferrer">
      {texto}
    </a>
  );

  return (
    <section aria-labelledby="boletin-titulo" className="border-y border-blog-border bg-blog-surface">
      <div className="mx-auto grid w-full max-w-[1280px] gap-7 px-4 py-11 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,27.5rem)] lg:items-center">
        <div className="min-w-0">
          <h2 id="boletin-titulo" className="m-0 font-blog-title text-[1.75rem] font-bold leading-tight text-blog-text text-balance">
            {t('journal.newsletter.title')}
          </h2>
          <p className="mt-2.5 mb-0 max-w-[52ch] text-base leading-relaxed text-blog-soft">{t('journal.newsletter.desc')}</p>
        </div>

        {enviado ? (
          <p role="status" className="m-0 min-w-0 rounded-xl border border-blog-border bg-background-dark p-5 leading-relaxed text-blog-text">
            {t('journal.newsletter.ok')}
          </p>
        ) : (
          <form onSubmit={enviar} noValidate className="relative min-w-0">
            <label htmlFor="newsletter-email" className="mb-2 block text-sm font-medium text-blog-text">
              {t('exit.email')}
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="newsletter-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={200}
                placeholder={t('exit.email.placeholder')}
                value={email}
                aria-invalid={!!errores.email}
                aria-describedby={errores.email ? 'newsletter-email-error' : undefined}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errores.email) setErrores(({ email: _, ...resto }) => resto);
                }}
                className="h-12 min-w-0 flex-1 rounded-lg border border-blog-control bg-background-dark px-4 text-blog-text placeholder:text-blog-meta outline-none focus:border-blog-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light aria-[invalid=true]:border-red-400"
              />
              <button
                type="submit"
                disabled={enviando}
                className="h-12 shrink-0 rounded-lg bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
              >
                {enviando ? t('contact.sending') : t('journal.newsletter.button')}
              </button>
            </div>
            {errores.email && (
              <p id="newsletter-email-error" className="mt-2 text-sm text-red-300">
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
                aria-describedby={errores.consentimiento ? 'newsletter-consentimiento-error' : undefined}
                onChange={(e) => {
                  setConsentimiento(e.target.checked);
                  if (errores.consentimiento) setErrores(({ consentimiento: _, ...resto }) => resto);
                }}
              />
              <span className="text-[13px] leading-relaxed text-blog-soft">
                {t('contact.consent.1')} {enlace(URL_TRATAMIENTO, t('contact.consent.data'))} {t('contact.consent.2')}{' '}
                {enlace(URL_PRIVACIDAD, t('contact.privacy.link'))} {t('contact.consent.3')}
              </span>
            </label>
            {errores.consentimiento && (
              <p id="newsletter-consentimiento-error" className="mt-1 text-sm text-red-300">
                {errores.consentimiento}
              </p>
            )}
            {errorGeneral && (
              <p role="alert" className="mt-4 text-sm text-red-300">
                {errorGeneral}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
