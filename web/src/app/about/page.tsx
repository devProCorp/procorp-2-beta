'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  const steps = [
    { num: 1, icon: 'travel_explore', title: t('about.step1'), desc: t('about.step1.desc') },
    { num: 2, icon: 'strategy', title: t('about.step2'), desc: t('about.step2.desc') },
    { num: 3, icon: 'calendar_month', title: t('about.step3'), desc: t('about.step3.desc') },
    { num: 4, icon: 'rocket_launch', title: t('about.step4'), desc: t('about.step4.desc') },
    { num: 5, icon: 'trending_up', title: t('about.step5'), desc: t('about.step5.desc') },
    { num: 6, icon: 'open_in_full', title: t('about.step6'), desc: t('about.step6.desc') },
  ];

  const features = [
    { icon: 'verified_user', title: t('about.f1.title'), desc: t('about.f1.desc') },
    { icon: 'trending_up', title: t('about.f2.title'), desc: t('about.f2.desc') },
    { icon: 'precision_manufacturing', title: t('about.f3.title'), desc: t('about.f3.desc') },
  ];

  const stats = [
    { value: '2026', label: t('about.stat1.label') },
    { value: '2028', label: t('about.stat2.label') },
    { value: '100%', label: t('about.stat3.label') },
    { value: '7', label: t('about.stat4.label') },
  ];

  return (
    <main className="flex-grow">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10"></div>
          <div className="w-full h-full bg-[#0a0a0a]"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit mx-auto">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            {t('about.badge')}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-white text-glow">
            {t('about.title1')}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{t('about.title2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            {t('about.desc')}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold text-white mb-2">{t('about.mission.title')}</h2>
              <p className="text-gray-300 leading-relaxed">
                {t('about.mission.desc')}
              </p>
              <div className="flex flex-col gap-4 mt-4">
                {features.map((f) => (
                  <div key={f.title} className="flex items-start gap-4">
                    <div className="bg-primary/20 p-2 rounded-lg text-primary">
                      <span className="material-symbols-outlined">{f.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{f.title}</h3>
                      <p className="text-gray-400 text-sm">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[500px] rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-[#1a1a1a] group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10"></div>
              <div className="w-full h-full bg-gradient-to-br from-[#0a0a0a] to-black"></div>
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <p className="text-primary font-bold uppercase text-xs tracking-wider mb-2">{t('about.team.label')}</p>
                <h3 className="text-2xl font-bold text-white">{t('about.team.title')}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-24 px-6 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">{t('about.method.label')}</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white">{t('about.method.title')}</h3>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">{t('about.method.desc')}</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-[#0a0a0a] via-primary to-[#0a0a0a] -translate-y-1/2 z-0"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 relative z-10">
              {steps.map((s) => (
                <div key={s.num} className="group relative">
                  <div className="h-full bg-[#0a0a0a] border border-[#1a1a1a] hover:border-primary/50 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(206,16,38,0.15)] flex flex-col items-center text-center gap-4">
                    <div className="size-12 rounded-full bg-black border border-primary text-primary flex items-center justify-center font-bold text-xl mb-2 group-hover:bg-primary group-hover:text-white transition-colors">{s.num}</div>
                    <div className="text-primary mb-1">
                      <span className="material-symbols-outlined !text-4xl">{s.icon}</span>
                    </div>
                    <h4 className="text-white font-bold text-lg leading-tight">{s.title}</h4>
                    <p className="text-xs text-gray-400">{s.desc}</p>
                  </div>
                </div>
              ))}
              {/* Step 7 - highlighted */}
              <div className="group relative">
                <div className="h-full bg-gradient-to-br from-[#0a0a0a] to-primary/20 border border-primary rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(206,16,38,0.3)] flex flex-col items-center text-center gap-4">
                  <div className="size-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mb-2 shadow-lg shadow-primary/40">7</div>
                  <div className="text-white mb-1">
                    <span className="material-symbols-outlined !text-4xl">smart_toy</span>
                  </div>
                  <h4 className="text-white font-bold text-lg leading-tight">{t('about.step7')}</h4>
                  <p className="text-xs text-gray-300">{t('about.step7.desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#1a1a1a] bg-black">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-[#1a1a1a]">
          {stats.map((s) => (
            <div key={s.label} className="p-8 text-center">
              <div className="text-4xl font-black text-white mb-1">{s.value}</div>
              <div className="text-xs uppercase tracking-wider text-primary font-bold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#0a0a0a] to-black border border-[#1a1a1a] rounded-2xl p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">{t('about.cta.title')}</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto relative z-10">
            {t('about.cta.desc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link href="/contact" className="w-full sm:w-auto flex items-center justify-center rounded-lg h-12 px-8 bg-primary hover:bg-[#9E0C1D] text-white text-base font-bold tracking-wide transition-all shadow-lg shadow-primary/25">
              {t('about.cta.btn1')}
            </Link>
            <Link href="/projects" className="w-full sm:w-auto flex items-center justify-center rounded-lg h-12 px-8 bg-transparent border border-[#1a1a1a] hover:border-primary text-white text-base font-bold transition-all hover:bg-[#0a0a0a]">
              {t('about.cta.btn2')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
