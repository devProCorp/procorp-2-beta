'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Pro Corp Value Finding and Value Creation Cycle — 6 pasos + capa Tiempo Real.
 * El ECG grande late entre las dos filas de tarjetas (la onda muta en un orbe);
 * la banda inferior es el Business Cockpit con indicadores que emergen por latido.
 * Extraído de About para vivir bajo el frame principal de Sustainable Growth.
 */

// Indicadores que emergen con cada latido del pulso Tiempo Real (decorativo)
const RT_KPIS: Record<string, string[]> = {
  en: ['EBITDA', 'INVENTORY', 'PROJECT PROGRESS', 'DEBT', 'AVAILABLE CASH', 'SALES PIPELINE', 'TRAINING RESULTS', 'COMPETENCES PROGRAM', 'ACCOUNTS RECEIVABLES', 'CLIENT SATISFACTION', 'TIME TO MARKET', 'OPERATING MARGIN'],
  es: ['EBITDA', 'INVENTARIO', 'AVANCE DE PROYECTOS', 'DEUDA', 'CAJA DISPONIBLE', 'PIPELINE DE VENTAS', 'RESULTADOS DE FORMACIÓN', 'PROGRAMA DE COMPETENCIAS', 'CUENTAS POR COBRAR', 'SATISFACCIÓN DEL CLIENTE', 'TIME TO MARKET', 'MARGEN OPERATIVO'],
  pt: ['EBITDA', 'ESTOQUE', 'PROGRESSO DE PROJETOS', 'DÍVIDA', 'CAIXA DISPONÍVEL', 'PIPELINE DE VENDAS', 'RESULTADOS DE TREINAMENTO', 'PROGRAMA DE COMPETÊNCIAS', 'CONTAS A RECEBER', 'SATISFAÇÃO DO CLIENTE', 'TIME TO MARKET', 'MARGEM OPERACIONAL'],
};

export default function ValueCycle() {
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

  return (
    <section id="vfvc" className="scroll-mt-24 py-28 px-6 md:px-10 lg:px-40 bg-transparent relative overflow-hidden border-t border-surface-border">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
      <div className="max-w-[1200px] mx-auto lg:translate-x-[100px] relative z-10">
        <div className="mb-20 text-left">
          <h2 className="text-[10px] font-bold text-primary-light uppercase tracking-[0.2em] mb-4 inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">{t('about.method.label')}</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-white">
            {t('about.method.title.pre')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{t('about.method.title.accent')}</span>
            {t('about.method.title.post') && <> {t('about.method.title.post')}</>}
          </h3>
          <p className="mt-6 text-gray-400 font-light leading-relaxed max-w-2xl text-[15px]">{t('about.method.desc')}</p>
        </div>
        <div className="relative flex flex-col gap-10">
          {/* VFVC Container */}
          <div className="relative rounded-[2.5rem] border-2 border-surface-border/70 bg-white/[0.02] p-8 md:p-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <div className="absolute -top-px left-1/2 -translate-x-1/2 px-6 py-2 bg-surface-darker rounded-b-xl border border-surface-border border-t-0 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <span className="text-[11px] font-black text-white uppercase tracking-[0.25em]">VFVC</span>
            </div>
            <div className="relative mt-6">
              {/* Tiempo Real: la traza corre exactamente por la franja entre las dos filas de tarjetas.
                  Cada latido "muta": el pico del ECG se apaga y en su lugar florece un orbe. */}
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
              <div className="shrink-0 text-center md:max-w-xs md:text-left">
                <div className="flex items-center justify-center gap-3 md:justify-start">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(206,16,38,0.8)]"></span>
                  <span className="whitespace-nowrap text-sm font-black uppercase tracking-[0.25em]">
                    <span className="text-white">{t('about.rt.name')}</span>
                    <span className="mx-2 text-gray-500">·</span>
                    <span className="text-primary-light">{t('about.rt.label')}</span>
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-light leading-snug text-gray-300">{t('about.rt.desc')}</p>
              </div>
              <div className="relative w-full md:flex-1 h-14">
                <svg className="absolute inset-x-0 bottom-0 w-full h-10 overflow-visible" viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden="true">
                  {/* Línea y ondas siempre encendidas; la onda que late crece */}
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
            </div>

            <p className="mt-10 text-center text-gray-400 italic font-light text-[15px]">{t('about.method.repeat')}</p>
          </div>

        </div>
      </div>
    </section>
  );
}
