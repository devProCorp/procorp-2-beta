'use client';

import dynamic from 'next/dynamic';
import { useLanguage } from '@/context/LanguageContext';

const FooterMap = dynamic(() => import('@/components/layout/FooterMap'), { ssr: false });

export default function Contact() {
  const { t } = useLanguage();

  const infoCards = [
    { icon: 'location_city', title: t('contact.info1.title'), line1: t('contact.info1.line1'), line2: t('contact.info1.line2') },
    { icon: 'flight', title: t('contact.info2.title'), line1: t('contact.info2.line1'), line2: t('contact.info2.line2'), link: { text: t('contact.info2.link'), href: 'https://maps.google.com/?q=Calle+Jorge+Juan+30+Madrid+Spain' } },
    { icon: 'contact_phone', title: t('contact.info3.title'), line1: t('contact.info3.line1'), line2: t('contact.info3.line2'), link: { text: t('contact.info3.link'), href: 'https://wa.me/573115163806' } },
  ];

  return (
    <main className="relative flex-1 tech-bg min-h-screen text-white">
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
            <div className="rounded-[2rem] glass-panel p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[50px] rounded-full pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full pointer-events-none"></div>
              <form className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-name" className="text-sm font-medium text-gray-200">{t('contact.name')}</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                      </div>
                      <input id="contact-name" className="w-full rounded-xl border border-surface-border/80 bg-background-dark/50 backdrop-blur-sm pl-12 py-3.5 text-sm text-white placeholder-gray-400 focus:border-primary/60 focus:bg-surface-dark/80 focus:shadow-[0_0_15px_rgba(206,16,38,0.15)] transition-all outline-none" placeholder={t('contact.name.ph')} type="text" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-org" className="text-sm font-medium text-gray-200">{t('contact.org')}</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">domain</span>
                      </div>
                      <input id="contact-org" className="w-full rounded-xl border border-surface-border/80 bg-background-dark/50 backdrop-blur-sm pl-12 py-3.5 text-sm text-white placeholder-gray-400 focus:border-primary/60 focus:bg-surface-dark/80 focus:shadow-[0_0_15px_rgba(206,16,38,0.15)] transition-all outline-none" placeholder={t('contact.org.ph')} type="text" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-email" className="text-sm font-medium text-gray-200">{t('contact.email')}</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                      </div>
                      <input id="contact-email" className="w-full rounded-xl border border-surface-border/80 bg-background-dark/50 backdrop-blur-sm pl-12 py-3.5 text-sm text-white placeholder-gray-400 focus:border-primary/60 focus:bg-surface-dark/80 focus:shadow-[0_0_15px_rgba(206,16,38,0.15)] transition-all outline-none" placeholder={t('contact.email.ph')} type="email" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-phone" className="text-sm font-medium text-gray-200">{t('contact.phone')}</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">phone_iphone</span>
                      </div>
                      <input id="contact-phone" className="w-full rounded-xl border border-surface-border/80 bg-background-dark/50 backdrop-blur-sm pl-12 py-3.5 text-sm text-white placeholder-gray-400 focus:border-primary/60 focus:bg-surface-dark/80 focus:shadow-[0_0_15px_rgba(206,16,38,0.15)] transition-all outline-none" placeholder={t('contact.phone.ph')} type="tel" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-area" className="text-sm font-medium text-gray-200">{t('contact.area')}</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">settings_suggest</span>
                    </div>
                    <select id="contact-area" className="w-full rounded-xl border border-surface-border/80 bg-background-dark/50 backdrop-blur-sm pl-12 py-3.5 text-sm text-white focus:border-primary/60 focus:bg-surface-dark/80 focus:shadow-[0_0_15px_rgba(206,16,38,0.15)] transition-all appearance-none cursor-pointer outline-none" defaultValue="">
                      <option disabled value="">{t('contact.area.ph')}</option>
                      <option value="bpa">{t('contact.area.1')}</option>
                      <option value="governance">{t('contact.area.2')}</option>
                      <option value="reengineering">{t('contact.area.3')}</option>
                      <option value="lia">{t('contact.area.4')}</option>
                      <option value="consulting">{t('contact.area.5')}</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-level" className="text-sm font-medium text-gray-200">{t('contact.level')}</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                    </div>
                    <select id="contact-level" className="w-full rounded-xl border border-surface-border/80 bg-background-dark/50 backdrop-blur-sm pl-12 py-3.5 text-sm text-white focus:border-primary/60 focus:bg-surface-dark/80 focus:shadow-[0_0_15px_rgba(206,16,38,0.15)] transition-all appearance-none cursor-pointer outline-none" defaultValue="">
                      <option disabled value="">{t('contact.level.ph')}</option>
                      <option value="initial">{t('contact.level.1')}</option>
                      <option value="developing">{t('contact.level.2')}</option>
                      <option value="advanced">{t('contact.level.3')}</option>
                      <option value="optimized">{t('contact.level.4')}</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-details" className="text-sm font-medium text-gray-200">{t('contact.details')}</label>
                  <textarea id="contact-details" className="w-full rounded-xl border border-surface-border/80 bg-background-dark/50 backdrop-blur-sm p-4 text-sm text-white placeholder-gray-400 focus:border-primary/60 focus:bg-surface-dark/80 focus:shadow-[0_0_15px_rgba(206,16,38,0.15)] transition-all resize-none outline-none" placeholder={t('contact.details.ph')} rows={4}></textarea>
                </div>

                <div className="flex flex-col gap-6 mt-4 relative z-10">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input className="mt-1 flex-shrink-0 h-4 w-4 rounded border-surface-border bg-surface-darker text-primary focus:ring-primary/50 transition-all checked:bg-primary" type="checkbox" />
                    <span className="text-xs text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                      {t('contact.privacy')} <a className="text-primary hover:underline hover:text-primary-light" href="/privacy">{t('contact.privacy.link')}</a>. {t('contact.privacy.auth')}
                    </span>
                  </label>
                  <button className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-primary py-4 text-sm uppercase tracking-widest font-bold text-white shadow-lg glow-primary glow-primary-hover transition-all active:scale-[0.98]" type="submit">
                    <span className="relative z-10 mr-2">{t('contact.submit')}</span>
                    <span className="relative z-10 material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">memory</span>
                  </button>
                </div>
              </form>
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
