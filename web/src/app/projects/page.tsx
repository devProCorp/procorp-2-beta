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
    <main className="flex-grow flex flex-col relative tech-grid-bg min-h-screen bg-transparent text-white">
      {/* Hero Section */}
      <section className="relative px-6 py-16 md:px-10 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-primary/10 to-transparent rounded-full translate-x-1/3 -translate-y-1/4 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(206,16,38,0.1) 0%, transparent 70%)' }}></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-6 text-left relative z-10 w-full">
            <div className="flex items-center gap-3 w-fit pl-1.5 pr-4 py-1.5 rounded-full glass-panel border border-primary/20">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white shadow-[0_0_10px_rgba(206,16,38,0.5)]">
                <span className="material-symbols-outlined text-sm">hub</span>
              </span>
              <span className="text-[10px] text-white font-bold uppercase tracking-[0.2em]">{t('proj.badge')}</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight drop-shadow-xl">
              {t('proj.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{t('proj.title2')}</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed max-w-2xl border-l-4 border-primary pl-6">
              {t('proj.desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link href="/contact" className="flex items-center justify-center gap-3 h-14 px-8 rounded-xl bg-primary hover:bg-primary-light text-white font-bold transition-all glow-primary glow-primary-hover uppercase tracking-widest text-sm group border border-primary-light/50">
                <span>{t('proj.cta1')}</span>
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <Link href="/contact" className="flex items-center justify-center gap-3 h-14 px-8 rounded-xl glass-panel glass-panel-hover text-white font-bold transition-all uppercase tracking-widest text-sm border border-surface-border hover:border-primary/50">
                <span className="material-symbols-outlined text-lg text-primary">play_circle</span>
                <span>{t('proj.cta2')}</span>
              </Link>
            </div>
          </div>

          {/* Dashboard Card */}
          <div className="flex-1 w-full lg:h-auto min-h-[300px] relative flex items-center justify-center group">
            <div className="absolute -inset-10 bg-gradient-to-br from-primary/20 via-transparent to-primary/5 blur-[80px] -z-10 rounded-full group-hover:from-primary/30 transition-colors duration-700"></div>
            <div className="relative w-full max-w-md aspect-square bg-surface-dark border border-surface-border/60 rounded-[2rem] p-1 shadow-2xl overflow-hidden glass-panel">
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0 100 L100 0" stroke="#CE1026" strokeDasharray="2 2" strokeWidth="0.5"></path>
                <path d="M20 100 L100 20" stroke="#CE1026" strokeDasharray="2 2" strokeWidth="0.5"></path>
              </svg>
              <div className="relative z-10 w-full h-full flex flex-col justify-between p-8 bg-background-dark/80 backdrop-blur-xl rounded-[1.8rem] border border-surface-border/50 shadow-inner">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-gradient-to-br from-primary/30 to-primary/10 p-3 rounded-xl border border-primary/30 text-primary-light shadow-[0_0_15px_rgba(206,16,38,0.2)]">
                    <span className="material-symbols-outlined text-[28px]">account_tree</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{t('proj.flow')}</div>
                    <div className="text-[12px] font-extrabold text-green-400 flex items-center gap-2 justify-end mt-1 uppercase tracking-wider bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                      <span className="block w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(39,201,63,0.8)]"></span>
                      {t('proj.synced')}
                    </div>
                  </div>
                </div>
                <div className="space-y-6 my-4 bg-surface-darker/60 rounded-2xl p-5 border border-surface-border/50">
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    <span>{t('proj.efficiency')}</span>
                    <span className="text-white">92%</span>
                  </div>
                  <div className="h-2.5 bg-background-dark rounded-full overflow-hidden border border-surface-border">
                    <div className="h-full bg-gradient-to-r from-primary-dark via-primary to-[#F97316] w-[92%] shadow-[0_0_10px_rgba(206,16,38,0.6)] relative">
                      <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-l from-white/30 to-transparent"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="h-16 bg-surface-dark rounded-xl border border-surface-border flex items-center justify-center hover:bg-surface-darker transition-colors cursor-default">
                      <span className="material-symbols-outlined text-gray-500 text-2xl">settings_suggest</span>
                    </div>
                    <div className="h-16 bg-surface-dark rounded-xl border border-surface-border flex items-center justify-center hover:bg-surface-darker transition-colors cursor-default">
                      <span className="material-symbols-outlined text-gray-500 text-2xl">dataset</span>
                    </div>
                    <div className="h-16 bg-primary/20 rounded-xl border border-primary/40 flex items-center justify-center relative shadow-[inset_0_0_15px_rgba(206,16,38,0.2)]">
                      <span className="material-symbols-outlined text-primary-light text-2xl">autorenew</span>
                      <div className="absolute top-2 right-2 w-2 h-2 bg-primary-light rounded-full shadow-[0_0_8px_rgba(206,16,38,0.8)] animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-black/60 rounded-xl p-4 backdrop-blur-md border border-white/5 font-mono shadow-inner mt-4">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                    <span className="text-[10px] text-gray-500 ml-2">Terminal</span>
                  </div>
                  <p className="text-[11px] text-green-400 font-medium leading-relaxed">
                    <span className="text-gray-500 mr-2">&gt;</span> {t('proj.console1')}<br />
                    <span className="text-gray-500 mr-2">&gt;</span> {t('proj.console2')}<br />
                    <span className="text-gray-500 mr-2">&gt;</span> <span className="text-white">{t('proj.console3')}</span><span className="animate-pulse">_</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 py-24 md:px-10 bg-transparent border-t border-surface-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <span className="inline-block px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-4">{t('proj.solutions')}</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">{t('proj.solutions')}</h2>
            </div>
            <p className="text-gray-400 max-w-xl text-[15px] font-light leading-relaxed text-right md:text-left border-l-4 border-primary pl-6">
              {t('proj.solutions.desc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.title} className="group relative glass-panel glass-panel-hover rounded-[1.5rem] p-8 flex flex-col h-full border border-surface-border/50 overflow-hidden">
                <div className="absolute -right-8 -top-8 w-40 h-40 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/20 transition-colors duration-500 pointer-events-none"></div>
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined text-8xl text-white">{service.icon}</span>
                </div>
                <div className="relative z-10 w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 shadow-[0_0_15px_rgba(206,16,38,0.1)] rounded-xl flex items-center justify-center mb-8 text-primary-light group-hover:scale-110 transition-all duration-300">
                  <span className="material-symbols-outlined text-[28px]">{service.icon}</span>
                </div>
                <h3 className="relative z-10 text-xl font-bold text-white mb-4 tracking-wide group-hover:text-primary-light transition-colors">{service.title}</h3>
                <p className="relative z-10 text-gray-400 text-[14px] font-light leading-relaxed mb-8 flex-grow">{service.desc}</p>
                <div className="relative z-10 mt-auto border-t border-surface-border/50 pt-5">
                  <Link href="/contact" className="inline-flex items-center text-gray-300 text-[11px] font-bold uppercase tracking-widest hover:text-white transition-colors group/link w-fit">
                    {service.link} <span className="material-symbols-outlined text-[16px] ml-2 text-primary-light group-hover/link:translate-x-1 transition-transform">arrow_right_alt</span>
                  </Link>
                </div>
              </div>
            ))}
            {/* Wide card */}
            <div className="group relative glass-panel glass-panel-hover rounded-[1.5rem] p-8 flex flex-col h-full border border-surface-border/50 lg:col-span-2 overflow-hidden bg-gradient-to-br from-surface-dark to-black">
              <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-colors duration-500 pointer-events-none"></div>
              <div className="absolute top-8 right-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-9xl text-white">trending_up</span>
              </div>
              <div className="relative w-full h-full z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark border border-primary-light/50 shadow-[0_0_20px_rgba(206,16,38,0.4)] rounded-2xl flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-all duration-300">
                  <span className="material-symbols-outlined text-4xl">gavel</span>
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tight">{t('proj.s5.title')}</h3>
                  <p className="text-gray-300 text-[15px] font-light leading-relaxed mb-6 max-w-xl">
                    {t('proj.s5.desc')}
                  </p>
                  <div>
                    <Link href="/contact" className="inline-flex items-center text-white text-[11px] font-bold uppercase tracking-widest hover:text-primary-light transition-colors group/link w-fit bg-white/5 border border-white/10 px-4 py-2 rounded-lg hover:bg-white/10">
                      {t('proj.s5.link')} <span className="material-symbols-outlined text-[16px] ml-2 text-primary-light group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden bg-transparent border-t border-surface-border">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none z-0"></div>
        <div className="max-w-[800px] mx-auto text-center relative z-10 glass-panel p-12 md:p-20 rounded-[3rem] shadow-2xl">
          <span className="inline-flex items-center justify-center py-1.5 px-4 rounded-full border border-primary/20 bg-primary/10 text-[10px] text-white font-bold uppercase tracking-[0.2em] mb-8 shadow-[0_0_15px_rgba(206,16,38,0.2)]">
            <span className="w-2 h-2 rounded-full bg-primary-light mr-2 animate-pulse"></span>
            {t('proj.cta.badge')}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 uppercase">
            {t('proj.cta.title')}
          </h2>
          <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed mb-12 max-w-xl mx-auto">
            {t('proj.cta.desc')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="h-16 px-12 rounded-xl bg-white hover:bg-gray-100 text-black font-extrabold text-sm uppercase tracking-widest transition-all shadow-xl shadow-white/10 hover:shadow-white/20 hover:-translate-y-1 flex items-center justify-center gap-3 w-full sm:w-auto">
              <span>{t('proj.cta.button')}</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
