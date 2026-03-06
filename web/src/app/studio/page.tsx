'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Studio() {
  const { t } = useLanguage();

  const dashboardItems = [
    { icon: 'sync_alt', name: t('studio.dashboard.dataflow'), sub: t('studio.dashboard.latency'), w: '98%' },
    { icon: 'precision_manufacturing', name: t('studio.dashboard.automation'), sub: t('studio.dashboard.coverage'), w: '94%' },
    { icon: 'trending_up', name: t('studio.dashboard.scalability'), sub: t('studio.dashboard.unlimited'), w: '100%' },
  ];

  const todayItems = [
    { title: t('studio.today.1.title'), desc: t('studio.today.1.desc') },
    { title: t('studio.today.2.title'), desc: t('studio.today.2.desc') },
    { title: t('studio.today.3.title'), desc: t('studio.today.3.desc') },
  ];

  const tomorrowItems = [
    { title: t('studio.tomorrow.1.title'), desc: t('studio.tomorrow.1.desc') },
    { title: t('studio.tomorrow.2.title'), desc: t('studio.tomorrow.2.desc') },
    { title: t('studio.tomorrow.3.title'), desc: t('studio.tomorrow.3.desc') },
  ];

  const simItems = [
    { label: t('studio.sim.core'), value: '65%', val: 65 },
    { label: t('studio.sim.error'), value: '-85%', val: 85 },
    { label: t('studio.sim.speed'), value: '300x', val: 60 },
  ];

  const roadmapSteps = [
    { num: 1, title: t('studio.road.s1.title'), desc: t('studio.road.s1.desc'), tags: ['Blueprint', 'Audit'], active: true },
    { num: 2, title: t('studio.road.s2.title'), desc: t('studio.road.s2.desc'), tags: ['RPA', 'API Gateway'], active: false },
    { num: 3, title: t('studio.road.s3.title'), desc: t('studio.road.s3.desc'), tags: ['Machine Learning'], active: false },
  ];

  const phaseTabs = [t('studio.road.1'), t('studio.road.2'), t('studio.road.3')];

  return (
    <main className="min-h-screen bg-transparent text-white flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative px-6 py-16 md:px-10 lg:px-40 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(to right, #333333 1px, transparent 1px), linear-gradient(to bottom, #333333 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        <div className="max-w-[1400px] mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <div className="inline-flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full glass-panel border border-primary/20 w-fit">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-[11px] font-bold shadow-[0_0_10px_rgba(206,16,38,0.5)]">4.0</span>
                <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">{t('studio.badge2')}</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight drop-shadow-xl text-white">
                {t('studio.title1')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{t('studio.title2')}</span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed max-w-xl border-l-4 border-primary pl-6">
                {t('studio.desc2')}
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Link href="/contact" className="flex items-center justify-center gap-3 h-14 px-8 rounded-xl bg-primary hover:bg-primary-light text-white font-bold transition-all glow-primary glow-primary-hover uppercase tracking-widest text-sm group border border-primary-light/50">
                  <span>{t('studio.cta1')}</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
                <Link href="/contact" className="flex items-center justify-center gap-3 h-14 px-8 rounded-xl glass-panel glass-panel-hover text-white font-bold transition-all uppercase tracking-widest text-sm border border-surface-border hover:border-primary/50">
                  <span className="material-symbols-outlined text-lg text-primary">settings_suggest</span>
                  <span>{t('studio.cta2')}</span>
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
                    <span className="text-white font-extrabold text-sm tracking-widest bg-primary/20 border border-primary/30 px-3 py-1 rounded-full">ACTIVE</span>
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

      {/* BPA Comparison */}
      <section className="bg-transparent py-24 px-6 md:px-10 lg:px-40 border-y border-surface-border">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-3 block">{t('studio.bpa.label')}</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">{t('studio.bpa.title')}</h2>
            <p className="text-secondary max-w-2xl mx-auto font-medium">
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
      </section>

      {/* Automation Simulator */}
      <section className="py-24 px-6 md:px-10 lg:px-40 bg-transparent">
        <div className="max-w-[1200px] mx-auto">
          <div className="glass-panel overflow-hidden shadow-2xl rounded-[2rem] border border-surface-border/60">
            <div className="grid lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 p-10 md:p-14 relative z-10">
                <div className="absolute inset-0 bg-surface-dark/90 backdrop-blur-xl -z-10"></div>
                <h3 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-4 tracking-tight">
                  <span className="material-symbols-outlined text-primary-light text-4xl drop-shadow-[0_0_15px_rgba(206,16,38,0.5)]">tune</span>
                  {t('studio.sim.title')}
                </h3>
                <p className="text-gray-400 mb-12 text-[15px] font-light leading-relaxed max-w-xl">{t('studio.sim.desc')}</p>
                <div className="space-y-10">
                  {simItems.map((item) => (
                    <div key={item.label} className="space-y-4 group">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] group-hover:text-gray-300 transition-colors">{item.label}</label>
                        <span className="text-primary-light font-black text-xl tracking-tight">{item.value}</span>
                      </div>
                      <div className="w-full h-3 bg-surface-darker rounded-full overflow-hidden border border-surface-border/50">
                        <div className="h-full bg-gradient-to-r from-primary-dark to-primary-light rounded-full shadow-[0_0_15px_rgba(206,16,38,0.6)] relative" style={{ width: `${item.val}%` }}>
                          <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-white/30 to-transparent"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-5 bg-gradient-to-br from-primary to-primary-dark p-10 md:p-14 flex flex-col justify-center relative overflow-hidden text-white border-l border-primary-light/20">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/20 rounded-full blur-[60px] mix-blend-overlay pointer-events-none"></div>
                <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-black/30 rounded-full blur-[50px] pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="mb-12">
                    <p className="text-[10px] font-bold text-white/80 uppercase tracking-[0.2em] mb-3 flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse"></span>
                      {t('studio.sim.impact')}
                    </p>
                    <h2 className="text-7xl font-black text-white tracking-tighter drop-shadow-lg">98.4%</h2>
                    <p className="text-[15px] font-medium text-white/90 mt-2">{t('studio.sim.total')}</p>
                  </div>
                  <div className="grid gap-5">
                    <div className="bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-md shadow-lg flex items-center justify-between hover:bg-white/20 transition-colors">
                      <div>
                        <div className="text-white/70 text-[10px] uppercase font-bold tracking-[0.2em] mb-1.5">{t('studio.sim.cycle')}</div>
                        <div className="text-white font-extrabold text-2xl tracking-tight">2.4h <span className="text-sm font-normal text-white/50 line-through ml-3">48h</span></div>
                      </div>
                      <span className="material-symbols-outlined text-white/90 text-3xl">timer_off</span>
                    </div>
                    <div className="bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-md shadow-lg flex items-center justify-between hover:bg-white/20 transition-colors">
                      <div>
                        <div className="text-white/70 text-[10px] uppercase font-bold tracking-[0.2em] mb-1.5">{t('studio.sim.opex')}</div>
                        <div className="text-white font-extrabold text-2xl tracking-tight">$125,000</div>
                      </div>
                      <span className="material-symbols-outlined text-white/90 text-3xl">savings</span>
                    </div>
                  </div>
                  <Link href="/contact" className="w-full mt-10 bg-white text-primary hover:text-primary-dark font-extrabold py-5 px-6 rounded-xl hover:bg-gray-100 transition-all shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 text-sm uppercase tracking-widest group">
                    <span>{t('studio.sim.download')}</span>
                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">download</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="bg-transparent border-t border-surface-border py-24 px-6 md:px-10 lg:px-40">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <span className="text-primary-light font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block px-3 py-1 rounded-full border border-primary/20 bg-primary/5 w-fit">{t('studio.road.label')}</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{t('studio.road.title')}</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {phaseTabs.map((phase, i) => (
                <span key={phase} className={`px-5 py-2.5 rounded-full border text-[11px] font-bold uppercase tracking-widest shadow-sm transition-colors ${i === 0
                    ? 'bg-primary border-primary-light text-white shadow-[0_0_15px_rgba(206,16,38,0.4)]'
                    : 'glass-panel border-surface-border text-gray-400 hover:text-white hover:border-surface-border/80'
                  }`}>
                  {phase}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connecting Line for Roadmap */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary via-surface-border to-surface-border z-0"></div>

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

      {/* Investment Portfolio */}
      <section className="py-24 px-6 md:px-10 lg:px-40 bg-transparent relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20 relative z-10">
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-4">{t('studio.inv.label')}</span>
              <h2 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
                {t('studio.inv.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{t('studio.inv.title2')}</span>
              </h2>
              <p className="text-gray-300 text-lg font-light leading-relaxed border-l-4 border-primary pl-6">
                {t('studio.inv.desc')}
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

          {/* How to Invest - Process Steps */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-10">
              <span className="text-primary-light font-bold uppercase tracking-[0.2em] text-[10px]">{t('studio.inv.process.label')}</span>
              <div className="h-px bg-gradient-to-r from-surface-border to-transparent flex-1"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: 1, icon: 'handshake', title: t('studio.inv.step1.title'), desc: t('studio.inv.step1.desc') },
                { num: 2, icon: 'fact_check', title: t('studio.inv.step2.title'), desc: t('studio.inv.step2.desc') },
                { num: 3, icon: 'account_balance', title: t('studio.inv.step3.title'), desc: t('studio.inv.step3.desc') },
                { num: 4, icon: 'monitoring', title: t('studio.inv.step4.title'), desc: t('studio.inv.step4.desc') },
              ].map((step) => (
                <div key={step.num} className="relative glass-panel rounded-[1.5rem] border border-surface-border/50 p-8 group hover:border-primary/30 transition-all hover:bg-surface-darker/60">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary-light text-sm font-black shadow-[0_0_15px_rgba(206,16,38,0.1)]">{step.num}</span>
                    <span className="material-symbols-outlined text-primary text-2xl group-hover:text-primary-light transition-colors">{step.icon}</span>
                  </div>
                  <h4 className="text-[15px] font-bold text-white mb-3 uppercase tracking-wide">{step.title}</h4>
                  <p className="text-[13px] text-gray-400 leading-relaxed font-light">{step.desc}</p>

                  {/* Subtle hover glow */}
                  <div className="absolute -inset-px bg-gradient-to-br from-primary/10 to-transparent rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Investment Data */}
          <div className="mb-20 glass-panel rounded-[2rem] border border-surface-border/60 p-10 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[50px] rounded-full mix-blend-screen pointer-events-none"></div>

            <h3 className="text-2xl font-extrabold text-white mb-10 flex items-center gap-4 tracking-tight">
              <span className="material-symbols-outlined text-primary-light text-3xl">info</span>
              {t('studio.inv.data.title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: 'domain', label: t('studio.inv.data.entity'), value: t('studio.inv.data.entity.value') },
                { icon: 'public', label: t('studio.inv.data.jurisdiction'), value: t('studio.inv.data.jurisdiction.value') },
                { icon: 'swap_horiz', label: t('studio.inv.data.models'), value: t('studio.inv.data.models.value') },
                { icon: 'currency_exchange', label: t('studio.inv.data.currency'), value: t('studio.inv.data.currency.value') },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-gray-400">
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{item.label}</span>
                  </div>
                  <p className="text-lg font-bold text-white tracking-wide">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: 'apartment', title: t('studio.inv.re.title'), desc: t('studio.inv.re.desc'), tag: t('studio.inv.re.tag'), accent: 'bg-[#CE1026]', href: 'https://inversion.pro-corp.net/real-state' },
              { icon: 'trending_down', title: t('studio.inv.da.title'), desc: t('studio.inv.da.desc'), tag: t('studio.inv.da.tag'), accent: 'bg-[#F59E0B]', href: 'https://inversion.pro-corp.net/real-state' },
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

          {/* Trust & Traceability */}
          <div className="mt-16 glass-panel rounded-[2rem] border border-primary/20 p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent -z-10 mix-blend-screen"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              <div className="flex flex-col items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(206,16,38,0.2)]">
                  <span className="material-symbols-outlined text-primary-light text-2xl">verified_user</span>
                </div>
                <div>
                  <span className="text-[15px] font-bold text-white tracking-wide">{t('studio.inv.security')}</span>
                </div>
              </div>
              <div className="flex flex-col items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(206,16,38,0.2)]">
                  <span className="material-symbols-outlined text-primary-light text-2xl">history_edu</span>
                </div>
                <div>
                  <span className="text-[15px] font-bold text-white tracking-wide">{t('studio.inv.track')}</span>
                </div>
              </div>
              <div className="flex flex-col items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(206,16,38,0.2)]">
                  <span className="material-symbols-outlined text-primary-light text-2xl">shield</span>
                </div>
                <div>
                  <span className="text-[15px] font-bold text-white tracking-wide block">{t('studio.inv.protection')}</span>
                  <span className="text-[13px] font-light text-gray-400 mt-1 block">{t('studio.inv.protection.desc')}</span>
                </div>
              </div>
              <div className="flex flex-col items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(206,16,38,0.2)]">
                  <span className="material-symbols-outlined text-primary-light text-2xl">support_agent</span>
                </div>
                <div>
                  <span className="text-[15px] font-bold text-white tracking-wide block">{t('studio.inv.managers')}</span>
                  <span className="text-[13px] font-light text-gray-400 mt-1 block">{t('studio.inv.managers.desc')}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center justify-between pt-8 border-t border-primary/20">
              <div className="flex items-center gap-3 text-gray-400">
                <span className="material-symbols-outlined text-primary-light text-2xl">public</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{t('studio.inv.international')}</span>
              </div>
              <Link href="/contact" className="w-full sm:w-auto h-14 px-10 rounded-xl bg-primary hover:bg-primary-light text-white font-bold transition-all glow-primary glow-primary-hover uppercase tracking-widest text-sm flex items-center justify-center gap-3 border border-primary-light/50 group">
                <span>{t('studio.inv.cta')}</span>
                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
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
