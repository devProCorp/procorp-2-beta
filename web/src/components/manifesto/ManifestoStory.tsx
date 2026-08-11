'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import StoryNetwork from './StoryNetwork';

/**
 * Hero narrativo — el manifiesto en 5 actos.
 * Auto-rueda al cargar (~4s por acto, pausable); en cuanto el usuario hace
 * scroll, el scroll toma el control (sección pineada). Skip siempre visible.
 * Con prefers-reduced-motion: tesis estática.
 */

type Lang = 'en' | 'es' | 'pt';

const COPY: Record<Lang, {
  kicker: string;
  acts: { pre?: string; main: string; sub?: string; punch?: string }[];
  thesisLines: string[];
  cta: string;
  skip: string;
  scrollHint: string;
}> = {
  en: {
    kicker: 'Business Engineering',
    acts: [
      { main: 'Businesses are living systems.', sub: 'People. Capital. Processes. Decisions. Constantly interacting. Constantly changing.' },
      { main: 'The numbers were accurate. The analysis was correct.', punch: 'The window for action was gone.' },
      { pre: 'IMAGINE IF…', main: '…you could see next quarter before committing to it.' },
      { main: 'We make alternative futures visible.' },
      { main: 'WE ENGINEER BUSINESSES.' },
    ],
    thesisLines: [
      'Technology is the instrument.',
      'AI is the accelerator.',
      'Simulation is understanding.',
      'Execution is the differentiator.',
    ],
    cta: 'Imagine if — start the conversation',
    skip: 'Skip',
    scrollHint: 'Scroll to continue the story',
  },
  es: {
    kicker: 'Business Engineering',
    acts: [
      { main: 'Los negocios son sistemas vivos.', sub: 'Personas. Capital. Procesos. Decisiones. En interacción constante. En cambio constante.' },
      { main: 'Las cifras eran exactas. El análisis era correcto.', punch: 'La ventana para actuar ya había pasado.' },
      { pre: 'IMAGINA SI…', main: '…pudieras ver el próximo trimestre antes de comprometerte con él.' },
      { main: 'Hacemos visibles los futuros alternativos.' },
      { main: 'HACEMOS INGENIERÍA DE NEGOCIOS.' },
    ],
    thesisLines: [
      'La tecnología es el instrumento.',
      'La IA es el acelerador.',
      'La simulación es entendimiento.',
      'La ejecución es el diferenciador.',
    ],
    cta: 'Imagina si — empecemos la conversación',
    skip: 'Saltar',
    scrollHint: 'Haz scroll para continuar la historia',
  },
  pt: {
    kicker: 'Business Engineering',
    acts: [
      { main: 'Os negócios são sistemas vivos.', sub: 'Pessoas. Capital. Processos. Decisões. Em interação constante. Em mudança constante.' },
      { main: 'Os números eram exatos. A análise estava correta.', punch: 'A janela para agir já tinha passado.' },
      { pre: 'IMAGINE SE…', main: '…você pudesse ver o próximo trimestre antes de se comprometer com ele.' },
      { main: 'Tornamos visíveis os futuros alternativos.' },
      { main: 'FAZEMOS ENGENHARIA DE NEGÓCIOS.' },
    ],
    thesisLines: [
      'A tecnologia é o instrumento.',
      'A IA é o acelerador.',
      'A simulação é entendimento.',
      'A execução é o diferencial.',
    ],
    cta: 'Imagine se — comece a conversa',
    skip: 'Pular',
    scrollHint: 'Role para continuar a história',
  },
};

const ACT_SECONDS = 4.2;

export default function ManifestoStory() {
  const { lang } = useLanguage();
  const c = COPY[(lang as Lang) in COPY ? (lang as Lang) : 'en'];

  const containerRef = useRef<HTMLDivElement>(null);
  const [act, setAct] = useState(0);
  const [auto, setAuto] = useState(true);
  const [reduced, setReduced] = useState(false);
  const phase = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  // El scroll toma el control al primer gesto real
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.004 && auto) setAuto(false);
    if (!auto) {
      const p = v * 4;
      phase.set(p);
      setAct(Math.min(4, Math.round(p)));
    }
  });

  // Modo auto: la película se rueda sola
  useEffect(() => {
    if (!auto || reduced) return;
    if (act >= 4) return;
    const id = setTimeout(() => {
      const next = act + 1;
      setAct(next);
      animate(phase, next, { duration: 1.4, ease: 'easeInOut' });
    }, ACT_SECONDS * 1000);
    return () => clearTimeout(id);
  }, [auto, act, reduced, phase]);

  const goTo = useCallback(
    (i: number) => {
      if (auto) {
        setAct(i);
        animate(phase, i, { duration: 1.0, ease: 'easeInOut' });
      } else {
        const el = containerRef.current;
        if (!el) return;
        const top = el.offsetTop + (el.offsetHeight - window.innerHeight) * (i / 4);
        window.scrollTo({ top, behavior: 'smooth' });
      }
    },
    [auto, phase],
  );

  const skip = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    window.scrollTo({ top: el.offsetTop + el.offsetHeight - window.innerHeight * 0.92, behavior: 'smooth' });
    setAuto(false);
    setAct(4);
    phase.set(4);
  }, [phase]);

  // Accesible: tesis estática, sin película
  if (reduced) {
    return (
      <section className="relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden bg-background-dark px-6 text-center">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.4em] text-primary">{c.kicker}</p>
        <h1 className="max-w-4xl font-display text-4xl font-extrabold text-white md:text-6xl">{c.acts[4].main}</h1>
        <div className="mt-8 space-y-1 text-sm text-gray-400">
          {c.thesisLines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
        <Link href="/contact" className="mt-10 rounded-lg bg-primary px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary-light">
          {c.cta}
        </Link>
      </section>
    );
  }

  const a = c.acts[act];

  return (
    <div ref={containerRef} className="relative h-[480vh] bg-background-dark">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <StoryNetwork phase={phase} />

        {/* H1 de categoría — ancla fija */}
        <div className="pointer-events-none absolute left-6 top-20 z-20 md:left-12">
          <h1 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.4em] text-white/80">
            <span className="inline-block h-2 w-2 rounded-full bg-primary" />
            {c.kicker}
          </h1>
        </div>

        {/* Skip */}
        <button
          type="button"
          onClick={skip}
          className="absolute right-6 top-20 z-20 rounded-lg border border-white/15 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/60 transition-colors hover:border-primary/60 hover:text-white md:right-12"
        >
          {c.skip} →
        </button>

        {/* Texto del acto */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={act}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -22 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="max-w-4xl text-center"
            >
              {a.pre && (
                <p className="mb-4 text-sm font-bold uppercase tracking-[0.45em] text-primary md:text-base">{a.pre}</p>
              )}
              <h2
                className={`font-display font-extrabold leading-[1.06] text-white ${
                  act === 4 ? 'text-4xl md:text-7xl' : 'text-3xl md:text-6xl'
                }`}
              >
                {a.main}
              </h2>
              {a.sub && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="mx-auto mt-6 max-w-2xl text-base text-gray-400 md:text-lg"
                >
                  {a.sub}
                </motion.p>
              )}
              {a.punch && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3, duration: 0.7 }}
                  className="mt-7 font-display text-2xl font-extrabold text-primary md:text-4xl"
                >
                  {a.punch}
                </motion.p>
              )}
              {act === 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.9 }}
                >
                  <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-1 text-xs uppercase tracking-[0.2em] text-gray-400 md:text-sm">
                    {c.thesisLines.map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </div>
                  <Link
                    href="/contact"
                    className="mt-10 inline-block rounded-lg bg-primary px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light"
                  >
                    {c.cta}
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progreso — 5 segmentos */}
        <div className="relative z-10 mb-8 flex items-center justify-center gap-2">
          {c.acts.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Act ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === act ? 'w-10 bg-primary' : 'w-5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
        {act < 4 && (
          <p className="relative z-10 mb-6 text-center text-[10px] uppercase tracking-[0.3em] text-white/35">
            {c.scrollHint}
          </p>
        )}
      </div>
    </div>
  );
}
