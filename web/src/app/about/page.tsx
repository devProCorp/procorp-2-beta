'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Beliefs } from '@/components/manifesto/StorySections';
import ProCorpStory from '@/components/about/ProCorpStory';

export default function About() {
  const { t } = useLanguage();

  const bpaSteps = [
    { num: 1, icon: 'travel_explore', title: t('about.step1'), desc: t('about.step1.desc') },
    { num: 2, icon: 'schema', title: t('about.step2'), desc: t('about.step2.desc') },
    { num: 3, icon: 'science', title: t('about.step3'), desc: t('about.step3.desc') },
    { num: 4, icon: 'design_services', title: t('about.step4'), desc: t('about.step4.desc') },
    { num: 5, icon: 'precision_manufacturing', title: t('about.step5'), desc: t('about.step5.desc') },
    { num: 6, icon: 'construction', title: t('about.step6'), desc: t('about.step6.desc') },
    { num: 7, icon: 'monitoring', title: t('about.step7'), desc: t('about.step7.desc') },
    { num: 8, icon: 'psychology', title: t('about.step8'), desc: t('about.step8.desc') },
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
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
