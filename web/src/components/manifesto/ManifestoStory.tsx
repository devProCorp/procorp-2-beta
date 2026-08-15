'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import StoryNetwork from './StoryNetwork';

/**
 * Hero narrativo — el manifiesto en 6 banners rotatorios.
 * Estructura de cada banner: SLOGAN → EXPLICACIÓN → CITA de cliente.
 * Rota perpetuamente cada 5s mientras el usuario esté en la página;
 * el 6º es la tesis (WE ENGINEER BUSINESSES + CTA). Puntos clickeables,
 * skip a la siguiente sección; reduced-motion → tesis estática.
 */

type Lang = 'en' | 'es' | 'pt';

// Etiqueta bajo el logo: los 5 primeros banners son los fundamentos
// de la casa (doctrina propia, no lista canónica); el 6º marca el giro lógico.
// "PRO CORP" lleva el degradado bicolor de la marca.
const FUND_LABEL: Record<Lang, { pre: string; brand: string; post: string; turn: string }> = {
  en: { pre: '', brand: 'PRO CORP', post: ' BUSINESS FUNDAMENTALS', turn: 'THEREFORE' },
  es: { pre: 'FUNDAMENTOS EMPRESARIALES ', brand: 'PRO CORP', post: '', turn: 'POR ESO' },
  pt: { pre: 'FUNDAMENTOS EMPRESARIAIS ', brand: 'PRO CORP', post: '', turn: 'POR ISSO' },
};

interface Act {
  main: string;
  highlight?: string[];
  sub?: string;
  quote?: string;
}

const COPY: Record<Lang, {
  kicker: string;
  acts: Act[];
  thesisLines: string[];
  cta: string;
  skip: string;
  clientLabel: string;
}> = {
  en: {
    kicker: 'Business Engineering',
    acts: [
      {
        main: 'Businesses are living systems.',
        highlight: ['living systems'],
        sub: 'People. Capital. Processes. Decisions. Constantly interacting. Constantly changing.',
        quote: 'My teams in different divisions finally understood how our business is a system that requires processes, synchronization and clear, organized information.',
      },
      {
        main: 'Time is a business variable.',
        highlight: ['Time'],
        sub: "Yesterday's information can explain the past. Timely information can change the future.",
        quote: 'We often discovered what happened after the chance to change it had passed. The numbers were accurate. The analysis was correct. But the window for action was gone.',
      },
      {
        main: 'Rethinking how the business works.',
        highlight: ['Rethinking'],
        sub: 'Sometimes that means redesigning a process. Sometimes changing an operating model. Sometimes connecting information that has always existed but has never been seen together.',
        quote: "And then we looked at the business as a whole and discovered that what we thought was the original problem wasn't the real cause at all.",
      },
      {
        main: 'Connecting what matters, in real time, all the time.',
        highlight: ['Connecting', 'in real time'],
        sub: 'Information has its greatest value before an outcome becomes inevitable. That is what Real Time means: not simply faster reporting, but earlier understanding.',
        quote: 'Seeing a change while it can still be influenced. Recognizing a problem before it becomes a consequence. Identifying an opportunity while it is still one.',
      },
      {
        main: 'Understanding Through Simulation.',
        highlight: ['Simulation'],
        sub: 'One of the most powerful ways to understand a business is to simulate it. A model forces us to understand how the pieces connect. A simulation allows us to change them.',
        quote: 'We explored what happens when assumptions change. We surfaced consequences that were difficult to see before. We compared possible futures and tested decisions before committing to them.',
      },
      { main: 'WE ENGINEER BUSINESSES.', highlight: ['ENGINEER'] },
    ],
    thesisLines: [
      'Technology is the instrument.',
      'AI is the accelerator.',
      'Simulation is understanding.',
      'Execution is the differentiator.',
    ],
    cta: 'Imagine if — start the conversation',
    skip: 'Skip',
    clientLabel: 'CLIENT',
  },
  es: {
    kicker: 'Business Engineering',
    acts: [
      {
        main: 'Los negocios son sistemas vivos.',
        highlight: ['sistemas vivos'],
        sub: 'Personas. Capital. Procesos. Decisiones. En interacción constante. En cambio constante.',
        quote: 'Mis equipos en distintas divisiones por fin entendieron que nuestro negocio es un sistema que requiere procesos, sincronización e información clara y organizada.',
      },
      {
        main: 'El tiempo es una variable del negocio.',
        highlight: ['tiempo'],
        sub: 'La información de ayer puede explicar el pasado. La información oportuna puede cambiar el futuro.',
        quote: 'Muchas veces descubríamos lo ocurrido cuando la oportunidad de cambiarlo ya había pasado. Las cifras eran exactas. El análisis era correcto. Pero la ventana para actuar ya no estaba.',
      },
      {
        main: 'Repensar cómo funciona el negocio.',
        highlight: ['Repensar'],
        sub: 'A veces significa rediseñar un proceso. A veces cambiar el modelo operativo. A veces conectar información que siempre existió pero nunca se había visto junta.',
        quote: 'Y entonces miramos el negocio como un todo y descubrimos que lo que creíamos el problema original no era la causa real.',
      },
      {
        main: 'Conectar lo que importa, en tiempo real, todo el tiempo.',
        highlight: ['Conectar', 'en tiempo real'],
        sub: 'La información tiene su mayor valor antes de que el desenlace sea inevitable. Eso significa Tiempo Real: no reportes más rápidos, sino entendimiento más temprano.',
        quote: 'Ver un cambio mientras aún puede influirse. Reconocer un problema antes de que se convierta en consecuencia. Identificar una oportunidad mientras todavía lo es.',
      },
      {
        main: 'Entendimiento a través de la simulación.',
        highlight: ['simulación'],
        sub: 'Una de las formas más poderosas de entender un negocio es simularlo. Un modelo nos obliga a entender cómo se conectan las piezas. Una simulación nos permite cambiarlas.',
        quote: 'Exploramos qué pasa cuando cambian los supuestos. Afloramos consecuencias que antes eran difíciles de ver. Comparamos futuros posibles y probamos decisiones antes de comprometernos con ellas.',
      },
      { main: 'HACEMOS INGENIERÍA DE NEGOCIOS.', highlight: ['INGENIERÍA'] },
    ],
    thesisLines: [
      'La tecnología es el instrumento.',
      'La IA es el acelerador.',
      'La simulación es entendimiento.',
      'La ejecución es el diferenciador.',
    ],
    cta: 'Imagina si — empecemos la conversación',
    skip: 'Saltar',
    clientLabel: 'CLIENTE',
  },
  pt: {
    kicker: 'Business Engineering',
    acts: [
      {
        main: 'Os negócios são sistemas vivos.',
        highlight: ['sistemas vivos'],
        sub: 'Pessoas. Capital. Processos. Decisões. Em interação constante. Em mudança constante.',
        quote: 'Minhas equipes em diferentes divisões finalmente entenderam que nosso negócio é um sistema que exige processos, sincronização e informação clara e organizada.',
      },
      {
        main: 'O tempo é uma variável do negócio.',
        highlight: ['tempo'],
        sub: 'A informação de ontem pode explicar o passado. A informação oportuna pode mudar o futuro.',
        quote: 'Muitas vezes descobríamos o que aconteceu quando a chance de mudar já tinha passado. Os números eram exatos. A análise estava correta. Mas a janela para agir já não existia.',
      },
      {
        main: 'Repensar como o negócio funciona.',
        highlight: ['Repensar'],
        sub: 'Às vezes significa redesenhar um processo. Às vezes mudar o modelo operacional. Às vezes conectar informações que sempre existiram mas nunca foram vistas juntas.',
        quote: 'E então olhamos o negócio como um todo e descobrimos que o que achávamos ser o problema original não era a causa real.',
      },
      {
        main: 'Conectar o que importa, em tempo real, o tempo todo.',
        highlight: ['Conectar', 'em tempo real'],
        sub: 'A informação tem seu maior valor antes de o desfecho se tornar inevitável. É isso que Tempo Real significa: não relatórios mais rápidos, mas entendimento mais cedo.',
        quote: 'Ver uma mudança enquanto ainda pode ser influenciada. Reconhecer um problema antes que se torne consequência. Identificar uma oportunidade enquanto ainda é uma.',
      },
      {
        main: 'Entendimento através da simulação.',
        highlight: ['simulação'],
        sub: 'Uma das formas mais poderosas de entender um negócio é simulá-lo. Um modelo nos obriga a entender como as peças se conectam. Uma simulação nos permite mudá-las.',
        quote: 'Exploramos o que acontece quando as premissas mudam. Revelamos consequências que antes eram difíceis de ver. Comparamos futuros possíveis e testamos decisões antes de nos comprometermos com elas.',
      },
      { main: 'FAZEMOS ENGENHARIA DE NEGÓCIOS.', highlight: ['ENGENHARIA'] },
    ],
    thesisLines: [
      'A tecnologia é o instrumento.',
      'A IA é o acelerador.',
      'A simulação é entendimento.',
      'A execução é o diferencial.',
    ],
    cta: 'Imagine se — comece a conversa',
    skip: 'Pular',
    clientLabel: 'CLIENTE',
  },
};

// Cadencia por banner: slogan → +3s explicación → +3s cita → +8s cambio
const SUB_DELAY = 4;
const QUOTE_DELAY = 8;
const HOLD_AFTER_LAST = 8;
const N_ACTS = 6;
// Estado del canvas por acto: vivo · congelado/barrido · bifurcación ·
// reconexión · futuro elegido · convergencia bajo la tesis
const ACT_PHASE = [0, 1.2, 2.1, 2.6, 3.2, 4];

const MORPH =
  'text-morph bg-gradient-to-r from-primary-light via-white to-primary-light bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]';

// Parte el slogan y envuelve cada frase resaltada con el gradiente morfante
function renderMain(main: string, highlights?: string[]) {
  if (!highlights?.length) return main;
  const nodes: React.ReactNode[] = [];
  let rest = main;
  let k = 0;
  while (rest) {
    let idx = -1;
    let hit = '';
    for (const h of highlights) {
      const i = rest.indexOf(h);
      if (i !== -1 && (idx === -1 || i < idx)) {
        idx = i;
        hit = h;
      }
    }
    if (idx === -1) {
      nodes.push(rest);
      break;
    }
    if (idx > 0) nodes.push(rest.slice(0, idx));
    nodes.push(
      <span key={k++} className={MORPH}>
        {hit}
      </span>,
    );
    rest = rest.slice(idx + hit.length);
  }
  return nodes;
}

export default function ManifestoStory() {
  const { lang } = useLanguage();
  const c = COPY[(lang as Lang) in COPY ? (lang as Lang) : 'en'];

  const containerRef = useRef<HTMLDivElement>(null);
  const [act, setAct] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [sound, setSound] = useState(false);
  const [inView, setInView] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const instRef = useRef(0);        // instancia de banner (crece en cada cambio de acto)
  const playedInstRef = useRef(-1); // última instancia que ya sonó — no repetir al volver a scrollear
  const touchRef = useRef<{ x: number; y: number } | null>(null); // swipe horizontal en móvil/tablet
  const swipedRef = useRef(false);  // evita que el tap-avance se dispare tras un swipe
  const phase = useMotionValue(0);

  // Si el hero sale de pantalla (skip, scroll, otra sección), el audio para al instante
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting && e.intersectionRatio > 0.3),
      { threshold: [0, 0.3, 0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Cada cambio de acto es una instancia nueva de banner
  useEffect(() => {
    instRef.current += 1;
  }, [act]);

  // Un ÚNICO elemento de audio, desbloqueado en el gesto del usuario — iOS/iPadOS
  // exige activación por elemento, así que se reutiliza cambiando solo el src.
  const ensureAudio = useCallback(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    return audioRef.current;
  }, []);

  const toggleSound = useCallback(() => {
    setSound((v) => {
      const next = !v;
      if (next) {
        // dentro del gesto: desbloquea el elemento y narra el banner visible ya mismo
        const a = ensureAudio();
        a.src = `/audio/manifesto/act${act + 1}.mp3`;
        a.currentTime = 0;
        playedInstRef.current = instRef.current;
        a.play().catch(() => {});
      } else {
        audioRef.current?.pause();
      }
      return next;
    });
  }, [act, ensureAudio]);

  // Voz en off (Sterling): arranca 0,5s después de que aparece cada banner —
  // por avance automático, tap, flechas o swipe. Solo con el hero visible;
  // al volver de un scroll no re-arranca a mitad de banner.
  useEffect(() => {
    if (reduced || !sound || !inView) return;
    if (playedInstRef.current === instRef.current) return;
    playedInstRef.current = instRef.current;
    let cancelled = false;
    const id = setTimeout(() => {
      if (cancelled) return;
      const a = ensureAudio();
      a.src = `/audio/manifesto/act${act + 1}.mp3`;
      a.currentTime = 0;
      a.play().catch(() => {});
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(id);
      audioRef.current?.pause();
    };
  }, [act, sound, reduced, inView, ensureAudio]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  // Rotación automática perpetua mientras el usuario esté en la página.
  // La duración depende de los elementos del banner: el último en aparecer
  // (cita > explicación > slogan) se sostiene 8s antes del cambio.
  useEffect(() => {
    if (reduced) return;
    const cur = c.acts[act];
    const lastAt = cur.quote ? QUOTE_DELAY : cur.sub || act === N_ACTS - 1 ? SUB_DELAY : 0;
    const advance = () => {
      const next = (act + 1) % N_ACTS;
      setAct(next);
      if (next === 0) phase.set(0); // reinicio del ciclo: la red revive
      else animate(phase, ACT_PHASE[next], { duration: 1.4, ease: 'easeInOut' });
    };
    let onEnd: (() => void) | null = null;
    const id = setTimeout(() => {
      // si la voz en off sigue sonando, el banner espera a que termine
      const a = audioRef.current;
      if (sound && a && !a.paused && !a.ended) {
        onEnd = advance;
        a.addEventListener('ended', onEnd, { once: true });
      } else {
        advance();
      }
    }, (lastAt + HOLD_AFTER_LAST) * 1000);
    return () => {
      clearTimeout(id);
      if (onEnd && audioRef.current) audioRef.current.removeEventListener('ended', onEnd);
    };
  }, [act, reduced, phase, c, sound]);

  const goTo = useCallback(
    (i: number) => {
      setAct(i);
      if (i === 0) phase.set(0);
      else animate(phase, ACT_PHASE[i], { duration: 1.0, ease: 'easeInOut' });
    },
    [phase],
  );

  const skip = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    window.scrollTo({ top: el.offsetTop + el.offsetHeight, behavior: 'smooth' });
  }, []);

  // Accesible: tesis estática, sin película
  if (reduced) {
    return (
      <section className="relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden bg-background-dark px-6 text-center">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.4em] text-primary">{c.kicker}</p>
        <h1 className="max-w-5xl font-condensed text-[2.5rem] font-semibold uppercase leading-[0.98] text-white md:text-[7rem]">{c.acts[5].main}</h1>
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
  const isThesis = act === N_ACTS - 1;

  return (
    <div ref={containerRef} className="relative bg-background-dark">
      <div className="relative flex h-[100svh] flex-col overflow-hidden">
        <StoryNetwork phase={phase} lang={lang} />

        {/* H1 solo para SEO/lectores de pantalla — sin presencia visual */}
        <h1 className="sr-only">{c.kicker}</h1>

        {/* Etiqueta de fundamentos (banners 1-5) / giro lógico (banner 6) — alineada bajo el logo del navbar */}
        <div className="pointer-events-none absolute inset-x-0 top-8 z-20">
          <div className="mx-auto w-full max-w-[1440px] px-4 md:px-10">
            <AnimatePresence mode="wait">
              {(() => {
                const fl = FUND_LABEL[(lang as Lang) in FUND_LABEL ? (lang as Lang) : 'en'];
                return (
                  <motion.p
                    key={isThesis ? 'turn' : `fund-${act}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="whitespace-nowrap font-condensed text-xs font-extrabold uppercase tracking-[0.15em] sm:text-sm md:font-ui md:text-xl md:tracking-[0.2em]"
                  >
                    {isThesis ? (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{fl.turn}</span>
                    ) : (
                      <>
                        {fl.pre && <span className="text-white">{fl.pre}</span>}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">{fl.brand}</span>
                        {fl.post && <span className="text-white">{fl.post}</span>}
                        <span className="ml-3 text-primary-light md:ml-4">{`0${act + 1} / 05`}</span>
                      </>
                    )}
                    {/* Paso manual de la presentación */}
                    <span className="pointer-events-auto ml-4 inline-flex gap-1 align-middle">
                      <button
                        type="button"
                        aria-label="Previous banner"
                        onClick={(e) => { e.stopPropagation(); goTo((act + N_ACTS - 1) % N_ACTS); }}
                        className="px-1.5 font-extrabold text-primary-light transition-colors hover:text-white"
                      >
                        {'<'}
                      </button>
                      <button
                        type="button"
                        aria-label="Next banner"
                        onClick={(e) => { e.stopPropagation(); goTo((act + 1) % N_ACTS); }}
                        className="px-1.5 font-extrabold text-primary-light transition-colors hover:text-white"
                      >
                        {'>'}
                      </button>
                    </span>
                  </motion.p>
                );
              })()}
            </AnimatePresence>
          </div>
        </div>

        {/* Sonido + Skip */}
        <div className="absolute right-6 top-20 z-20 flex items-center gap-2 md:right-12">
          <button
            type="button"
            aria-pressed={sound}
            aria-label={sound ? 'Voice over off' : 'Voice over on'}
            onClick={toggleSound}
            className={`flex items-center justify-center rounded-lg border px-3 py-1.5 transition-colors ${sound
                ? 'border-primary/60 text-primary-light'
                : 'border-white/15 text-white/60 hover:border-primary/60 hover:text-white'
              }`}
          >
            <span className="material-symbols-outlined text-[16px] leading-none">{sound ? 'volume_up' : 'volume_off'}</span>
          </button>
          <button
            type="button"
            onClick={skip}
            className="rounded-lg border border-white/15 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/60 transition-colors hover:border-primary/60 hover:text-white"
          >
            {c.skip} →
          </button>
        </div>

        {/* Banner: slogan → explicación → cita — click/tap: siguiente banner;
            swipe horizontal (móvil/tablet): avanza o retrocede; el vertical sigue siendo scroll */}
        <div
          className="relative z-10 flex flex-1 cursor-pointer touch-pan-y items-center justify-center px-6"
          onClick={(e) => {
            if (swipedRef.current) { swipedRef.current = false; return; }
            if ((e.target as HTMLElement).closest('a, button')) return;
            goTo((act + 1) % N_ACTS);
          }}
          onTouchStart={(e) => {
            swipedRef.current = false;
            touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }}
          onTouchMove={(e) => {
            // reconocer el swipe DURANTE el gesto: touchend puede no llegar
            // (el navegador lo convierte en touchcancel si empieza a scrollear)
            const t0 = touchRef.current;
            if (!t0 || swipedRef.current) return;
            const dx = e.touches[0].clientX - t0.x;
            const dy = e.touches[0].clientY - t0.y;
            if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3) {
              swipedRef.current = true;
              goTo(dx < 0 ? (act + 1) % N_ACTS : (act + N_ACTS - 1) % N_ACTS);
            }
          }}
          onTouchEnd={(e) => {
            const t0 = touchRef.current;
            touchRef.current = null;
            if (!t0 || swipedRef.current) return;
            const dx = e.changedTouches[0].clientX - t0.x;
            const dy = e.changedTouches[0].clientY - t0.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
              swipedRef.current = true;
              goTo(dx < 0 ? (act + 1) % N_ACTS : (act + N_ACTS - 1) % N_ACTS);
            }
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={act}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -22 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="max-w-5xl text-center"
            >
              <h2
                className={`font-condensed font-semibold uppercase leading-[0.98] tracking-tight text-white ${
                  isThesis ? 'text-[2.5rem] md:text-[7rem]' : 'text-[2rem] md:text-[5.25rem]'
                }`}
              >
                {renderMain(a.main, a.highlight)}
              </h2>

              {a.sub && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: SUB_DELAY, duration: 0.8 }}
                  className="mx-auto mt-8 max-w-3xl text-base text-gray-400 md:mt-14 md:text-2xl"
                >
                  {a.sub}
                </motion.p>
              )}

              {a.quote && (
                <motion.blockquote
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: QUOTE_DELAY, duration: 0.8 }}
                  className="ml-auto mt-8 max-w-3xl border-r-2 border-primary/70 pr-6 text-right text-sm italic leading-relaxed text-gray-300 md:mt-16 md:text-xl"
                >
                  “{a.quote}”
                  <span className="mt-3 block text-xs font-bold not-italic uppercase tracking-[0.3em] text-gray-500 md:text-sm">
                    [{c.clientLabel}]
                  </span>
                </motion.blockquote>
              )}

              {isThesis && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: SUB_DELAY, duration: 0.9 }}>
                  <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-bold uppercase tracking-[0.2em] text-gray-200 md:mt-10 md:gap-x-10 md:text-xl">
                    {c.thesisLines.map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </div>
                  <Link
                    href="/contact"
                    className="mt-12 inline-block rounded-lg bg-primary px-10 py-5 text-base font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light"
                  >
                    {c.cta}
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progreso — 6 segmentos */}
        <div className="relative z-10 mb-8 flex items-center justify-center gap-2">
          {c.acts.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Banner ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === act ? 'w-10 bg-primary' : 'w-5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
