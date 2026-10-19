'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import ProjectsGrid from './ProjectsGrid';
import type { ProjectsData } from '@/lib/projects-live';

/**
 * Projects — Estructuración de Proyectos + Strategic Sectors.
 * Hero al estilo Sustainable Growth (título bicolor, párrafos con barra
 * roja, CTA y mockup tipo dashboard); debajo los 4 pasos, luego el
 * portafolio de sectores. Trilingüe ES/EN/PT.
 */
export default function ProjectsView({ initial }: { initial: ProjectsData | null }) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-transparent text-white flex flex-col overflow-x-hidden">
      {/* Strategic Sectors + Some projects */}
      <section className="py-24 px-6 md:px-10 lg:px-40 bg-transparent relative overflow-hidden border-t border-surface-border">
        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* Header: título a todo el ancho; textos y cifras en dos columnas para no dejar hueco a la derecha */}
          <div className="mb-20 relative z-10">
            <span className="inline-block px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-4">{t('studio.inv.label')}</span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-10">
              {t('studio.inv.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{t('studio.inv.title2')}</span>
            </h1>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8 space-y-4">
                <p className="text-gray-300 text-lg font-light leading-relaxed border-l-4 border-primary pl-6">
                  {t('studio.inv.desc')}
                </p>
                <p className="text-gray-300 text-lg font-light leading-relaxed border-l-4 border-primary pl-6">
                  {t('studio.inv.offer')}
                </p>
                <p className="border-l-4 border-primary-light/60 pl-6 text-base font-medium italic leading-relaxed text-white">
                  {t('studio.inv.bridge')}
                </p>
              </div>
              {/* Cifras: en fila en móvil/tablet, en columna junto al texto en escritorio */}
              <div className="lg:col-span-4 glass-panel rounded-2xl border border-surface-border/60 shadow-xl grid grid-cols-3 lg:grid-cols-1 divide-x lg:divide-x-0 lg:divide-y divide-surface-border">
              <div className="px-1 py-6 text-center sm:px-4">
                <p className="text-xl sm:text-3xl font-black text-white">{t('studio.inv.stat1.value')}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] mt-1">{t('studio.inv.stat1.label')}</p>
              </div>
              <div className="px-1 py-6 text-center sm:px-4">
                <p className="text-xl sm:text-3xl font-black text-primary-light drop-shadow-[0_0_10px_rgba(206,16,38,0.3)]">{t('studio.inv.stat2.value')}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] mt-1">{t('studio.inv.stat2.label')}</p>
              </div>
              <div className="px-1 py-6 text-center sm:px-4">
                <p className="text-xl sm:text-3xl font-black text-white">{t('studio.inv.stat3.value')}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] mt-1">{t('studio.inv.stat3.label')}</p>
              </div>
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

          {/* Proyectos de investment_projects (los mismos de inversion.pro-corp.net) */}
          <ProjectsGrid initial={initial} />

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
