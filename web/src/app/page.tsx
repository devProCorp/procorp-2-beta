'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const LIA_WEBHOOK = 'https://n8n-n8n.ukq6rz.easypanel.host/webhook/fd095693-99f0-472c-9d03-65426bd3fdb4';

interface ChatMsg { role: 'user' | 'lia'; content: string; }

function getWaId(): string {
  if (typeof window === 'undefined') return '';
  const s = localStorage.getItem('lia_wa_id');
  if (s) return s;
  const id = Date.now().toString() + Math.random().toString(36).slice(2, 8);
  localStorage.setItem('lia_wa_id', id);
  return id;
}

export default function Home() {
  const { t, lang } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const waIdRef = useRef('');
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => { waIdRef.current = getWaId(); }, []);
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [chatMsgs, chatLoading]);

  const sendChat = useCallback(async (text: string) => {
    if (!text.trim() || chatLoading) return;
    const msg = text.trim();
    setChatMsgs(p => [...p, { role: 'user', content: msg }]);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await fetch(LIA_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: { id: Date.now().toString(), content: msg, role: 'user', timestamp: Date.now(), wa_id: waIdRef.current, passaport: waIdRef.current, meta: { uuid: crypto.randomUUID(), ip: '', userAgent: navigator.userAgent, language: navigator.language, platform: navigator.platform, url: window.location.href, referrer: document.referrer, screen: { width: window.screen.width, height: window.screen.height } } } }),
      });
      const data = await res.json();
      const item = Array.isArray(data) ? data[0] : data;
      const reply = typeof item === 'string' ? item : item?.output ?? item?.response ?? item?.message ?? item?.content ?? item?.text ?? String(item);
      setChatMsgs(p => [...p, { role: 'lia', content: reply }]);
    } catch {
      setChatMsgs(p => [...p, { role: 'lia', content: lang === 'es' ? 'Error de conexión. Intenta de nuevo.' : 'Connection error. Try again.' }]);
    } finally { setChatLoading(false); }
  }, [chatLoading, lang]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // PHASE 0: Logo — visible at start, stays, then fades out (~12-18%)
  const logoOpacity = useTransform(scrollYProgress, [0, 0.12, 0.18], [1, 1, 0]);
  const logoY = useTransform(scrollYProgress, [0, 0.12, 0.18], [0, 0, -40]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.10], [1, 0]);

  // PHASE 1: Badge + Title — appears after logo fades, stays, then fades out (~18-40%)
  const phase1Opacity = useTransform(scrollYProgress, [0.18, 0.25, 0.35, 0.40], [0, 1, 1, 0]);
  const phase1Y = useTransform(scrollYProgress, [0.18, 0.25, 0.35, 0.40], [40, 0, 0, -40]);

  // PHASE 2: Description — appears after title fades, stays, then fades out (~45-65%)
  const phase2Opacity = useTransform(scrollYProgress, [0.45, 0.50, 0.60, 0.65], [0, 1, 1, 0]);
  const phase2Y = useTransform(scrollYProgress, [0.45, 0.50, 0.60, 0.65], [40, 0, 0, -40]);

  // PHASE 3: CTAs — appears last, stays visible until section ends (~70-90%)
  const phase3Opacity = useTransform(scrollYProgress, [0.70, 0.75, 0.85, 0.90], [0, 1, 1, 0]);
  const phase3Y = useTransform(scrollYProgress, [0.70, 0.75, 0.85, 0.90], [40, 0, 0, -40]);

  const pillars = [
    { icon: 'balance', title: t('home.pillar1.title'), desc: t('home.pillar1.desc'), href: '/projects' },
    { icon: 'eco', title: t('home.pillar2.title'), desc: t('home.pillar2.desc'), href: '/studio' },
    { icon: 'psychology', title: t('home.pillar3.title'), desc: t('home.pillar3.desc'), href: '/about' },
  ];

  const checklistItems = [
    { key: 'kpi', label: t('home.eco.kpi') },
    { key: 'alerts', label: t('home.eco.alerts') },
    { key: 'projection', label: t('home.eco.projection') },
  ];

  return (
    <main className="min-h-screen bg-background-dark text-white flex flex-col">
      {/* Hero Section - Scroll Animated (same pattern as opcion-daniel ScrollHero) */}
      <section ref={heroRef} className="relative h-[500vh] w-full bg-background-dark">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-background-dark via-surface-dark to-background-dark"></div>
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-background-dark via-background-dark/95 to-background-dark/60"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-full z-[1] hidden lg:block pointer-events-none opacity-40">
            <div className="h-full w-full bg-gradient-to-t from-background-dark to-transparent"></div>
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#CE1026 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'linear-gradient(to left, black, transparent)' }}></div>
          </div>

          {/* PHASE 0: Logo centrado — primera impresión */}
          <motion.div
            style={{ opacity: logoOpacity, y: logoY }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
          >
            <Image
              src="https://www.pro-corp.net/wp-content/uploads/2023/07/Signature_PCP.png"
              alt="Pro Corp"
              width={320}
              height={80}
              className="h-16 md:h-20 w-auto object-contain mb-8"
              priority
            />
            <motion.div
              style={{ opacity: scrollHintOpacity }}
              className="flex flex-col items-center gap-4 mt-4"
            >
              <span className="text-secondary text-sm md:text-base uppercase tracking-[0.3em] font-semibold">
                {t('home.scrollHint')}
              </span>
              <div className="flex flex-col items-center gap-1 animate-bounce">
                <span className="material-symbols-outlined text-primary text-2xl">keyboard_arrow_down</span>
              </div>
            </motion.div>
          </motion.div>

          {/* PHASE 1: Badge + Title */}
          <motion.div
            style={{ opacity: phase1Opacity, y: phase1Y }}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-8"
          >
            <div className="text-center max-w-[900px]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-bold text-primary-light tracking-wide uppercase">{t('home.badge')}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-white uppercase">
                {t('home.title1')}<br />
                <span className="text-primary">{t('home.title2')}</span>
              </h1>
            </div>
          </motion.div>

          {/* PHASE 2: Description */}
          <motion.div
            style={{ opacity: phase2Opacity, y: phase2Y }}
            className="absolute inset-0 z-20 flex items-center pointer-events-none px-8 md:px-16 lg:px-24"
          >
            <div className="w-full md:w-1/2 lg:w-5/12">
              <span className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-6 block">
                {t('home.badge')}
              </span>
              <p className="text-xl md:text-2xl lg:text-3xl font-light text-white/90 leading-relaxed mb-8">
                {t('home.desc')}
              </p>
            </div>
          </motion.div>

          {/* PHASE 3: CTAs */}
          <motion.div
            style={{ opacity: phase3Opacity, y: phase3Y }}
            className="absolute inset-0 z-20 flex items-center justify-center px-8"
          >
            <div className="text-center max-w-[700px]">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white uppercase mb-8">
                {t('home.title1')} <span className="text-primary">{t('home.title2')}</span>
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/projects" className="h-12 px-8 rounded-lg bg-primary hover:bg-primary-light text-white font-bold transition-all shadow-[0_0_20px_rgba(206,16,38,0.5)] hover:shadow-[0_0_30px_rgba(206,16,38,0.7)] flex items-center justify-center gap-2 uppercase text-sm tracking-wide">
                  <span>{t('home.cta1')}</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
                <Link href="/studio" className="h-12 px-8 rounded-lg border border-surface-border bg-surface-dark/50 hover:bg-surface-dark text-white font-medium transition-colors backdrop-blur-sm uppercase text-sm tracking-wide flex items-center justify-center">
                  {t('home.cta2')}
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            style={{ opacity: scrollHintOpacity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none"
          >
            <div className="w-px h-16 bg-gradient-to-b from-white to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="w-full border-y border-surface-border bg-surface-dark/30 backdrop-blur-md">
        <div className="flex flex-wrap justify-around items-center gap-8 px-4 py-8 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-4xl">trending_up</span>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight">{t('home.stat1.value')}</p>
              <p className="text-sm text-secondary uppercase tracking-wide font-semibold">{t('home.stat1.label')}</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-surface-border"></div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-4xl">groups</span>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight">{t('home.stat2.value')}</p>
              <p className="text-sm text-secondary uppercase tracking-wide font-semibold">{t('home.stat2.label')}</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-surface-border"></div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-4xl">gavel</span>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight">{t('home.stat3.value')}</p>
              <p className="text-sm text-secondary uppercase tracking-wide font-semibold">{t('home.stat3.label')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Pillars */}
      <section className="py-24 px-4 md:px-10 bg-background-dark relative">
        <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-surface-border pb-8">
            <div className="flex flex-col gap-3 max-w-[700px]">
              <h2 className="text-primary font-bold tracking-widest uppercase text-sm">{t('home.pillars.label')}</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white uppercase">{t('home.pillars.title')}</h3>
              <p className="text-secondary text-lg">{t('home.pillars.desc')}</p>
            </div>
            <Link href="/projects" className="text-white hover:text-primary transition-colors flex items-center gap-2 font-bold pb-2 uppercase text-sm tracking-wide">
              {t('home.pillars.viewall')}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <Link href={pillar.href} key={pillar.title} className="group relative flex flex-col justify-between h-full p-8 rounded-2xl bg-surface-dark border border-surface-border hover:border-primary/50 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col gap-6">
                  <div className="size-14 rounded-xl bg-background-dark border border-surface-border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_10px_rgba(206,16,38,0.1)]">
                    <span className="material-symbols-outlined text-primary text-3xl">{pillar.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2 uppercase">{pillar.title}</h4>
                    <p className="text-secondary leading-relaxed text-sm">{pillar.desc}</p>
                  </div>
                </div>
                <div className="relative z-10 mt-8 pt-6 border-t border-surface-border/50 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-white tracking-wide">{t('home.learnmore')}</span>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BPA Automation Section */}
      <section className="py-20 px-4 md:px-10 bg-background-dark border-t border-surface-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
        <div className="max-w-[1440px] mx-auto w-full relative z-10 flex flex-col items-center">
          <div className="text-center mb-16 max-w-4xl">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-2 uppercase">
              {t('home.bpa.title1')} <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white">{t('home.bpa.title2')}</span>
            </h2>
            <p className="text-xl md:text-2xl text-secondary mt-6 font-light">
              {t('home.bpa.desc1')} <span className="text-primary font-bold">{t('home.bpa.desc2')}</span> {t('home.bpa.desc3')}
            </p>
            <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full mt-8"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-[1200px]">
            {/* LIA Chat */}
            <div className="lg:col-span-8 bg-surface-dark border border-surface-border rounded-2xl shadow-2xl overflow-hidden hover:border-primary/40 transition-colors duration-300">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-background-dark/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-xs text-primary font-mono font-bold tracking-wider">LIA_BPA_ENGINE // RUNNING</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-secondary hidden sm:inline">ONLINE</span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-surface-border"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-surface-border"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/60"></div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div ref={chatRef} className="relative h-[400px] w-full bg-[#130b0c] px-6 py-5 overflow-y-auto scroll-smooth space-y-4">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#2a1517 1px, transparent 1px), linear-gradient(90deg, #2a1517 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="relative z-10 space-y-4">
                  {chatMsgs.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[340px] gap-4">
                      <div className="w-16 h-16 rounded-full bg-background-dark border-2 border-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(206,16,38,0.2)]">
                        <span className="material-symbols-outlined text-primary text-3xl">neurology</span>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-white uppercase tracking-wide">LIA</p>
                        <p className="text-xs text-secondary mt-1">
                          {lang === 'es' ? 'Habla con LIA, tu asistente de procesos' : 'Talk to LIA, your process assistant'}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center mt-2">
                        {[
                          lang === 'es' ? '¿Qué es BPA?' : 'What is BPA?',
                          lang === 'es' ? '¿Cómo optimizar procesos?' : 'How to optimize processes?',
                        ].map(q => (
                          <button key={q} onClick={() => sendChat(q)} className="px-3 py-1.5 rounded-full border border-surface-border text-xs text-secondary hover:border-primary/50 hover:text-white transition-colors">
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chatMsgs.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'lia' && (
                        <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                          <span className="material-symbols-outlined text-primary text-sm">neurology</span>
                        </div>
                      )}
                      <div className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-white rounded-2xl rounded-br-sm'
                          : 'bg-background-dark/80 border border-surface-border text-gray-300 rounded-2xl rounded-bl-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center mr-2 shrink-0">
                        <span className="material-symbols-outlined text-primary text-sm">neurology</span>
                      </div>
                      <div className="bg-background-dark/80 border border-surface-border px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input */}
              <form onSubmit={(e) => { e.preventDefault(); sendChat(chatInput); }} className="px-5 py-3 border-t border-surface-border bg-background-dark/50">
                <div className="flex items-center gap-3 bg-[#130b0c] border border-surface-border rounded-xl px-4 py-2 focus-within:border-primary/50 transition-colors">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(chatInput); } }}
                    placeholder={lang === 'es' ? 'Escribe a LIA...' : 'Message LIA...'}
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || chatLoading}
                    className="w-8 h-8 rounded-lg bg-primary hover:bg-primary-light flex items-center justify-center transition-colors disabled:opacity-20 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(206,16,38,0.3)]"
                  >
                    <span className="material-symbols-outlined text-white text-sm">arrow_upward</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Side Stats */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-surface-dark border border-surface-border rounded-2xl p-6 shadow-xl hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <span className="material-symbols-outlined text-primary">speed</span>
                  </div>
                  <span className="text-xs font-mono text-green-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 45% vs LY
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">2.4x</h3>
                <p className="text-sm text-secondary uppercase font-semibold">{t('home.bpa.acceleration')}</p>
                <div className="w-full bg-surface-border h-1 mt-4 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-primary-light h-full w-[85%]"></div>
                </div>
              </div>
              <div className="bg-surface-dark border border-surface-border rounded-2xl p-6 shadow-xl hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <span className="material-symbols-outlined text-primary">inventory_2</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">850k+</h3>
                <p className="text-sm text-secondary uppercase font-semibold">{t('home.bpa.assets')}</p>
                <div className="flex gap-1 mt-4 h-8 items-end opacity-80">
                  <div className="w-1/5 bg-primary/20 h-[30%] rounded-t-sm"></div>
                  <div className="w-1/5 bg-primary/40 h-[50%] rounded-t-sm"></div>
                  <div className="w-1/5 bg-primary/60 h-[40%] rounded-t-sm"></div>
                  <div className="w-1/5 bg-primary/80 h-[80%] rounded-t-sm"></div>
                  <div className="w-1/5 bg-primary h-[95%] rounded-t-sm animate-pulse"></div>
                </div>
              </div>
              <div className="bg-surface-dark border border-surface-border rounded-2xl p-6 shadow-xl hover:border-primary/30 transition-all flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">99.9%</h3>
                  <p className="text-sm text-secondary uppercase font-semibold">{t('home.bpa.uptime')}</p>
                </div>
                <div className="relative size-12">
                  <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                    <path className="text-surface-border" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
                    <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="99.9, 100" strokeWidth="4"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* CTA Banner */}
            <div className="lg:col-span-12 flex flex-col md:flex-row gap-6 items-center justify-between bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-2xl p-8 mt-4">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">auto_mode</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white uppercase">{t('home.bpa.transform')}</h4>
                  <p className="text-sm text-secondary">{t('home.bpa.transform.desc')}</p>
                </div>
              </div>
              <Link href="/contact" className="w-full md:w-auto bg-primary hover:bg-primary-light text-white font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(206,16,38,0.4)] hover:shadow-[0_0_30px_rgba(206,16,38,0.6)] transition-all transform hover:-translate-y-1 text-sm uppercase tracking-wide flex items-center justify-center gap-2">
                <span>{t('home.bpa.demo')}</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="py-20 px-4 md:px-10 bg-[#150a0b] border-y border-surface-border relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#CE1026 1px, transparent 1px), linear-gradient(90deg, #CE1026 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-dark border border-surface-border w-fit">
              <span className="material-symbols-outlined text-primary text-sm">hub</span>
              <span className="text-xs font-bold text-white tracking-wide uppercase">{t('home.eco.badge')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight uppercase">
              {t('home.eco.title1')} <br />
              <span className="text-primary">{t('home.eco.title2')}</span>
            </h2>
            <p className="text-secondary text-lg leading-relaxed">
              {t('home.eco.desc')}
            </p>
            <ul className="flex flex-col gap-4 mt-4">
              {checklistItems.map((item) => (
                <li key={item.key} className="flex items-center gap-3">
                  <span className="flex items-center justify-center size-6 rounded-full bg-primary/20 text-primary">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </span>
                  <span className="text-secondary font-semibold">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative rounded-xl border border-surface-border bg-surface-dark p-6 shadow-2xl">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl -z-10 rounded-full"></div>
            <div className="flex items-center justify-between border-b border-surface-border pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-500"></div>
                <div className="size-3 rounded-full bg-yellow-500"></div>
                <div className="size-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-xs text-gray-500 font-mono">ProCorp_OS_v2.0</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 bg-background-dark/50 rounded-lg p-4 border border-surface-border/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-secondary font-bold uppercase">{t('home.eco.performance')}</span>
                  <span className="text-xs text-primary font-bold">+12.4%</span>
                </div>
                <div className="h-24 w-full flex items-end justify-between gap-1">
                  {[40, 60, 30, 70, 50, 80, 90].map((h, i) => (
                    <div key={i} className={`w-full rounded-t-sm ${i === 6 ? 'bg-primary shadow-[0_0_10px_rgba(206,16,38,0.5)]' : `bg-primary/${(i + 2) * 10}`}`} style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
              <div className="bg-background-dark/50 rounded-lg p-4 border border-surface-border/50">
                <div className="text-xs text-secondary font-bold uppercase mb-2">{t('home.eco.legalrisk')}</div>
                <div className="relative size-24 mx-auto rounded-full border-4 border-surface-border flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent border-l-transparent rotate-45"></div>
                  <span className="text-lg font-bold text-white">Low</span>
                </div>
              </div>
              <div className="bg-background-dark/50 rounded-lg p-4 border border-surface-border/50 flex flex-col justify-center gap-2">
                <div className="text-xs text-secondary font-bold uppercase">{t('home.eco.resources')}</div>
                <div className="w-full bg-surface-border h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[75%]"></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>{t('home.eco.used')}</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-surface-border h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-white h-full w-[45%]"></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>{t('home.eco.available')}</span>
                  <span>45%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-background-dark border-t border-surface-border">
        <div className="max-w-[960px] mx-auto flex flex-col items-center text-center gap-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white uppercase">{t('home.cta.title')}</h2>
          <p className="text-xl text-secondary max-w-2xl font-medium">{t('home.cta.desc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/contact" className="h-12 px-8 rounded-lg bg-primary hover:bg-primary-light text-white font-bold transition-all w-full sm:w-auto uppercase tracking-wide flex items-center justify-center">
              {t('home.cta.button')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
