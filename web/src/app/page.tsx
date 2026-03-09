'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import WorkflowAnimation from '@/components/home/WorkflowAnimation';
import NeuralNetwork from '@/components/home/NeuralNetwork';

const LIA_WEBHOOK = 'https://n8n-n8n.ukq6rz.easypanel.host/webhook/75ad02de-9eff-41c0-a422-c7b11adfa8fa';

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

  // Mouse tracking for 3D Tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      mouseX.set(window.innerWidth / 2);
      mouseY.set(window.innerHeight / 2);
    }
  }, [mouseX, mouseY]);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const tiltX = useTransform(smoothMouseY, [0, 1000], [15, -15]);
  const tiltY = useTransform(smoothMouseX, [0, 1920], [-15, 15]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // PHASE 0: Logo — visible at start, fades out quickly
  const logoOpacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const logoY = useTransform(scrollYProgress, [0, 0.15, 0.25], [0, 0, -40]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // PHASE 1: Badge + Title
  const phase1Opacity = useTransform(scrollYProgress, [0.25, 0.32, 0.48, 0.55], [0, 1, 1, 0]);
  const phase1Y = useTransform(scrollYProgress, [0.25, 0.32, 0.48, 0.55], [40, 0, 0, -40]);

  // PHASE 2: Description
  const phase2Opacity = useTransform(scrollYProgress, [0.55, 0.62, 0.75, 0.82], [0, 1, 1, 0]);
  const phase2Y = useTransform(scrollYProgress, [0.55, 0.62, 0.75, 0.82], [40, 0, 0, -40]);

  // PHASE 3: CTAs
  const phase3Opacity = useTransform(scrollYProgress, [0.82, 0.87, 0.93, 0.98], [0, 1, 1, 0]);
  const phase3Y = useTransform(scrollYProgress, [0.82, 0.87, 0.93, 0.98], [40, 0, 0, -40]);

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
      {/* Hero Section - Scroll Animated */}
      <section ref={heroRef} onMouseMove={handleMouseMove} className="relative h-[400vh] w-full bg-background-dark">
        <div className="sticky top-0 h-screen w-full overflow-hidden perspective-[1200px]">
          {/* Neural Network Effect */}
          <NeuralNetwork />

          {/* Background Elements */}
          <div className="absolute inset-0 z-0 bg-background-dark">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--surface-dark)_0%,_transparent_100%)] opacity-80"></div>
          </div>
          <div className="absolute inset-0 z-[1] bg-gradient-to-br from-primary/5 via-transparent to-surface-dark/50"></div>

          {/* Glowing Orbs for premium SaaS feel */}
          <div className="absolute top-0 left-0 w-full h-full z-[1] pointer-events-none overflow-hidden">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] mix-blend-screen opacity-50"></div>
            <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-primary-dark/20 blur-[120px] mix-blend-screen opacity-40"></div>
          </div>

          <div className="absolute bottom-0 right-0 w-[40%] h-full z-[1] hidden lg:block pointer-events-none opacity-30">
            <div className="h-full w-full bg-gradient-to-t from-background-dark to-transparent absolute z-10"></div>
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#CE1026 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'linear-gradient(to left, black, transparent)' }}></div>
          </div>

          {/* PHASE 0: Logo centrado */}
          <motion.div
            style={{ opacity: logoOpacity, y: logoY }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
          >
            <Image
              src="https://www.pro-corp.net/wp-content/uploads/2023/07/Signature_PCP.png"
              alt="Pro Corp"
              width={320}
              height={80}
              className="h-16 md:h-20 w-auto object-contain mb-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              priority
            />
            <motion.div
              style={{ opacity: scrollHintOpacity }}
              className="flex flex-col items-center gap-4 mt-6"
            >
              <span className="text-secondary text-xs uppercase tracking-[0.4em] font-medium">
                {t('home.scrollHint')}
              </span>
              <div className="flex flex-col items-center gap-1 animate-bounce">
                <span className="material-symbols-outlined text-primary text-2xl drop-shadow-[0_0_8px_rgba(206,16,38,0.5)]">keyboard_arrow_down</span>
              </div>
            </motion.div>
          </motion.div>

          {/* PHASE 1: Badge + Title + Tagline */}
          <motion.div
            style={{
              opacity: phase1Opacity,
              y: phase1Y,
              rotateX: tiltX,
              rotateY: tiltY,
              transformStyle: "preserve-3d"
            }}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-4 md:px-8"
          >
            <div className="text-center max-w-[1000px] flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-darker/60 border border-surface-border mb-8 shadow-lg backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#CE1026]"></span>
                <span className="text-[10px] md:text-xs font-bold text-gray-300 tracking-[0.2em] uppercase">{t('home.badge')}</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[1.05] tracking-tight text-white uppercase drop-shadow-2xl">
                {t('home.title1')}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light drop-shadow-[0_0_30px_rgba(206,16,38,0.3)]">{t('home.title2')}</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl lg:text-2xl text-secondary font-light max-w-[800px] mx-auto leading-relaxed">
                {t('home.tagline')}
              </p>
            </div>
          </motion.div>

          {/* PHASE 2: Description */}
          <motion.div
            style={{
              opacity: phase2Opacity,
              y: phase2Y,
              rotateX: tiltX,
              rotateY: tiltY,
              transformStyle: "preserve-3d"
            }}
            className="absolute inset-0 z-20 flex items-center pointer-events-none px-6 md:px-16 lg:px-24"
          >
            <div className="w-full md:w-3/5 lg:w-1/2 glass-panel p-10 md:p-14 rounded-[2rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-[60px] rounded-full pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none"></div>

              <div className="relative z-10 block mb-8">
                <span className="inline-flex items-center gap-3 text-primary text-xs font-bold uppercase tracking-[0.3em]">
                  <span className="w-8 h-[2px] bg-gradient-to-r from-primary to-transparent rounded-full"></span>
                  {t('home.badge')}
                </span>
              </div>
              <p className="relative z-10 text-2xl md:text-3xl lg:text-4xl font-light text-white/95 leading-snug tracking-tight">
                {t('home.desc')}
              </p>
            </div>
          </motion.div>

          {/* PHASE 3: CTAs */}
          <motion.div
            style={{
              opacity: phase3Opacity,
              y: phase3Y,
              rotateX: tiltX,
              rotateY: tiltY,
              transformStyle: "preserve-3d"
            }}
            className="absolute inset-0 z-20 flex items-center justify-center px-6 pointer-events-none"
          >
            <div className="text-center max-w-[800px] glass-panel p-12 md:p-20 rounded-[2.5rem] w-full relative overflow-hidden border-surface-border/80 shadow-2xl">
              <div className="absolute -inset-[50%] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,rgba(206,16,38,0.15)_100%)] blur-2xl rounded-full animate-[spin_8s_linear_infinite] pointer-events-none"></div>
              <div className="absolute inset-0 bg-background-dark/40 backdrop-blur-[2px]"></div>

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white uppercase mb-10 tracking-tight">
                  {t('home.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light drop-shadow-[0_0_20px_rgba(206,16,38,0.4)]">{t('home.title2')}</span>
                </h2>
                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                  <Link href="/projects" className="pointer-events-auto h-14 px-10 rounded-xl bg-primary text-white font-bold transition-all glow-primary glow-primary-hover flex items-center justify-center gap-3 uppercase text-sm tracking-widest group border border-primary-light/50">
                    <span>{t('home.cta1')}</span>
                    <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
                  <Link href="/studio" className="pointer-events-auto h-14 px-10 rounded-xl bg-surface-dark/50 border border-surface-border/80 hover:bg-surface-border hover:border-gray-500/30 text-white font-medium transition-all backdrop-blur-md uppercase text-sm tracking-widest flex items-center justify-center group">
                    <span>{t('home.cta2')}</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator Bottom */}
          <motion.div
            style={{ opacity: scrollHintOpacity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none"
          >
            <div className="w-px h-20 bg-gradient-to-b from-white/50 to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* Strategic Pillars */}
      <section className="px-4 md:px-10 bg-background-dark relative pt-12 pb-24">
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
              <Link href={pillar.href} key={pillar.title} className="group relative flex flex-col justify-between h-full p-8 rounded-[2rem] glass-panel glass-panel-hover overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-[40px] rounded-full group-hover:bg-primary/20 transition-colors duration-500"></div>

                <div className="relative z-10 flex flex-col gap-6">
                  <div className="size-14 rounded-xl bg-surface-darker/80 border border-surface-border flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 shadow-[0_0_15px_rgba(206,16,38,0.05)] group-hover:shadow-[0_0_20px_rgba(206,16,38,0.2)]">
                    <span className="material-symbols-outlined text-primary text-3xl group-hover:text-white transition-colors">{pillar.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-3 uppercase tracking-wide group-hover:text-primary-light transition-colors">{pillar.title}</h4>
                    <p className="text-gray-400 leading-relaxed text-sm font-light">{pillar.desc}</p>
                  </div>
                </div>
                <div className="relative z-10 mt-8 pt-6 border-t border-surface-border flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-gray-300 tracking-[0.2em] group-hover:text-white transition-colors">{t('home.learnmore')}</span>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform duration-300">arrow_right_alt</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Animation */}
      <section className="py-20 px-4 md:px-10 bg-background-dark border-t border-surface-border">
        <div className="max-w-[1100px] mx-auto flex flex-col gap-10">
          <div className="text-center">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">{t('home.workflow.label')}</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-white uppercase">{t('home.workflow.title')}</h3>
            <p className="text-secondary text-lg mt-4 max-w-2xl mx-auto">{t('home.workflow.desc')}</p>
          </div>
          <WorkflowAnimation />
        </div>
      </section>

      {/* LIA Section */}
      <section className="py-20 px-4 md:px-10 bg-background-dark border-t border-surface-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none blur-3xl"></div>
        <div className="max-w-[1440px] mx-auto w-full relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-4 uppercase drop-shadow-lg">
              {t('home.lia.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{t('home.lia.title2')}</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mt-6 font-light max-w-3xl mx-auto leading-relaxed">
              {t('home.lia.desc1')} <span className="text-white font-semibold">{t('home.lia.desc2')}</span> {t('home.lia.desc3')}
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary-light to-transparent mx-auto rounded-full mt-10 opacity-50"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-[1200px] mx-auto rounded-[2.5rem] border border-primary/40 p-4 md:p-6 bg-surface-dark/20 backdrop-blur-sm shadow-[0_0_60px_rgba(206,16,38,0.15),0_0_120px_rgba(206,16,38,0.05)]">
            {/* LIA Chat */}
            <div className="lg:col-span-7 glass-panel rounded-[2rem] overflow-hidden flex flex-col relative z-20 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-b from-surface-dark/80 to-background-dark/95 backdrop-blur-2xl -z-10"></div>

              <div className="flex items-center gap-3 px-6 py-4 border-b border-surface-border/60 bg-white/[0.02]">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-[#FF5F56] shadow-[0_0_8px_rgba(255,95,86,0.5)]"></div>
                  <div className="size-3 rounded-full bg-[#FFBD2E] shadow-[0_0_8px_rgba(255,189,46,0.5)]"></div>
                  <div className="size-3 rounded-full bg-[#27C93F] shadow-[0_0_8px_rgba(39,201,63,0.5)]"></div>
                </div>
                <div className="mx-auto bg-surface-darker/60 px-4 py-1 rounded-full border border-surface-border shadow-inner flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_rgba(39,201,63,0.8)]"></span>
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest leading-none">LIA_Agent_Core</span>
                </div>
                <div className="w-[52px]"></div>
              </div>

              <div ref={chatRef} className="px-6 py-8 h-[380px] overflow-y-auto scroll-smooth space-y-6">
                {chatMsgs.length === 0 && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="size-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary-dark/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(206,16,38,0.15)]">
                        <span className="material-symbols-outlined text-primary-light text-xl">smart_toy</span>
                      </div>
                      <div className="glass-panel p-4 rounded-2xl rounded-tl-sm max-w-[85%] shadow-lg">
                        <p className="text-[13px] text-gray-200 leading-relaxed font-light">
                          {lang === 'es' ? 'Hola, soy LIA. Tu copiloto de inteligencia artificial para orquestación empresarial. ¿En qué puedo ayudarte hoy?' : 'Hi, I\'m LIA. Your AI copilot for enterprise orchestration. How can I help you today?'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2.5 pl-[3.25rem]">
                      {[
                        lang === 'es' ? 'Analizar eficiencia del proceso actual' : 'Analyze current process efficiency',
                        lang === 'es' ? 'Generar reporte de automatizaciones' : 'Generate automation report',
                        lang === 'es' ? '¿Cómo integra LIA los sistemas ERP?' : 'How does LIA integrate with ERPs?',
                      ].map(q => (
                        <button key={q} onClick={() => sendChat(q)} className="px-4 py-2 rounded-full glass-panel glass-panel-hover text-[11px] text-gray-300 transition-colors uppercase tracking-wider font-medium text-left">
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {chatMsgs.map((msg, i) => (
                  <div key={i} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg border ${msg.role === 'user'
                      ? 'bg-surface-darker border-surface-border'
                      : 'bg-gradient-to-br from-primary/30 to-primary-dark/10 border-primary/20 shadow-[0_0_15px_rgba(206,16,38,0.15)]'
                      }`}>
                      <span className={`material-symbols-outlined text-lg ${msg.role === 'user' ? 'text-gray-400' : 'text-primary-light'}`}>
                        {msg.role === 'user' ? 'person' : 'smart_toy'}
                      </span>
                    </div>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-lg font-light ${msg.role === 'user'
                      ? 'bg-primary/20 border border-primary/30 text-white rounded-tr-sm backdrop-blur-md'
                      : 'glass-panel text-gray-200 rounded-tl-sm'
                      }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary-dark/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(206,16,38,0.15)]">
                      <span className="material-symbols-outlined text-primary-light text-xl">smart_toy</span>
                    </div>
                    <div className="glass-panel p-4 rounded-2xl rounded-tl-sm flex items-center gap-2 h-[50px]">
                      <div className="w-2 h-2 rounded-full bg-primary-light/80 animate-bounce shadow-[0_0_8px_#CE1026]" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary-light/80 animate-bounce shadow-[0_0_8px_#CE1026]" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary-light/80 animate-bounce shadow-[0_0_8px_#CE1026]" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); sendChat(chatInput); }} className="px-6 py-4 border-t border-surface-border relative bg-white/[0.01]">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(chatInput); } }}
                  placeholder={lang === 'es' ? 'Escribe un mensaje...' : 'Type a message...'}
                  aria-label={lang === 'es' ? 'Escribe un mensaje a LIA' : 'Type a message to LIA'}
                  className="w-full bg-surface-darker/50 border border-surface-border/80 rounded-xl py-4 px-5 text-sm text-white focus:outline-none focus:border-primary/60 focus:bg-surface-dark/80 transition-all font-light placeholder:text-gray-500 shadow-inner"
                />
                <button type="submit" disabled={!chatInput.trim() || chatLoading} aria-label={lang === 'es' ? 'Enviar mensaje' : 'Send message'} className="absolute right-9 top-1/2 -translate-y-1/2 text-primary hover:text-primary-light disabled:opacity-30 disabled:hover:text-primary transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </form>
            </div>

            {/* Side Stats */}
            <div className="lg:col-span-5 flex flex-col gap-6 relative z-10">
              <div className="glass-panel glass-panel-hover rounded-[2rem] p-10 text-center relative overflow-hidden flex-1 flex flex-col justify-center">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[50px] rounded-full pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 blur-[50px] rounded-full pointer-events-none"></div>

                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em] mb-3">{t('home.lia.precision')}</p>
                <h3 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-2 drop-shadow-sm">
                  98<span className="text-primary">%</span>
                </h3>
                <div className="w-full bg-surface-darker/80 h-2 rounded-full overflow-hidden mb-12 border border-surface-border">
                  <div className="bg-gradient-to-r from-primary-dark via-primary to-primary-light h-full w-[98%] shadow-[0_0_15px_rgba(206,16,38,0.8)] rounded-full relative">
                    <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-l from-white/30 to-transparent"></div>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em] mb-3">{t('home.lia.time')}</p>
                <h3 className="text-6xl font-extrabold text-white mb-6">
                  450<span className="text-2xl text-secondary ml-1 font-light tracking-normal lowercase">hrs</span>
                </h3>

                <div className="flex gap-2 items-end h-12 justify-center mt-2 group">
                  <div className="w-3 rounded-t-sm bg-primary/20 h-5 group-hover:h-6 transition-all duration-300"></div>
                  <div className="w-3 rounded-t-sm bg-primary/40 h-7 group-hover:h-9 transition-all duration-300 delay-75"></div>
                  <div className="w-3 rounded-t-sm bg-primary/60 h-9 group-hover:h-11 transition-all duration-300 delay-100"></div>
                  <div className="w-3 rounded-t-sm bg-primary/80 h-7 group-hover:h-9 transition-all duration-300 delay-150"></div>
                  <div className="w-3 rounded-t-sm bg-primary h-12 group-hover:h-[3.25rem] shadow-[0_0_15px_rgba(206,16,38,0.6)] transition-all duration-300 delay-200"></div>
                </div>
              </div>
              <Link href="/contact" className="w-full bg-primary hover:bg-primary-light text-white font-bold py-5 rounded-[1.5rem] glow-primary glow-primary-hover transition-all uppercase tracking-widest text-sm text-center flex items-center justify-center gap-2 group border border-primary-light/50">
                {t('home.lia.demo')}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>

            {/* Bottom CTA inside border */}
            <div className="lg:col-span-12 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 pb-2">
              <Link href="/about" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-white transition-colors font-medium group">
                <span className="material-symbols-outlined text-[18px] text-primary">info</span>
                {t('home.lia.more')}
                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </Link>
              <span className="hidden sm:block text-surface-border">·</span>
              <button onClick={() => { const el = document.querySelector<HTMLInputElement>('[aria-label*="LIA"], [aria-label*="mensaje"]'); el?.focus(); }} className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-light transition-colors font-semibold group cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">chat</span>
                {t('home.lia.ask')}
                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="py-24 px-4 md:px-10 bg-transparent border-y border-surface-border relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#CE1026 1px, transparent 1px), linear-gradient(90deg, #CE1026 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel w-fit border border-primary/20">
              <span className="material-symbols-outlined text-primary text-sm">hub</span>
              <span className="text-[10px] font-bold text-white tracking-[0.2em] uppercase">{t('home.eco.badge')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight uppercase tracking-tight drop-shadow-lg">
              {t('home.eco.title1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{t('home.eco.title2')}</span>
            </h2>
            <p className="text-gray-300 text-xl leading-relaxed font-light">
              {t('home.eco.desc')}
            </p>
            <ul className="flex flex-col gap-5 mt-4">
              {checklistItems.map((item) => (
                <li key={item.key} className="flex items-center gap-4 bg-surface-darker/30 p-4 rounded-2xl border border-surface-border/50 hover:border-primary/30 transition-colors">
                  <span className="flex items-center justify-center size-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 text-primary-light shadow-[0_0_10px_rgba(206,16,38,0.2)]">
                    <span className="material-symbols-outlined text-[1rem]">check</span>
                  </span>
                  <span className="text-white font-medium">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative rounded-[2rem] border border-surface-border/60 glass-panel p-6 shadow-2xl group">
            <div className="absolute -inset-10 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 blur-[80px] -z-10 rounded-full group-hover:from-primary/30 transition-colors duration-700"></div>

            <div className="flex items-center justify-between border-b border-surface-border/50 pb-5 mb-6">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-[#FF5F56] shadow-[0_0_8px_rgba(255,95,86,0.5)]"></div>
                <div className="size-3 rounded-full bg-[#FFBD2E] shadow-[0_0_8px_rgba(255,189,46,0.5)]"></div>
                <div className="size-3 rounded-full bg-[#27C93F] shadow-[0_0_8px_rgba(39,201,63,0.5)]"></div>
              </div>
              <div className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">ProCorp_OS_v2.0</div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 bg-background-dark/60 rounded-2xl p-6 border border-surface-border/50 shadow-inner">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('home.eco.performance')}</span>
                  <span className="text-xs text-primary-light font-bold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">+12.4%</span>
                </div>
                <div className="h-28 w-full flex items-end justify-between gap-1.5 group-hover:gap-2 transition-all duration-500">
                  {[40, 60, 30, 70, 50, 80, 95].map((h, i) => (
                    <div key={i} className={`w-full rounded-t-sm transition-all duration-700 ${i === 6 ? 'bg-gradient-to-t from-primary-dark to-primary-light shadow-[0_0_15px_rgba(206,16,38,0.6)] group-hover:shadow-[0_0_25px_rgba(206,16,38,0.8)]' : 'bg-surface-border hover:bg-gray-600'}`} style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>

              <div className="bg-background-dark/60 rounded-2xl p-6 border border-surface-border/50 shadow-inner flex flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 blur-[20px] rounded-full"></div>
                <div className="text-[10px] text-gray-400 font-bold uppercase mb-4 tracking-widest">{t('home.eco.legalrisk')}</div>
                <div className="relative size-24 mx-auto rounded-full border-[6px] border-surface-border flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-[6px] border-green-500 border-t-transparent border-l-transparent rotate-45 shadow-[0_0_15px_rgba(39,201,63,0.2)]"></div>
                  <span className="text-xl font-bold text-white tracking-widest">LOW</span>
                </div>
              </div>

              <div className="bg-background-dark/60 rounded-2xl p-6 border border-surface-border/50 shadow-inner flex flex-col justify-center gap-4">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('home.eco.resources')}</div>

                <div>
                  <div className="flex justify-between text-[10px] text-gray-400 mb-2">
                    <span className="uppercase tracking-widest">{t('home.eco.used')}</span>
                    <span className="text-white font-bold">75%</span>
                  </div>
                  <div className="w-full bg-surface-border h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-primary-dark to-primary h-full w-[75%] shadow-[0_0_10px_rgba(206,16,38,0.5)]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-gray-400 mb-2">
                    <span className="uppercase tracking-widest">{t('home.eco.available')}</span>
                    <span className="text-white font-bold">45%</span>
                  </div>
                  <div className="w-full bg-surface-border h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full w-[45%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-24 px-4 md:px-10 bg-background-dark relative border-t border-surface-border overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,_var(--surface-dark)_0%,_transparent_100%)] opacity-80"></div>
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-6">{t('home.howwework.label')}</h2>
            <h3 className="text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight">{t('home.howwework.title')}</h3>
            <p className="text-gray-400 text-xl mt-6 max-w-2xl mx-auto font-light leading-relaxed">{t('home.howwework.desc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', icon: 'search', titleKey: 'home.howwework.step1.title', descKey: 'home.howwework.step1.desc' },
              { num: '02', icon: 'architecture', titleKey: 'home.howwework.step2.title', descKey: 'home.howwework.step2.desc' },
              { num: '03', icon: 'rocket_launch', titleKey: 'home.howwework.step3.title', descKey: 'home.howwework.step3.desc' },
            ].map((step, i) => (
              <div key={step.num} className="relative group">
                {i < 2 && (
                  <div className="hidden md:block absolute top-[4.5rem] left-[calc(100%+1rem)] w-[calc(100%-2rem)] h-px bg-gradient-to-r from-surface-border via-primary/30 to-surface-border z-0">
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/50 text-sm">arrow_forward_ios</span>
                  </div>
                )}
                <div className="relative z-10 flex flex-col items-center text-center p-10 rounded-[2rem] glass-panel glass-panel-hover group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full group-hover:bg-primary/20 transition-colors duration-500"></div>
                  <div className="size-20 rounded-2xl bg-surface-darker/80 border border-surface-border flex items-center justify-center mb-8 group-hover:bg-primary/10 transition-colors duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(206,16,38,0.2)]">
                    <span className="material-symbols-outlined text-primary text-3xl group-hover:text-primary-light transition-colors">{step.icon}</span>
                  </div>
                  <span className="text-primary-light text-[10px] font-bold uppercase tracking-[0.2em] mb-4">{t('home.howwework.label')} {step.num}</span>
                  <h4 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide group-hover:text-white transition-colors">{t(step.titleKey)}</h4>
                  <p className="text-gray-400 text-[15px] leading-relaxed font-light">{t(step.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 bg-background-dark border-t border-surface-border relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0"></div>
        <div className="max-w-[960px] mx-auto flex flex-col items-center text-center gap-10 relative z-10 glass-panel p-16 md:p-24 rounded-[3rem] shadow-2xl">
          <h2 className="text-5xl md:text-7xl font-extrabold text-white uppercase tracking-tight drop-shadow-xl leading-[1.1]">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl font-light leading-relaxed">
            {t('home.cta.desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mt-4">
            <Link href="/contact" className="h-16 px-12 rounded-xl bg-primary hover:bg-primary-light text-white font-bold transition-all glow-primary glow-primary-hover w-full sm:w-auto uppercase tracking-widest flex items-center justify-center gap-4 text-sm group border border-primary-light/50">
              {t('home.cta.button')}
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
