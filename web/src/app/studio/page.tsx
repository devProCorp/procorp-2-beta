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
    <main className="min-h-screen bg-[#1a1a1a] text-white flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative px-6 py-16 md:px-10 lg:px-40 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(to right, #333333 1px, transparent 1px), linear-gradient(to bottom, #333333 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        <div className="max-w-[1400px] mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <div className="inline-flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#262626] border border-gray-700 w-fit">
                <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">4.0</span>
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{t('studio.badge2')}</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
                {t('studio.title1')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-800">{t('studio.title2')}</span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl border-l-4 border-primary pl-6">
                {t('studio.desc2')}
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Link href="/contact" className="flex items-center justify-center gap-3 h-14 px-8 rounded bg-primary hover:bg-red-700 text-white font-bold transition-all shadow-xl shadow-primary/30 group uppercase tracking-wide text-sm">
                  <span>{t('studio.cta1')}</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
                <button className="flex items-center justify-center gap-3 h-14 px-8 rounded border-2 border-gray-700 hover:border-primary hover:text-primary text-white font-bold transition-all uppercase tracking-wide text-sm bg-transparent">
                  <span className="material-symbols-outlined text-lg">settings_suggest</span>
                  <span>{t('studio.cta2')}</span>
                </button>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative w-full aspect-square lg:aspect-[5/4]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#222] to-[#1a1a1a] rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
                <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0 100 L100 0" stroke="#CE1026" strokeDasharray="2 2" strokeWidth="0.5"></path>
                  <path d="M20 100 L100 20" stroke="#CE1026" strokeDasharray="2 2" strokeWidth="0.5"></path>
                  <path d="M0 80 L80 0" stroke="#CE1026" strokeDasharray="2 2" strokeWidth="0.5"></path>
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 bg-[#1a1a1a] rounded-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-700 p-8 z-20">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{t('studio.dashboard.status')}</span>
                    </div>
                    <span className="text-primary font-black text-xl">ACTIVE</span>
                  </div>
                  <div className="space-y-6">
                    {dashboardItems.map((item) => (
                      <div key={item.icon} className="flex items-center justify-between group cursor-default">
                        <div className="flex items-center gap-4">
                          <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">{item.icon}</span>
                          <div>
                            <p className="font-bold text-white text-sm">{item.name}</p>
                            <p className="text-[10px] text-gray-400 uppercase">{item.sub}</p>
                          </div>
                        </div>
                        <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${item.icon === 'sync_alt' ? 'bg-primary shadow-[0_0_10px_#CE1026]' : 'bg-white'}`} style={{ width: item.w }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-10 right-10 p-4 bg-primary text-white rounded shadow-lg z-30">
                  <p className="text-[10px] uppercase font-bold opacity-80 mb-1">{t('studio.dashboard.efficiency')}</p>
                  <p className="text-3xl font-black">+450%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BPA Comparison */}
      <section className="bg-[#111111] py-24 px-6 md:px-10 lg:px-40 border-y border-gray-800">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-3 block">{t('studio.bpa.label')}</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">{t('studio.bpa.title')}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto font-medium">
              {t('studio.bpa.desc')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-800 -translate-x-1/2"></div>
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#111111] border-2 border-gray-700 items-center justify-center text-gray-400 z-10">
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>

            {/* Today */}
            <div className="flex flex-col gap-8 p-10 rounded bg-[#1a1a1a] shadow-sm border border-gray-800 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
                <div className="p-3 rounded bg-gray-800 text-gray-500">
                  <span className="material-symbols-outlined">history</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{t('studio.today')}</h3>
                  <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">{t('studio.today.sub')}</span>
                </div>
              </div>
              <ul className="space-y-6">
                {todayItems.map((item) => (
                  <li key={item.title} className="flex items-start gap-4 opacity-70">
                    <span className="material-symbols-outlined text-red-500 shrink-0">close</span>
                    <div>
                      <p className="text-white font-bold text-sm">{item.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tomorrow */}
            <div className="flex flex-col gap-8 p-10 rounded bg-[#1a1a1a] shadow-2xl shadow-primary/10 border-2 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full z-0"></div>
              <div className="flex items-center gap-4 border-b border-gray-800 pb-6 relative z-10">
                <div className="p-3 rounded bg-primary text-white shadow-lg shadow-primary/30">
                  <span className="material-symbols-outlined">rocket_launch</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{t('studio.tomorrow')}</h3>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{t('studio.tomorrow.sub')}</span>
                </div>
              </div>
              <ul className="space-y-6 relative z-10">
                {tomorrowItems.map((item) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary shrink-0">check_circle</span>
                    <div>
                      <p className="text-white font-bold text-sm">{item.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Automation Simulator */}
      <section className="py-24 px-6 md:px-10 lg:px-40 bg-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-[#262626] rounded-xl overflow-hidden shadow-2xl border border-gray-800">
            <div className="grid lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 p-10 md:p-14 bg-[#1a1a1a]">
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">tune</span>
                  {t('studio.sim.title')}
                </h3>
                <p className="text-gray-500 mb-12 text-sm font-medium">{t('studio.sim.desc')}</p>
                <div className="space-y-10">
                  {simItems.map((item) => (
                    <div key={item.label} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-gray-300 uppercase tracking-wide">{item.label}</label>
                        <span className="text-primary font-bold text-lg">{item.value}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-lg overflow-hidden">
                        <div className="h-full bg-primary rounded-lg" style={{ width: `${item.val}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-5 bg-primary p-10 md:p-14 flex flex-col justify-center relative overflow-hidden text-white">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="mb-10">
                    <p className="text-xs font-bold text-white/80 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                      {t('studio.sim.impact')}
                    </p>
                    <h2 className="text-6xl font-black text-white tracking-tighter">98.4%</h2>
                    <p className="text-sm font-medium text-white/90 mt-2">{t('studio.sim.total')}</p>
                  </div>
                  <div className="grid gap-4">
                    <div className="bg-black/20 p-4 rounded border border-white/10 backdrop-blur-sm flex items-center justify-between">
                      <div>
                        <div className="text-white/60 text-[10px] uppercase font-bold mb-1">{t('studio.sim.cycle')}</div>
                        <div className="text-white font-bold text-xl">2.4h <span className="text-sm font-normal text-white/50 line-through ml-2">48h</span></div>
                      </div>
                      <span className="material-symbols-outlined text-white/80">timer_off</span>
                    </div>
                    <div className="bg-black/20 p-4 rounded border border-white/10 backdrop-blur-sm flex items-center justify-between">
                      <div>
                        <div className="text-white/60 text-[10px] uppercase font-bold mb-1">{t('studio.sim.opex')}</div>
                        <div className="text-white font-bold text-xl">$125,000</div>
                      </div>
                      <span className="material-symbols-outlined text-white/80">savings</span>
                    </div>
                  </div>
                  <button className="w-full mt-10 bg-white text-primary font-bold py-4 px-6 rounded hover:bg-gray-100 transition-colors shadow-xl flex items-center justify-center gap-2 text-sm uppercase tracking-wide">
                    <span>{t('studio.sim.download')}</span>
                    <span className="material-symbols-outlined text-lg">download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="bg-[#111111] border-t border-gray-800 py-24 px-6 md:px-10 lg:px-40">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-xs mb-3 block">{t('studio.road.label')}</span>
              <h2 className="text-3xl font-black text-white">{t('studio.road.title')}</h2>
            </div>
            <div className="flex gap-4">
              {phaseTabs.map((phase) => (
                <span key={phase} className="px-4 py-2 rounded bg-[#222] border border-gray-700 text-white text-xs font-bold shadow-sm">{phase}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {roadmapSteps.map((step) => (
              <div key={step.num} className="group">
                <div className="mb-6 flex items-center gap-4">
                  <span className={`flex items-center justify-center w-12 h-12 rounded font-bold text-xl shadow-lg ${step.active ? 'bg-primary text-white shadow-primary/30' : 'bg-[#222] border-2 border-gray-700 text-gray-400 group-hover:border-primary group-hover:text-primary transition-all'}`}>{step.num}</span>
                  <div className="h-px bg-gray-700 flex-1 group-hover:bg-primary transition-colors"></div>
                </div>
                <h4 className="text-lg font-bold text-white mb-3">{step.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">{step.desc}</p>
                <div className="flex gap-2">
                  {step.tags.map((tag) => (
                    <span key={tag} className="bg-gray-800 px-2 py-1 rounded text-[10px] font-bold text-gray-300 uppercase">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 md:px-10 lg:px-40 relative overflow-hidden bg-[#1a1a1a]">
        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <div className="inline-block p-4 rounded-full bg-red-900/20 mb-6">
            <span className="material-symbols-outlined text-4xl text-primary">bolt</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">{t('studio.final.title')}</h2>
          <p className="text-gray-400 text-lg font-medium mb-10 max-w-xl mx-auto">
            {t('studio.final.desc')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="h-14 px-10 rounded bg-primary hover:bg-red-700 text-white font-bold text-sm uppercase tracking-wide transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
              <span>{t('studio.final.cta1')}</span>
            </Link>
            <button className="h-14 px-10 rounded bg-transparent border-2 border-gray-700 hover:border-primary hover:text-primary text-white font-bold text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2">
              <span>{t('studio.final.cta2')}</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
