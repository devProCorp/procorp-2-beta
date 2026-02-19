'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();

  const infoCards = [
    { icon: 'hub', title: t('contact.info1.title'), line1: t('contact.info1.line1'), line2: t('contact.info1.line2') },
    { icon: 'mark_email_read', title: t('contact.info2.title'), line1: 'tech.support@procorp2028.com', line2: '', link: { text: t('contact.info2.link'), href: 'mailto:tech.support@procorp2028.com' } },
    { icon: 'developer_board', title: t('contact.info3.title'), line1: '+34 930 000 999', line2: t('contact.info3.line2') },
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
          <p className="text-lg leading-relaxed text-[#8F9295] max-w-2xl">
            {t('contact.desc2')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]/50 backdrop-blur-sm p-8 shadow-xl">
              <form className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#8F9295]">{t('contact.name')}</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#8F9295] group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                      </div>
                      <input className="w-full rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] pl-10 py-3 text-sm text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" placeholder={t('contact.name.ph')} type="text" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#8F9295]">{t('contact.org')}</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#8F9295] group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">domain</span>
                      </div>
                      <input className="w-full rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] pl-10 py-3 text-sm text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" placeholder={t('contact.org.ph')} type="text" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#8F9295]">{t('contact.email')}</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#8F9295] group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                      </div>
                      <input className="w-full rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] pl-10 py-3 text-sm text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" placeholder={t('contact.email.ph')} type="email" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#8F9295]">{t('contact.phone')}</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#8F9295] group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">phone_iphone</span>
                      </div>
                      <input className="w-full rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] pl-10 py-3 text-sm text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" placeholder={t('contact.phone.ph')} type="tel" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#8F9295]">{t('contact.area')}</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#8F9295] group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">settings_suggest</span>
                    </div>
                    <select className="w-full rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] pl-10 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer outline-none" defaultValue="">
                      <option disabled value="">{t('contact.area.ph')}</option>
                      <option value="bpa">{t('contact.area.1')}</option>
                      <option value="governance">{t('contact.area.2')}</option>
                      <option value="reengineering">{t('contact.area.3')}</option>
                      <option value="lia">{t('contact.area.4')}</option>
                      <option value="consulting">{t('contact.area.5')}</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#8F9295]">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#8F9295]">{t('contact.level')}</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#8F9295] group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                    </div>
                    <select className="w-full rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] pl-10 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer outline-none" defaultValue="">
                      <option disabled value="">{t('contact.level.ph')}</option>
                      <option value="initial">{t('contact.level.1')}</option>
                      <option value="developing">{t('contact.level.2')}</option>
                      <option value="advanced">{t('contact.level.3')}</option>
                      <option value="optimized">{t('contact.level.4')}</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#8F9295]">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#8F9295]">{t('contact.details')}</label>
                  <textarea className="w-full rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] p-3 text-sm text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none outline-none" placeholder={t('contact.details.ph')} rows={4}></textarea>
                </div>

                <div className="flex flex-col gap-6 mt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input className="mt-1 h-4 w-4 rounded border-gray-600 bg-[#0a0a0a] text-primary focus:ring-primary transition-all" type="checkbox" />
                    <span className="text-xs text-[#8F9295] leading-relaxed group-hover:text-gray-300 transition-colors">
                      {t('contact.privacy')} <a className="text-primary hover:underline hover:text-red-400" href="#">{t('contact.privacy.link')}</a>. {t('contact.privacy.auth')}
                    </span>
                  </label>
                  <button className="group relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-primary py-4 text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-[#A80D1F] hover:shadow-primary/40 active:scale-[0.99]" type="button">
                    <span className="mr-2">{t('contact.submit')}</span>
                    <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">memory</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              {infoCards.map((card) => (
                <div key={card.title} className="group flex items-start gap-4 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-6 transition-all hover:border-primary/50 hover:bg-[#111]">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">{card.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{card.title}</h3>
                    <p className="mt-1 text-sm text-[#8F9295]">{card.line1}{card.line2 && <><br />{card.line2}</>}</p>
                    {card.link && (
                      <a className="text-xs font-semibold text-primary hover:text-red-300 transition-colors mt-2 inline-block" href={card.link.href}>{card.link.text}</a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="relative w-full h-64 rounded-xl overflow-hidden border border-[#1a1a1a] group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
              <div className="w-full h-full bg-gradient-to-br from-[#0a0a0a] to-black opacity-60"></div>
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-ping"></div>
                <div className="h-2 w-2 rounded-full bg-primary absolute"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm ml-2">{t('contact.map')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
