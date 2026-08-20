'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Projects — Estructuración de Proyectos + Strategic Sectors.
 * Hero al estilo Sustainable Growth (título bicolor, párrafos con barra
 * roja, CTA y mockup tipo dashboard); debajo los 4 pasos, luego el
 * portafolio de sectores. Trilingüe ES/EN/PT.
 */
export default function Sectors() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-transparent text-white flex flex-col overflow-x-hidden">
      {/* Strategic Sectors + Some projects */}
      <section className="py-24 px-6 md:px-10 lg:px-40 bg-transparent relative overflow-hidden border-t border-surface-border">
        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20 relative z-10">
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-4">{t('studio.inv.label')}</span>
              <h2 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
                {t('studio.inv.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{t('studio.inv.title2')}</span>
              </h2>
              <p className="text-gray-300 text-lg font-light leading-relaxed border-l-4 border-primary pl-6">
                {t('studio.inv.desc')}
              </p>
              <p className="mt-4 border-l-4 border-primary-light/60 pl-6 text-base font-medium italic leading-relaxed text-white">
                {t('studio.inv.bridge')}
              </p>
            </div>
            {/* Stats mini */}
            <div className="glass-panel p-6 rounded-2xl border border-surface-border/60 shadow-xl flex gap-6 lg:gap-10 flex-wrap shrink-0">
              <div className="text-center">
                <p className="text-3xl font-black text-white">{t('studio.inv.stat1.value')}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] mt-1">{t('studio.inv.stat1.label')}</p>
              </div>
              <div className="w-px bg-surface-border hidden lg:block"></div>
              <div className="text-center">
                <p className="text-3xl font-black text-primary-light drop-shadow-[0_0_10px_rgba(206,16,38,0.3)]">{t('studio.inv.stat2.value')}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] mt-1">{t('studio.inv.stat2.label')}</p>
              </div>
              <div className="w-px bg-surface-border hidden lg:block"></div>
              <div className="text-center">
                <p className="text-3xl font-black text-white">{t('studio.inv.stat3.value')}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] mt-1">{t('studio.inv.stat3.label')}</p>
              </div>
            </div>
          </div>

          {/* Some of our projects — mismo estilo masthead que "How to Invest" */}
          <div className="mb-10 mt-20 flex items-center gap-6">
            <h3 className="whitespace-nowrap text-[11px] font-extrabold uppercase tracking-[0.2em] sm:text-sm md:text-xl">
              <span className="text-white">{t('studio.inv.projects.title').split(' ').slice(0, -1).join(' ')} </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{t('studio.inv.projects.title').split(' ').slice(-1)[0]}</span>
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-surface-border to-transparent"></div>
          </div>

          {/* Sector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: 'apartment', title: t('studio.inv.re.title'), desc: t('studio.inv.re.desc'), tag: t('studio.inv.re.tag'), accent: 'bg-[#CE1026]', href: 'https://inversion.pro-corp.net/real-state' },
              { icon: 'trending_down', title: t('studio.inv.da.title'), desc: t('studio.inv.da.desc'), tag: t('studio.inv.da.tag'), accent: 'bg-[#F59E0B]', href: 'https://inversion.pro-corp.net/distress-assets' },
              { icon: 'bolt', title: t('studio.inv.en.title'), desc: t('studio.inv.en.desc'), tag: t('studio.inv.en.tag'), accent: 'bg-[#10B981]', href: 'https://inversion.pro-corp.net/energy' },
              { icon: 'account_balance', title: t('studio.inv.ft.title'), desc: t('studio.inv.ft.desc'), tag: t('studio.inv.ft.tag'), accent: 'bg-[#3B82F6]', href: 'https://inversion.pro-corp.net/fintech' },
              { icon: 'flight', title: t('studio.inv.av.title'), desc: t('studio.inv.av.desc'), tag: t('studio.inv.av.tag'), accent: 'bg-[#8B5CF6]', href: 'https://aeronexxt.com/' },
              { icon: 'school', title: t('studio.inv.ed.title'), desc: t('studio.inv.ed.desc'), tag: t('studio.inv.ed.tag'), accent: 'bg-[#F97316]', href: 'https://inversion.pro-corp.net/edutainment' },
              { icon: 'neurology', title: t('studio.inv.tech.title'), desc: t('studio.inv.tech.desc'), tag: t('studio.inv.tech.tag'), accent: 'bg-[#0EA5E9]', href: 'https://inversion.pro-corp.net/' },
            ].map((sector, i) => (
              <a key={i} href={sector.href} target="_blank" rel="noopener noreferrer" className="group relative glass-panel glass-panel-hover rounded-[1.5rem] overflow-hidden cursor-pointer flex flex-col h-full border border-surface-border/50">
                <div className="absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-10 group-hover:opacity-30 transition-opacity duration-500 rounded-bl-full pointer-events-none" style={{ backgroundColor: sector.accent.replace('bg-', '').replace('[', '').replace(']', '') }}></div>

                <div className="relative z-10 p-8 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-8">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg ${sector.accent} bg-opacity-10 border border-white/5`}>
                      <span className="material-symbols-outlined text-[28px]" style={{ color: sector.accent.replace('bg-', '').replace('[', '').replace(']', '') }}>{sector.icon}</span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 bg-surface-darker/80 border border-surface-border/50 px-3 py-1.5 rounded-full shadow-inner">
                      {sector.tag}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 uppercase tracking-wide group-hover:text-white transition-colors">{sector.title}</h4>
                  <p className="text-[14px] text-gray-400 font-light leading-relaxed flex-1 group-hover:text-gray-300 transition-colors">{sector.desc}</p>
                  <div className="mt-8 pt-5 border-t border-surface-border/50 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-gray-500 tracking-[0.2em]">{String(i + 1).padStart(2, '0')} / 07</span>
                    <span className="material-symbols-outlined text-primary-light text-xl group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Explore Opportunities */}
          <div className="mt-16 flex justify-center">
            <Link href="/contact" className="w-full sm:w-auto h-14 px-10 rounded-xl bg-primary hover:bg-primary-light text-white font-bold transition-all glow-primary glow-primary-hover uppercase tracking-widest text-sm flex items-center justify-center gap-3 border border-primary-light/50 group">
              <span>{t('studio.inv.cta')}</span>
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
