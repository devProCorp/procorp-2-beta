'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import ValueCycle from '@/components/studio/ValueCycle';

export default function Studio() {
  const { t } = useLanguage();
  const [sim, setSim] = useState({ core: 75, error: 66, speed: 28 });

  const dashboardItems = [
    { icon: 'sync_alt', name: t('studio.dashboard.dataflow'), sub: t('studio.dashboard.latency'), w: '98%' },
    { icon: 'precision_manufacturing', name: t('studio.dashboard.automation'), sub: t('studio.dashboard.coverage'), w: '94%' },
    { icon: 'trending_up', name: t('studio.dashboard.scalability'), sub: t('studio.dashboard.unlimited'), w: '100%' },
  ];

  const todayItems = [
    { title: t('studio.today.1.title'), desc: t('studio.today.1.desc') },
    { title: t('studio.today.2.title'), desc: t('studio.today.2.desc') },
    { title: t('studio.today.3.title'), desc: t('studio.today.3.desc') },
    { title: t('studio.today.4.title'), desc: t('studio.today.4.desc') },
  ];

  const tomorrowItems = [
    { title: t('studio.tomorrow.1.title'), desc: t('studio.tomorrow.1.desc') },
    { title: t('studio.tomorrow.2.title'), desc: t('studio.tomorrow.2.desc') },
    { title: t('studio.tomorrow.3.title'), desc: t('studio.tomorrow.3.desc') },
    { title: t('studio.tomorrow.4.title'), desc: t('studio.tomorrow.4.desc') },
  ];

  const simItems = [
    { key: 'core' as const, label: t('studio.sim.core'), value: `${sim.core}%` },
    { key: 'error' as const, label: t('studio.sim.error'), value: `-${sim.error}%` },
    { key: 'speed' as const, label: t('studio.sim.speed'), value: `${Math.max(1, sim.speed * 5)}x` },
  ];

  // Modelo de maqueta: proyección derivada de los sliders (98.4% con los valores por defecto)
  const simEff = Math.min(99.9, 20.4 + 0.4 * sim.core + 0.4 * sim.error + 0.3 * sim.speed);
  const simCycle = (48 * Math.pow(0.05, simEff / 98.4)).toFixed(1);
  const simOpexNum = Math.round((simEff / 98.4) * 125);
  const simOpex = simOpexNum.toLocaleString('en-US');
  const simThroughput = Math.max(1, sim.speed * 5);
  const simErrorRate = ((100 - sim.error) * 0.12).toFixed(1);
  // Cockpit preview: cada instrumento tiene rango objetivo; la alarma dispara al salirse
  const effOk = simEff >= 75;
  const cycleOk = Number(simCycle) <= 12;
  const opexOk = simOpexNum >= 90;
  const thruOk = simThroughput >= 120;
  const errOk = Number(simErrorRate) <= 4.5;
  const anyAlarm = !effOk || !cycleOk || !opexOk || !thruOk || !errOk;

  // Modelado de escenarios: presets que mueven los mismos sliders
  const SCENARIOS = [
    { key: 'cons', labelKey: 'studio.sim.scn.cons', preset: { core: 35, error: 50, speed: 30 } },
    { key: 'base', labelKey: 'studio.sim.scn.base', preset: { core: 75, error: 66, speed: 28 } },
    { key: 'aggr', labelKey: 'studio.sim.scn.aggr', preset: { core: 90, error: 95, speed: 85 } },
  ] as const;
  const activeScenario = SCENARIOS.find(
    (s) => s.preset.core === sim.core && s.preset.error === sim.error && s.preset.speed === sim.speed,
  )?.key;

  // Proyección a 12 meses: curva de adopción hacia simEff; la banda de incertidumbre
  // (P10–P90) se estrecha cuanto mayor es la automatización — más previsibilidad
  const projPts = Array.from({ length: 13 }, (_, m) => {
    const v = simEff * (1 - Math.exp(-m / 3.2));
    const band = (100 - sim.core) * 0.22 * (m / 12);
    return { x: (m / 12) * 240, mid: v, hi: Math.min(99.9, v + band), lo: Math.max(0, v - band) };
  });
  const py = (v: number) => 74 - (v / 100) * 66;
  const projLine = projPts.map((p) => `${p.x.toFixed(1)},${py(p.mid).toFixed(1)}`).join(' ');
  const projBand = [
    ...projPts.map((p) => `${p.x.toFixed(1)},${py(p.hi).toFixed(1)}`),
    ...[...projPts].reverse().map((p) => `${p.x.toFixed(1)},${py(p.lo).toFixed(1)}`),
  ].join(' ');

  const roadmapSteps = [
    { num: 1, title: t('studio.road.s1.title'), desc: t('studio.road.s1.desc'), tags: ['Blueprint', 'Audit'], active: true },
    { num: 2, title: t('studio.road.s2.title'), desc: t('studio.road.s2.desc'), tags: ['RPA', 'API Gateway'], active: true },
    { num: 3, title: t('studio.road.s3.title'), desc: t('studio.road.s3.desc'), tags: ['Machine Learning'], active: true },
  ];


  return (
    <main className="min-h-screen bg-transparent text-white flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative px-6 py-16 md:px-10 lg:px-40 lg:py-28 overflow-hidden">
        <div className="max-w-[1400px] mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight drop-shadow-xl text-white">
                {t('studio.title1')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{t('studio.title2')}</span>
              </h1>
              <p className="whitespace-pre-line text-gray-300 text-lg md:text-xl font-light leading-relaxed max-w-xl border-l-4 border-primary pl-6">
                {t('studio.desc2')}
              </p>
              <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed max-w-xl border-l-4 border-primary pl-6">
                {t('studio.desc3')}
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Link href="/contact" className="flex items-center justify-center gap-3 h-14 px-8 rounded-xl bg-primary hover:bg-primary-light text-white font-bold transition-all glow-primary glow-primary-hover uppercase tracking-widest text-sm group border border-primary-light/50">
                  <span>{t('studio.cta1')}</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative w-full aspect-square lg:aspect-[5/4] group">
              <div className="absolute -inset-10 bg-gradient-to-br from-primary/20 via-transparent to-primary/5 blur-[80px] -z-10 rounded-full group-hover:from-primary/30 transition-colors duration-700"></div>
              <div className="absolute inset-0 bg-surface-dark border border-surface-border rounded-[2rem] shadow-2xl overflow-hidden glass-panel">
                <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0 100 L100 0" stroke="#CE1026" strokeDasharray="2 2" strokeWidth="0.5"></path>
                  <path d="M20 100 L100 20" stroke="#CE1026" strokeDasharray="2 2" strokeWidth="0.5"></path>
                  <path d="M0 80 L80 0" stroke="#CE1026" strokeDasharray="2 2" strokeWidth="0.5"></path>
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] bg-background-dark/80 backdrop-blur-xl rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-surface-border/60 p-8 z-20">
                  <div className="flex justify-between items-center mb-8 border-b border-surface-border/50 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(39,201,63,0.8)]"></div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{t('studio.dashboard.status')}</span>
                    </div>
                    <span className="text-white font-extrabold text-sm tracking-widest bg-primary/20 border border-primary/30 px-3 py-1 rounded-full">{t('studio.dashboard.active')}</span>
                  </div>
                  <div className="space-y-6">
                    {dashboardItems.map((item) => (
                      <div key={item.icon} className="flex items-center justify-between group cursor-default">
                        <div className="flex items-center gap-4">
                          <span className="material-symbols-outlined text-gray-400 group-hover:text-primary-light transition-colors">{item.icon}</span>
                          <div>
                            <p className="font-bold text-white text-[13px] tracking-wide">{item.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{item.sub}</p>
                          </div>
                        </div>
                        <div className="w-32 h-2 bg-surface-darker rounded-full overflow-hidden border border-surface-border/50">
                          <div className={`h-full rounded-full ${item.icon === 'sync_alt' ? 'bg-gradient-to-r from-primary-dark to-primary-light shadow-[0_0_10px_#CE1026]' : 'bg-gray-300'}`} style={{ width: item.w }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-8 right-8 p-5 bg-gradient-to-br from-primary to-primary-dark border border-primary-light/30 text-white rounded-2xl shadow-[0_10px_30px_rgba(206,16,38,0.4)] z-30 transition-transform group-hover:scale-105">
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80 mb-1">{t('studio.dashboard.efficiency')}</p>
                  <p className="text-4xl font-black drop-shadow-md">+450%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Finding and Value Creation Cycle — bajo el frame principal */}
      <ValueCycle />

      {/* Roadmap */}
      <section className="bg-transparent border-t border-surface-border py-24 px-6 md:px-10 lg:px-40">
        <div className="max-w-[1200px] mx-auto lg:translate-x-[100px]">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <span className="text-primary-light font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block px-3 py-1 rounded-full border border-primary/20 bg-primary/5 w-fit">{t('studio.road.label')}</span>
              <h2 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{t('studio.road.title1')}</span>
                {t('studio.road.title2')}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connecting Line for Roadmap */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary via-primary-light to-primary z-0"></div>

            {roadmapSteps.map((step) => (
              <div key={step.num} className="group relative z-10">
                <div className="mb-8 flex items-center justify-center md:block">
                  <div className={`flex items-center justify-center w-16 h-16 rounded-2xl font-black text-2xl shadow-xl transition-all duration-300 mx-auto md:mx-0 ${step.active
                      ? 'bg-gradient-to-br from-primary to-primary-dark text-white border border-primary-light/50 shadow-[0_0_20px_rgba(206,16,38,0.5)] scale-110'
                      : 'glass-panel border-surface-border text-gray-500 group-hover:border-primary/50 group-hover:text-primary-light'
                    }`}>
                    {step.num}
                  </div>
                </div>
                <div className="glass-panel p-8 rounded-2xl border border-surface-border/50 group-hover:border-surface-border transition-colors text-center md:text-left h-full">
                  <h4 className="text-xl font-bold text-white mb-3 tracking-wide">{step.title}</h4>
                  <p className="text-[14px] text-gray-400 font-light leading-relaxed mb-6">{step.desc}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {step.tags.map((tag) => (
                      <span key={tag} className="bg-surface-darker/60 border border-surface-border/80 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Automation Simulator */}
      <section className="py-24 px-6 md:px-10 lg:px-40 bg-transparent">
        <div className="max-w-[1200px] mx-auto lg:translate-x-[100px]">
          <div className="glass-panel overflow-hidden shadow-2xl rounded-[2rem] border border-surface-border/60">
            {/* Arriba: título + los tres sliders en fila */}
            <div className="p-10 md:p-14 relative z-10">
              <div className="absolute inset-0 bg-surface-dark/90 backdrop-blur-xl -z-10"></div>
              <h3 className="text-5xl md:text-6xl font-extrabold text-white mb-2 flex items-center gap-4 tracking-tight leading-[1.1]">
                <span className="material-symbols-outlined text-primary-light text-5xl drop-shadow-[0_0_15px_rgba(206,16,38,0.5)]">tune</span>
                <span>
                  {t('studio.sim.title1')}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{t('studio.sim.title2')}</span>
                  {t('studio.sim.title3')}
                </span>
              </h3>
              <p className="text-gray-400 mb-10 text-[15px] font-light leading-relaxed max-w-xl">{t('studio.sim.desc')}</p>
              <div className="grid gap-10 md:grid-cols-3">
                {simItems.map((item) => (
                  <div key={item.key} className="space-y-4 group">
                    <div className="flex justify-between items-center">
                      <label htmlFor={`sim-${item.key}`} className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] group-hover:text-gray-300 transition-colors">{item.label}</label>
                      <span className="text-primary-light font-black text-xl tracking-tight">{item.value}</span>
                    </div>
                    <div className="relative w-full h-3 bg-surface-darker rounded-full border border-surface-border/50">
                      <div className="h-full bg-gradient-to-r from-primary-dark to-primary-light rounded-full shadow-[0_0_15px_rgba(206,16,38,0.6)] relative overflow-hidden" style={{ width: `${sim[item.key]}%` }}>
                        <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-white/30 to-transparent"></div>
                      </div>
                      <span
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-[3px] border-primary shadow-[0_0_12px_rgba(206,16,38,0.7)] pointer-events-none transition-transform group-hover:scale-110"
                        style={{ left: `${sim[item.key]}%` }}
                      ></span>
                      <input
                        id={`sim-${item.key}`}
                        type="range"
                        min={0}
                        max={100}
                        value={sim[item.key]}
                        onChange={(e) => setSim((s) => ({ ...s, [item.key]: Number(e.target.value) }))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        aria-label={item.label}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Abajo: el Business Cockpit rojo a todo el ancho */}
            <div className="bg-gradient-to-br from-primary-dark to-[#5c0712] p-10 md:p-14 relative overflow-hidden text-white border-t border-primary-light/20">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[60px] mix-blend-overlay pointer-events-none"></div>
              <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-black/30 rounded-full blur-[50px] pointer-events-none"></div>

              <div className="relative z-10">
                <div className="grid gap-10 lg:grid-cols-2">
                  <div>
                    {/* Cabecera del Cockpit: nombre de producto + estado en vivo */}
                    <div className="mb-10">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse"></span>
                        <span className="text-white">{t('studio.sim.cockpit')}</span>
                        <span className="text-white/50">·</span>
                        <span className="text-white/80">{t('studio.sim.preview')}</span>
                      </p>
                      <h2 className="text-7xl font-black text-white tracking-tighter drop-shadow-lg flex items-baseline gap-4">
                        {Math.round(simEff)}%
                        <span className={`text-3xl ${effOk ? 'text-green-300' : 'animate-pulse text-amber-300'}`} aria-hidden="true">{effOk ? '▲' : '▼'}</span>
                      </h2>
                      <p className="text-[15px] font-medium text-white mt-2">{t('studio.sim.total')}</p>
                      <p className="mt-3 text-[11px] font-medium leading-snug text-white/80">{t('studio.sim.disclaimer')}</p>
                    </div>
                    {/* Selector de escenarios: presets que mueven los mismos sliders */}
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/85">{t('studio.sim.scenarios')}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {SCENARIOS.map((s) => (
                          <button
                            key={s.key}
                            type="button"
                            onClick={() => setSim({ ...s.preset })}
                            className={`rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${activeScenario === s.key
                                ? 'bg-white text-primary shadow-lg'
                                : 'border border-white/30 text-white/80 hover:border-white/60 hover:text-white'
                              }`}
                          >
                            {t(s.labelKey)}
                          </button>
                        ))}
                        {!activeScenario && (
                          <span className="rounded-full border border-dashed border-white/40 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/70">
                            {t('studio.sim.scn.custom')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Instrumentos 2x2 */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: t('studio.sim.cycle'), value: <>{simCycle}h <span className="ml-1 text-xs font-normal text-white/50 line-through">48h</span></>, ok: cycleOk },
                        { label: t('studio.sim.opex'), value: <>${simOpex}K</>, ok: opexOk },
                        { label: t('studio.sim.throughput'), value: <>{simThroughput}x</>, ok: thruOk },
                        { label: t('studio.sim.errorrate'), value: <>{simErrorRate}%</>, ok: errOk },
                      ].map((tile, i) => (
                        <div key={i} className="rounded-xl border border-white/20 bg-black/20 p-4 backdrop-blur-md shadow-lg transition-colors hover:bg-black/30">
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/85">{tile.label}</span>
                            <span className={`text-[10px] font-bold ${tile.ok ? 'text-green-300' : 'animate-pulse text-amber-300'}`} aria-hidden="true">{tile.ok ? '▲' : '▼'}</span>
                          </div>
                          <div className="text-xl font-extrabold tracking-tight text-white">{tile.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Proyección del escenario: banda P10–P90 que se estrecha con más automatización */}
                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/85">{t('studio.sim.projection')}</span>
                        <span className="text-[9px] font-medium uppercase tracking-widest text-white/65">{t('studio.sim.band')}</span>
                      </div>
                      <svg className="h-24 w-full" viewBox="0 0 240 80" preserveAspectRatio="none" aria-hidden="true">
                        <line x1="0" y1={py(simEff)} x2="240" y2={py(simEff)} stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="4 4" />
                        <polygon points={projBand} fill="rgba(255,255,255,0.16)" />
                        <polyline points={projLine} fill="none" stroke="#fff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* El pulso del Cockpit */}
                <svg className="mt-10 h-8 w-full text-white/70" viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 20 H86 M114 20 H286 M314 20 H486 M514 20 H600" stroke="currentColor" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                  {[
                    'M86 20 L92 12 L98 34 L104 4 L110 30 L114 20',
                    'M286 20 L292 12 L298 34 L304 4 L310 30 L314 20',
                    'M486 20 L492 12 L498 34 L504 4 L510 30 L514 20',
                  ].map((d, i) => (
                    <path key={i} d={d} className="ecg-wave-grow" style={{ animationDelay: `${i * 1.6}s` }} stroke="currentColor" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                  ))}
                </svg>
                {/* Línea de alarma: se dispara cuando un indicador sale de rango */}
                <div className={`mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-widest ${anyAlarm
                    ? 'animate-pulse border border-amber-300/50 bg-black/30 text-amber-300'
                    : 'border border-white/20 bg-black/20 text-white'
                  }`}>
                  <span className="material-symbols-outlined text-lg">{anyAlarm ? 'warning' : 'check_circle'}</span>
                  {anyAlarm ? t('studio.sim.alarm') : t('studio.sim.allok')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BPA Comparison */}
      <section className="bg-transparent py-24 px-6 md:px-10 lg:px-40 border-y border-surface-border">
        <div className="max-w-[1200px] mx-auto lg:translate-x-[100px]">
          <div className="glass-panel rounded-[2rem] border border-surface-border/60 shadow-2xl p-8 md:p-14">
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              {t('studio.bpa.title1')}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{t('studio.bpa.title2')}</span>
              {t('studio.bpa.title3')}
            </h2>
            <p className="text-secondary max-w-2xl font-medium">
              {t('studio.bpa.desc')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-neutral-gray -translate-x-1/2"></div>
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black border-2 border-surface-border items-center justify-center text-secondary z-10">
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>

            {/* Today */}
            <div className="flex flex-col gap-8 p-10 rounded-[2rem] glass-panel border-surface-border/50 hover:border-surface-border transition-all">
              <div className="flex items-center gap-5 border-b border-surface-border/50 pb-6">
                <div className="p-4 rounded-xl bg-surface-darker border border-surface-border text-gray-400">
                  <span className="material-symbols-outlined text-3xl">history</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-wide">{t('studio.today')}</h3>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{t('studio.today.sub')}</span>
                </div>
              </div>
              <ul className="space-y-6">
                {todayItems.map((item) => (
                  <li key={item.title} className="flex items-start gap-4 opacity-60 hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-gray-500 shrink-0 mt-0.5">close</span>
                    <div>
                      <p className="text-white font-bold text-sm tracking-wide">{item.title}</p>
                      <p className="text-[13px] text-gray-400 mt-1 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tomorrow */}
            <div className="flex flex-col gap-8 p-10 rounded-[2rem] glass-panel border-primary/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full blur-[20px] z-0 group-hover:bg-primary/20 transition-colors duration-500"></div>
              <div className="flex items-center gap-5 border-b border-surface-border/50 pb-6 relative z-10">
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 text-primary-light shadow-[0_0_15px_rgba(206,16,38,0.2)]">
                  <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-wide">{t('studio.tomorrow')}</h3>
                  <span className="text-[10px] font-bold text-primary-light uppercase tracking-[0.2em]">{t('studio.tomorrow.sub')}</span>
                </div>
              </div>
              <ul className="space-y-6 relative z-10">
                {tomorrowItems.map((item) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary-light shrink-0 mt-0.5">check_circle</span>
                    <div>
                      <p className="text-white font-bold text-sm tracking-wide">{item.title}</p>
                      <p className="text-[13px] text-gray-300 mt-1 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Hero — Project Structuring */}
      <section id="project-structuring" className="scroll-mt-24 relative px-6 py-16 md:px-10 lg:px-40 lg:py-28 overflow-hidden">
        <div className="max-w-[1400px] mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight drop-shadow-xl text-white">
                {t('studio.proc.title1')}{t('studio.proc.title1') && <br />}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{t('studio.proc.title2')}</span>
                {t('studio.proc.title3')}
              </h1>
              <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed max-w-xl border-l-4 border-primary pl-6">
                {t('studio.desc3')}
              </p>
              <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed max-w-xl border-l-4 border-primary pl-6">
                {t('studio.inv.bridge')}
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Link href="/contact" className="flex items-center justify-center gap-3 h-14 px-8 rounded-xl bg-primary hover:bg-primary-light text-white font-bold transition-all glow-primary glow-primary-hover uppercase tracking-widest text-sm group border border-primary-light/50">
                  <span>{t('sectors.cta')}</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Mockup: blueprint del proyecto — viable, permisible, ejecutable */}
            <div className="relative w-full aspect-square lg:aspect-[5/4] group">
              <div className="absolute -inset-10 bg-gradient-to-br from-primary/20 via-transparent to-primary/5 blur-[80px] -z-10 rounded-full group-hover:from-primary/30 transition-colors duration-700"></div>
              <div className="absolute inset-0 bg-surface-dark border border-surface-border rounded-[2rem] shadow-2xl overflow-hidden glass-panel">
                <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0 100 L100 0" stroke="#CE1026" strokeDasharray="2 2" strokeWidth="0.5"></path>
                  <path d="M20 100 L100 20" stroke="#CE1026" strokeDasharray="2 2" strokeWidth="0.5"></path>
                  <path d="M0 80 L80 0" stroke="#CE1026" strokeDasharray="2 2" strokeWidth="0.5"></path>
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] bg-background-dark/80 backdrop-blur-xl rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-surface-border/60 p-8 z-20">
                  <div className="flex justify-between items-center mb-8 border-b border-surface-border/50 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(39,201,63,0.8)]"></div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{t('sectors.dash.label')}</span>
                    </div>
                    <span className="text-white font-extrabold text-sm tracking-widest bg-primary/20 border border-primary/30 px-3 py-1 rounded-full uppercase">{t('sectors.dash.badge')}</span>
                  </div>
                  <div className="space-y-6">
                    {[
                      { icon: 'query_stats', name: t('sectors.dash.r1.t'), sub: t('sectors.dash.r1.s'), w: '96%', hot: true },
                      { icon: 'gavel', name: t('sectors.dash.r2.t'), sub: t('sectors.dash.r2.s'), w: '100%', hot: false },
                      { icon: 'construction', name: t('sectors.dash.r3.t'), sub: t('sectors.dash.r3.s'), w: '92%', hot: false },
                    ].map((item) => (
                      <div key={item.icon} className="flex items-center justify-between group cursor-default">
                        <div className="flex items-center gap-4">
                          <span className="material-symbols-outlined text-gray-400 group-hover:text-primary-light transition-colors">{item.icon}</span>
                          <div>
                            <p className="font-bold text-white text-[13px] tracking-wide">{item.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{item.sub}</p>
                          </div>
                        </div>
                        <div className="w-32 h-2 bg-surface-darker rounded-full overflow-hidden border border-surface-border/50">
                          <div className={item.hot ? 'h-full rounded-full bg-gradient-to-r from-primary-dark to-primary-light shadow-[0_0_10px_#CE1026]' : 'h-full rounded-full bg-gray-300'} style={{ width: item.w }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-8 right-8 p-5 bg-gradient-to-br from-primary to-primary-dark border border-primary-light/30 text-white rounded-2xl shadow-[0_10px_30px_rgba(206,16,38,0.4)] z-30 transition-transform group-hover:scale-105">
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80 mb-1">{t('sectors.dash.kpi')}</p>
                  <p className="text-4xl font-black drop-shadow-md">-40%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Los 4 pasos de la estructuración */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: 1, icon: 'handshake', title: t('studio.inv.step1.title'), desc: t('studio.inv.step1.desc') },
              { num: 2, icon: 'fact_check', title: t('studio.inv.step2.title'), desc: t('studio.inv.step2.desc') },
              { num: 3, icon: 'account_balance', title: t('studio.inv.step3.title'), desc: t('studio.inv.step3.desc') },
              { num: 4, icon: 'monitoring', title: t('studio.inv.step4.title'), desc: t('studio.inv.step4.desc') },
            ].map((step) => (
              <div key={step.num} className="relative glass-panel rounded-[1.5rem] border border-surface-border/50 p-8 group hover:border-primary/30 transition-all hover:bg-surface-darker/60">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary border border-primary-light/50 text-white text-sm font-black shadow-[0_0_15px_rgba(206,16,38,0.4)]">{step.num}</span>
                  <span className="material-symbols-outlined text-primary text-2xl group-hover:text-primary-light transition-colors">{step.icon}</span>
                </div>
                <h4 className="text-[15px] font-bold text-white mb-3 uppercase tracking-wide">{step.title}</h4>
                <p className="text-[13px] text-gray-400 leading-relaxed font-light">{step.desc}</p>
                <div className="absolute -inset-px bg-gradient-to-br from-primary/10 to-transparent rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 md:px-10 lg:px-40 relative overflow-hidden bg-transparent border-t border-surface-border">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none z-0"></div>
        <div className="max-w-[800px] mx-auto text-center relative z-10 glass-panel p-12 md:p-20 rounded-[3rem] shadow-2xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 mb-8 shadow-[0_0_20px_rgba(206,16,38,0.15)]">
            <span className="material-symbols-outlined text-4xl text-primary-light">bolt</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 uppercase">{t('studio.final.title')}</h2>
          <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed mb-12 max-w-xl mx-auto">
            {t('studio.final.desc')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="h-16 px-10 rounded-xl bg-primary hover:bg-primary-light text-white font-bold text-sm uppercase tracking-widest transition-all glow-primary glow-primary-hover flex items-center justify-center gap-3 border border-primary-light/50 group w-full sm:w-auto">
              <span>{t('studio.final.cta1')}</span>
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
            <Link href="/contact" className="h-16 px-10 rounded-xl glass-panel glass-panel-hover text-white font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-surface-border w-full sm:w-auto">
              <span className="material-symbols-outlined text-xl text-primary">settings</span>
              <span>{t('studio.final.cta2')}</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
