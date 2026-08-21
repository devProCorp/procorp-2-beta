'use client';

import dynamic from 'next/dynamic';
import JotformEmbed from '@/components/contact/JotformEmbed';
import { useLanguage } from '@/context/LanguageContext';

const FooterMap = dynamic(() => import('@/components/layout/FooterMap'), { ssr: false });

// Formulario "Contactenos procorpnet" en JotForm. El ID es público: aparece
// en la URL del propio formulario y no da acceso a nada.
const JOTFORM_CONTACTO = '223375075396665';

export default function Contact() {
  const { t } = useLanguage();


  const infoCards = [
    { icon: 'apartment', title: t('contact.info0.title'), line1: t('contact.info0.line1'), line2: t('contact.info0.line2'), link: { text: t('contact.info0.link'), href: 'https://maps.google.com/?q=Neils+Branch+Dr,+Houston,+TX+77077' } },
    { icon: 'flight', title: t('contact.info2.title'), line1: t('contact.info2.line1'), line2: t('contact.info2.line2'), link: { text: t('contact.info2.link'), href: 'https://maps.google.com/?q=Calle+Jorge+Juan+30+Madrid+Spain' } },
    { icon: 'location_city', title: t('contact.info1.title'), line1: t('contact.info1.line1'), line2: t('contact.info1.line2') },
    { icon: 'contact_phone', title: t('contact.info3.title'), line1: t('contact.info3.line1'), line2: t('contact.info3.line2'), link: { text: t('contact.info3.link'), href: 'https://wa.me/573115163806' } },
  ];

  return (
    <main className="relative flex-1 bg-background-dark min-h-screen text-white">
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-20">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <div className="flex items-center gap-2 text-primary mb-4">
            <span className="material-symbols-outlined text-sm">precision_manufacturing</span>
            <span className="text-sm font-bold uppercase tracking-wider">{t('contact.badge')}</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            {t('contact.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-400">{t('contact.title2')}</span>
          </h1>
          <p className="text-lg leading-relaxed text-gray-300 max-w-2xl">
            {t('contact.desc2')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Form */}
          <div className="lg:col-span-7">
            {/* Contenedor claro a propósito: el formulario de JotForm se sirve con
                su fondo blanco y no puede teñirse desde aquí (es otro origen), y
                oscurecerlo en JotForm rompería /contacto-pcp/, donde el mismo
                formulario vive sobre una página clara. Enmarcarlo como tarjeta lo
                convierte en una decisión de diseño en vez de un parche. */}
            <div className="rounded-[2rem] bg-white p-3 md:p-5 shadow-2xl shadow-primary/10 relative overflow-hidden ring-1 ring-white/10">
              <JotformEmbed formId={JOTFORM_CONTACTO} />
            </div>
          </div>

          {/* Right Side */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              {infoCards.map((card) => (
                <div key={card.title} className="group flex items-start gap-5 rounded-2xl glass-panel glass-panel-hover p-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-[0_0_15px_rgba(206,16,38,0.1)] group-hover:shadow-[0_0_20px_rgba(206,16,38,0.3)]">
                    <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg tracking-wide">{card.title}</h3>
                    <p className="mt-1 text-sm text-gray-300 font-light leading-relaxed">{card.line1}{card.line2 && <><br />{card.line2}</>}</p>
                    {card.link && (
                      <a className="text-xs font-semibold text-primary hover:text-primary-light transition-colors mt-3 inline-flex items-center gap-1 uppercase tracking-widest" href={card.link.href}>
                        {card.link.text}
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="relative w-full h-72 rounded-[2rem] overflow-hidden glass-panel group p-2">
              <div className="w-full h-full rounded-2xl overflow-hidden relative break-words">
                <FooterMap />
                <div className="absolute inset-0 pointer-events-none rounded-2xl border border-surface-border shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] z-10"></div>
                <div className="absolute bottom-4 left-4 z-[1000] flex items-center gap-2 pointer-events-none">
                  <div className="h-2 w-2 rounded-full bg-primary animate-ping"></div>
                  <div className="h-2 w-2 rounded-full bg-primary absolute"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-black/60 px-3 py-1.5 rounded border border-white/10 backdrop-blur-md ml-2">{t('contact.map')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
