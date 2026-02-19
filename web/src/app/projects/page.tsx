'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Projects() {
  const { t } = useLanguage();

  const services = [
    { icon: 'diversity_3', title: t('proj.s1.title'), desc: t('proj.s1.desc'), link: t('proj.s1.link') },
    { icon: 'family_restroom', title: t('proj.s2.title'), desc: t('proj.s2.desc'), link: t('proj.s2.link') },
    { icon: 'badge', title: t('proj.s3.title'), desc: t('proj.s3.desc'), link: t('proj.s3.link') },
    { icon: 'beach_access', title: t('proj.s4.title'), desc: t('proj.s4.desc'), link: t('proj.s4.link') },
  ];

  return (
    <main className="flex-grow flex flex-col relative tech-grid-bg min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative px-6 py-16 md:px-10 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-primary/10 to-transparent rounded-full translate-x-1/3 -translate-y-1/4 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(206,16,38,0.1) 0%, transparent 70%)' }}></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-6 text-left">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-sm">hub</span>
              </span>
              <span className="text-primary font-bold uppercase tracking-widest text-xs">{t('proj.badge')}</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
              {t('proj.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-secondary">{t('proj.title2')}</span>
            </h1>
            <p className="text-secondary text-lg md:text-xl font-light leading-relaxed max-w-2xl">
              {t('proj.desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/contact" className="flex items-center justify-center gap-2 rounded-lg h-12 px-8 bg-primary hover:bg-primary-dark transition-all shadow-[0_0_20px_rgba(206,16,38,0.3)] text-white text-base font-bold">
                <span>{t('proj.cta1')}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
              <button className="flex items-center justify-center gap-2 rounded-lg h-12 px-8 bg-transparent border border-gray-700 hover:border-gray-500 hover:bg-white/5 transition-all text-white text-base font-medium">
                <span className="material-symbols-outlined text-sm">play_circle</span>
                <span>{t('proj.cta2')}</span>
              </button>
            </div>
          </div>

          {/* Dashboard Card */}
          <div className="flex-1 w-full lg:h-auto min-h-[300px] relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square bg-gradient-to-br from-[#111] to-black rounded-2xl border border-[#1a1a1a] p-1 shadow-2xl">
              <div className="relative z-10 w-full h-full flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <div className="bg-primary/20 p-2 rounded-lg border border-primary/30 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-primary">account_tree</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-secondary">{t('proj.flow')}</div>
                    <div className="text-sm font-bold text-green-400 flex items-center gap-1 justify-end">
                      <span className="block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      {t('proj.synced')}
                    </div>
                  </div>
                </div>
                <div className="space-y-4 my-4">
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-orange-500 w-[92%]"></div>
                  </div>
                  <div className="flex justify-between text-xs text-secondary font-mono">
                    <span>{t('proj.efficiency')}</span>
                    <span>92%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="h-16 bg-white/5 rounded border border-white/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-lg">settings_suggest</span>
                    </div>
                    <div className="h-16 bg-white/5 rounded border border-white/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-lg">dataset</span>
                    </div>
                    <div className="h-16 bg-primary/20 rounded border border-primary/50 flex items-center justify-center relative">
                      <span className="material-symbols-outlined text-primary text-lg">autorenew</span>
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-black/30 rounded p-3 backdrop-blur-md border border-white/5">
                  <p className="text-xs text-secondary font-mono">
                    &gt; {t('proj.console1')}<br />
                    &gt; {t('proj.console2')}<br />
                    &gt; {t('proj.console3')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 py-12 md:px-10 bg-[#0a0a0a]/50 border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('proj.solutions')}</h2>
              <div className="h-1 w-20 bg-primary rounded-full"></div>
            </div>
            <p className="text-secondary max-w-md text-sm md:text-base text-right md:text-left">
              {t('proj.solutions.desc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.title} className="group relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col h-full">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl text-white">{service.icon}</span>
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">{service.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-secondary text-sm leading-relaxed mb-6 flex-grow">{service.desc}</p>
                <div className="mt-auto border-t border-white/5 pt-4">
                  <a className="inline-flex items-center text-primary text-sm font-bold hover:text-white transition-colors" href="#">
                    {service.link} <span className="material-symbols-outlined text-sm ml-1">arrow_forward_ios</span>
                  </a>
                </div>
              </div>
            ))}
            {/* Wide card */}
            <div className="group relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col h-full lg:col-span-2">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-white">trending_up</span>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">gavel</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('proj.s5.title')}</h3>
              <p className="text-secondary text-sm leading-relaxed mb-6 flex-grow">
                {t('proj.s5.desc')}
              </p>
              <div className="mt-auto border-t border-white/5 pt-4">
                <a className="inline-flex items-center text-primary text-sm font-bold hover:text-white transition-colors" href="#">
                  {t('proj.s5.link')} <span className="material-symbols-outlined text-sm ml-1">arrow_forward_ios</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0a] z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-wider mb-6">
            {t('proj.cta.badge')}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {t('proj.cta.title')}
          </h2>
          <p className="text-secondary text-lg mb-10 max-w-2xl mx-auto">
            {t('proj.cta.desc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="w-full sm:w-auto flex items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-white hover:bg-gray-100 text-black text-base font-bold transition-all transform hover:scale-105">
              <span>{t('proj.cta.button')}</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
