'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Beliefs } from '@/components/manifesto/StorySections';
import ProCorpStory from '@/components/about/ProCorpStory';

// Indicadores que emergen con cada latido del pulso Tiempo Real (decorativo)
const RT_KPIS: Record<string, string[]> = {
  en: ['EBITDA', 'INVENTORY', 'PROJECT PROGRESS', 'DEBT', 'AVAILABLE CASH', 'SALES PIPELINE', 'TRAINING RESULTS', 'COMPETENCES PROGRAM', 'ACCOUNTS RECEIVABLES', 'CLIENT SATISFACTION', 'TIME TO MARKET', 'OPERATING MARGIN'],
  es: ['EBITDA', 'INVENTARIO', 'AVANCE DE PROYECTOS', 'DEUDA', 'CAJA DISPONIBLE', 'PIPELINE DE VENTAS', 'RESULTADOS DE FORMACIÓN', 'PROGRAMA DE COMPETENCIAS', 'CUENTAS POR COBRAR', 'SATISFACCIÓN DEL CLIENTE', 'TIME TO MARKET', 'MARGEN OPERATIVO'],
  pt: ['EBITDA', 'ESTOQUE', 'PROGRESSO DE PROJETOS', 'DÍVIDA', 'CAIXA DISPONÍVEL', 'PIPELINE DE VENDAS', 'RESULTADOS DE TREINAMENTO', 'PROGRAMA DE COMPETÊNCIAS', 'CONTAS A RECEBER', 'SATISFAÇÃO DO CLIENTE', 'TIME TO MARKET', 'MARGEM OPERACIONAL'],
};

export default function About() {
  const { t, lang } = useLanguage();
  const rtKpis = RT_KPIS[lang] ?? RT_KPIS.en;
  // Estado aleatorio de cada indicador: verde (bien, flecha arriba) o rojo (mal, flecha abajo).
  // Se sortea tras el montaje para no desincronizar la hidratación, y se re-sortea en cada rotación completa.
  const [kpiUp, setKpiUp] = useState<boolean[]>(() => Array(12).fill(true));
  useEffect(() => {
    const roll = () => setKpiUp(Array.from({ length: 12 }, () => Math.random() < 0.5));
    roll();
    const id = setInterval(roll, 19200);
    return () => clearInterval(id);
  }, []);

  const bpaSteps = [
    { num: 1, icon: 'travel_explore', title: t('about.step1'), desc: t('about.step1.desc') },
    { num: 2, icon: 'schema', title: t('about.step2'), desc: t('about.step2.desc') },
    { num: 3, icon: 'science', title: t('about.step3'), desc: t('about.step3.desc') },
    { num: 4, icon: 'design_services', title: t('about.step4'), desc: t('about.step4.desc') },
    { num: 5, icon: 'construction', title: t('about.step5'), desc: t('about.step5.desc') },
    { num: 6, icon: 'autorenew', title: t('about.step6'), desc: t('about.step6.desc') },
  ];


  const features = [
    { icon: 'verified_user', title: t('about.f1.title'), desc: t('about.f1.desc') },
    { icon: 'trending_up', title: t('about.f2.title'), desc: t('about.f2.desc') },
  ];


  return (
    <main className="flex-grow">
      <ProCorpStory />
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-60">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-surface-dark/50 to-background-dark z-10 backdrop-blur-[2px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] mix-blend-screen"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col gap-8">
          <h1 className="text-[3.75rem] md:text-[5.625rem] lg:text-[7.5rem] font-extrabold tracking-tight leading-[1.05] text-white drop-shadow-2xl">
            {t('about.title1')}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{t('about.title2')}</span>
          </h1>
          <p className="text-[1.7rem] md:text-3xl font-semibold text-white italic max-w-3xl mx-auto leading-relaxed">
            {t('about.closing')}
          </p>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed whitespace-pre-line text-justify">
            {t('about.desc')}
          </p>
          <div className="max-w-3xl mx-auto w-full text-left">
            {t('about.desc2').split('\n').map((line, i) => (
              <p
                key={line}
                className={`text-[1.7rem] md:text-3xl font-semibold text-white italic leading-relaxed flex items-start gap-4 ${
                  ['', 'pl-5 md:pl-20', 'pl-10 md:pl-40', 'pl-14 md:pl-60'][i] ?? ''
                }`}
              >
                <span className="text-primary-light">•</span>
                <span>{line}</span>
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Work For + Our Commitment */}
      <section className="py-24 px-6 bg-transparent border-t border-surface-border">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {[
            { pre: t('about.who.title1'), accent: t('about.who.title2'), items: [t('about.who.1'), t('about.who.2'), t('about.who.3'), t('about.who.4')] },
            { pre: t('about.commit.title1'), accent: t('about.commit.title2'), items: [t('about.commit.1'), t('about.commit.2'), t('about.commit.3'), t('about.commit.4')] },
          ].map((block) => (
            <div key={block.accent} className="glass-panel rounded-[2rem] border border-surface-border/60 p-10 flex flex-col">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05] mb-8">
                {block.pre}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{block.accent}</span>
              </h2>
              <div className="flex flex-col gap-5">
                {block.items.map((item) => (
                  <p key={item} className="border-l-2 border-primary pl-5 text-gray-300 font-light leading-relaxed text-[15px]">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6 bg-transparent">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-2 tracking-tight leading-[1.05]">
                {t('about.mission.title1')}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{t('about.mission.title2')}</span>
                {t('about.mission.title3')}
              </h2>
              <p className="text-gray-400 font-light leading-relaxed text-[15px] border-l-4 border-primary pl-6">
                {t('about.mission.desc')}
              </p>
              <div className="flex flex-col gap-6 mt-4">
                {features.map((f) => (
                  <div key={f.title} className="flex items-start gap-5 glass-panel p-5 rounded-2xl border border-surface-border/50 hover:border-surface-border group transition-all">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-3 rounded-xl border border-primary/30 text-primary-light shadow-[0_0_15px_rgba(206,16,38,0.1)] group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined text-[24px]">{f.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1 tracking-wide group-hover:text-primary-light transition-colors">{f.title}</h3>
                      <p className="text-gray-400 text-sm font-light leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[600px] rounded-[2rem] overflow-hidden shadow-2xl glass-panel group border border-surface-border/60">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
              <div className="w-full h-full bg-gradient-to-br from-surface-darker to-black">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
              </div>
              <div className="absolute bottom-8 left-8 right-8 z-20">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-primary-light">{t('about.team.label')}</p>
                <h3 className="text-3xl font-extrabold text-white tracking-tight leading-tight">{t('about.team.title')}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-28 px-6 bg-transparent relative overflow-hidden border-t border-surface-border">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-[10px] font-bold text-primary-light uppercase tracking-[0.2em] mb-4 inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">{t('about.method.label')}</h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-white">
              {t('about.method.title.pre')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{t('about.method.title.accent')}</span>
              {t('about.method.title.post') && <> {t('about.method.title.post')}</>}
            </h3>
            <p className="mt-6 text-gray-400 font-light leading-relaxed max-w-2xl mx-auto text-[15px]">{t('about.method.desc')}</p>
          </div>
          <div className="relative flex flex-col gap-10">
            {/* BPA Container */}
            <div className="relative rounded-[2.5rem] border-2 border-surface-border/70 bg-white/[0.02] p-8 md:p-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="absolute -top-px left-1/2 -translate-x-1/2 px-6 py-2 bg-surface-darker rounded-b-xl border border-surface-border border-t-0 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <span className="text-[11px] font-black text-white uppercase tracking-[0.25em]">BPA</span>
              </div>
              <div className="relative mt-6">
                {/* Tiempo Real: la traza corre exactamente por la franja entre las dos filas de tarjetas.
                    Cada latido "muta": el pico del ECG se apaga y en su lugar florece un sol. */}
                <div className="hidden lg:block absolute inset-x-0 top-1/2 -translate-y-1/2 h-24 pointer-events-none">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 96" preserveAspectRatio="none" aria-hidden="true">
                    {/* Línea base constante — se interrumpe donde vive cada onda para que la traza sea una sola */}
                    <path d="M0 48 H140 M218 48 H420 M498 48 H700 M778 48 H980 M1058 48 H1200" className="text-primary opacity-35" stroke="currentColor" strokeWidth="2.5" fill="none" vectorEffect="non-scaling-stroke" />
                    {/* Las cuatro ondas siempre visibles; solo la que late se enciende y muta en el orbe */}
                    {[
                      'M140 48 L156 40 L172 62 L188 22 L204 72 L218 48',
                      'M420 48 L436 40 L452 62 L468 22 L484 72 L498 48',
                      'M700 48 L716 40 L732 62 L748 22 L764 72 L778 48',
                      'M980 48 L996 40 L1012 62 L1028 22 L1044 72 L1058 48',
                    ].map((d, i) => (
                      <path key={i} d={d} className="ecg-wave-morph text-primary" style={{ animationDelay: `${i * 1.6}s` }} stroke="currentColor" strokeWidth="2.5" fill="none" vectorEffect="non-scaling-stroke" />
                    ))}
                  </svg>
                  {/* El punto luminoso difuminado que emerge de cada latido — mismo lenguaje visual que los nodos del hero */}
                  {[14.9, 38.2, 61.6, 84.9].map((left, i) => (
                    <span
                      key={i}
                      className="sun-beat absolute top-1/2 w-12 h-12 rounded-full bg-primary-light blur-[10px] shadow-[0_0_36px_18px_rgba(206,16,38,0.6)]"
                      style={{ left: `${left}%`, animationDelay: `${i * 1.6}s` }}
                      aria-hidden="true"
                    ></span>
                  ))}
                </div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-fr gap-6">
                  {bpaSteps.map((s) => (
                    <div key={s.num} className="group relative">
                      <div className="h-full glass-panel glass-panel-hover rounded-[1.5rem] p-7 flex flex-col items-center text-center gap-4 border border-surface-border/50">
                        <div className="w-14 h-14 rounded-2xl bg-primary border border-primary-light/50 text-white flex items-center justify-center font-black text-xl mb-1 shadow-xl">{s.num}</div>
                        <div className="text-gray-200 mb-1 group-hover:scale-110 transition-transform duration-300">
                          <span className="material-symbols-outlined text-[36px]">{s.icon}</span>
                        </div>
                        <h4 className="text-white font-bold text-lg leading-tight tracking-wide">{s.title}</h4>
                        <p className="text-[12px] font-light text-gray-400 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tiempo Real — el pulso continuo bajo el ciclo */}
              <div className="mt-10 rounded-2xl border border-primary/25 bg-primary/5 px-6 py-5 md:px-8 flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <div className="flex items-center gap-3 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(206,16,38,0.8)]"></span>
                  <span className="text-sm font-black uppercase tracking-[0.25em] text-primary-light">{t('about.rt.label')}</span>
                </div>
                <div className="relative w-full md:flex-1 h-14">
                  <svg className="absolute inset-x-0 bottom-0 w-full h-10 overflow-visible" viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden="true">
                    {/* Línea y ondas siempre encendidas; la onda que late crece 50% */}
                    <path d="M0 20 H86 M114 20 H286 M314 20 H486 M514 20 H600" className="text-primary-light drop-shadow-[0_0_6px_rgba(206,16,38,0.7)]" stroke="currentColor" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                    {[
                      'M86 20 L92 12 L98 34 L104 4 L110 30 L114 20',
                      'M286 20 L292 12 L298 34 L304 4 L310 30 L314 20',
                      'M486 20 L492 12 L498 34 L504 4 L510 30 L514 20',
                    ].map((d, i) => (
                      <path key={i} d={d} className="ecg-wave-grow text-primary-light drop-shadow-[0_0_6px_rgba(206,16,38,0.9)]" style={{ animationDelay: `${i * 1.6}s` }} stroke="currentColor" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                    ))}
                  </svg>
                  {/* Cada latido revela un indicador distinto sobre su onda (4 rondas de 3);
                      verde con flecha arriba = bien, rojo con flecha abajo = mal (aleatorio) */}
                  {[0, 1, 2].flatMap((pos) => [0, 1, 2, 3].map((round) => {
                    const idx = pos + round * 3;
                    const up = kpiUp[idx];
                    return (
                      <span
                        key={`${pos}-${round}`}
                        className={`kpi-beat absolute top-0 text-[9px] md:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap pointer-events-none ${up
                          ? 'text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                          : 'text-red-500 drop-shadow-[0_0_8px_rgba(206,16,38,0.7)]'
                          }`}
                        style={{ left: `${16.7 + pos * 33.3}%`, animationDelay: `${pos * 1.6 + round * 4.8}s` }}
                      >
                        {rtKpis[idx]} <span aria-hidden="true">{up ? '▲' : '▼'}</span>
                      </span>
                    );
                  }))}
                </div>
                <p className="text-[13px] text-gray-300 font-light md:max-w-xs shrink-0 text-center md:text-right">{t('about.rt.desc')}</p>
              </div>

              <p className="mt-10 text-center text-gray-400 italic font-light text-[15px]">{t('about.method.repeat')}</p>
            </div>

          </div>
        </div>
      </section>

      {/* We Believe */}
      <Beliefs />

      {/* CTA */}
      <section className="py-28 px-6 bg-transparent border-b border-surface-border">
        <div className="max-w-4xl mx-auto glass-panel border border-surface-border/60 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[80px] rounded-full pointer-events-none mix-blend-screen"></div>

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 mb-8 shadow-[0_0_20px_rgba(206,16,38,0.15)] relative z-10">
            <span className="material-symbols-outlined text-4xl text-primary-light drop-shadow-md">rocket_launch</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 relative z-10 tracking-tight uppercase">{t('about.cta.title')}</h2>
          <p className="text-gray-300 font-light text-lg mb-12 max-w-xl mx-auto relative z-10 leading-relaxed">
            {t('about.cta.desc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <Link href="/contact" className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-xl h-16 px-10 bg-primary hover:bg-primary-light text-white text-sm uppercase tracking-widest font-bold transition-all glow-primary glow-primary-hover group border border-primary-light/50">
              {t('about.cta.btn1')}
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
            <a href="https://inversion.pro-corp.net" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-xl h-16 px-10 glass-panel glass-panel-hover border-surface-border text-white text-sm uppercase tracking-widest font-bold transition-all group">
              {t('about.cta.btn2')}
              <span className="material-symbols-outlined text-xl text-primary group-hover:translate-x-1 transition-transform">view_carousel</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
