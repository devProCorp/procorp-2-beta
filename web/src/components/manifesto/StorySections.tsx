'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

/** Secciones del home-manifiesto (todas trilingües, dicts locales). */

type Lang = 'en' | 'es' | 'pt';
const pick = <T,>(d: Record<Lang, T>, lang: string): T => d[(lang as Lang) in d ? (lang as Lang) : 'en'];

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: 'easeOut' as const },
};

/* ─────────────── WHY WE EXIST ─────────────── */

const WHY: Record<Lang, { kicker: [string, string]; lines: string[]; mantra: string }> = {
  en: {
    kicker: ['Why', ' we exist'],
    lines: [
      'Businesses are living systems. Understanding them changes how you lead them.',
      'PRO CORP models how your business works, simulates what could happen next, and engineers what it could become — side by side with your management, challenging how things work today and designing solutions that are viable, permissible and executable.',
      'We bring that understanding together in your Business Cockpit — where real-time information meets simulation, making the signals, scenarios and possibilities that matter visible while there is still time to act.',
    ],
    mantra: 'See what is. Imagine what could be. Engineer the difference.',
  },
  es: {
    kicker: ['Por qué', ' existimos'],
    lines: [
      'Los negocios son sistemas vivos. Entenderlos cambia la manera de liderarlos.',
      'PRO CORP modela cómo funciona tu negocio, simula qué podría pasar después y diseña lo que podría llegar a ser — de la mano de tu dirección, cuestionando cómo funcionan las cosas hoy y creando soluciones viables, permisibles y ejecutables.',
      'Reunimos todo ese entendimiento en tu Business Cockpit — donde la información en tiempo real se encuentra con la simulación, haciendo visibles las señales, los escenarios y las posibilidades que importan mientras aún hay tiempo de actuar.',
    ],
    mantra: 'Ver lo que es. Imaginar lo que podría ser. "Engineer" la diferencia.',
  },
  pt: {
    kicker: ['Por que', ' existimos'],
    lines: [
      'Negócios são sistemas vivos. Entendê-los muda a forma de liderá-los.',
      'A PRO CORP modela como seu negócio funciona, simula o que pode acontecer e projeta o que ele poderia se tornar — lado a lado com a sua gestão, desafiando como as coisas funcionam hoje e criando soluções viáveis, permissíveis e executáveis.',
      'Reunimos todo esse entendimento no seu Business Cockpit — onde a informação em tempo real se encontra com a simulação, tornando visíveis os sinais, os cenários e as possibilidades que importam enquanto ainda há tempo de agir.',
    ],
    mantra: 'Ver o que é. Imaginar o que poderia ser. "Engineer" a diferença.',
  },
};

export function WhyWeExist() {
  const { lang } = useLanguage();
  const c = pick(WHY, lang);
  return (
    <section className="bg-background-dark py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2 {...fadeUp} className="mb-10 text-4xl font-extrabold tracking-tight leading-[1.05] md:text-5xl lg:text-6xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">
            {c.kicker[0]}
          </span>
          <span className="text-white">{c.kicker[1]}</span>
        </motion.h2>
        <div className="space-y-6">
          {c.lines.map((l, i) => (
            <motion.p
              key={l}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.12 }}
              className="max-w-4xl font-display text-lg font-medium leading-relaxed text-gray-100 md:text-2xl"
            >
              {/* "Business Cockpit" se resalta como nombre propio del producto */}
              {l.split(/(Business Cockpit)/).map((part, k) =>
                part === 'Business Cockpit' ? (
                  <strong key={k} className="font-bold text-white">{part}</strong>
                ) : (
                  part
                )
              )}
            </motion.p>
          ))}
        </div>
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.45 }}
          className="mt-12 font-display text-xl font-bold leading-snug text-white md:text-3xl"
        >
          {c.mantra}
        </motion.p>
      </div>
    </section>
  );
}

/* ─────────────── LOS 3 PILARES ─────────────── */

const PILLARS: Record<Lang, { title: [string, string, string]; cards: { icon: 'legal' | 'growth'; name: string; desc: string }[] }> = {
  en: {
    title: ['Where ', 'Business Engineering', ' lives'],
    cards: [
      { icon: 'legal', name: 'Legal Solutions', desc: 'Governance frameworks, cross-border structuring and compliance — engineered as part of the solution, not as an afterthought.' },
      { icon: 'growth', name: 'Sustainable Growth - BPA', desc: 'Strategy differentiated by execution: operating models, KPI systems, simulators and Business Process Automation — and we stay for the last mile.' },
    ],
  },
  es: {
    title: ['Donde vive la ', 'Ingeniería de Negocios', ''],
    cards: [
      { icon: 'legal', name: 'Soluciones Legales', desc: 'Gobernanza, estructuración transfronteriza y cumplimiento — ingenierizados como parte de la solución, no como un anexo.' },
      { icon: 'growth', name: 'Crecimiento Sostenible - BPA', desc: 'Estrategia diferenciada por la ejecución: modelos operativos, KPIs, simuladores y automatización de procesos (BPA) — y nos quedamos para la última milla.' },
    ],
  },
  pt: {
    title: ['Onde vive a ', 'Engenharia de Negócios', ''],
    cards: [
      { icon: 'legal', name: 'Soluções Legais', desc: 'Governança, estruturação internacional e compliance — projetados como parte da solução, não como um anexo.' },
      { icon: 'growth', name: 'Crescimento Sustentável - BPA', desc: 'Estratégia diferenciada pela execução: modelos operacionais, KPIs, simuladores e automação de processos (BPA) — e ficamos para a última milha.' },
    ],
  },
};

const ICONS = { legal: Scale, growth: TrendingUp };

export function Pillars() {
  const { lang } = useLanguage();
  const c = pick(PILLARS, lang);
  return (
    <section className="bg-background-dark py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2 {...fadeUp} className="mb-12 text-4xl font-extrabold tracking-tight leading-[1.05] text-white md:text-5xl lg:text-6xl">
          {c.title[0]}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">
            {c.title[1]}
          </span>
          {c.title[2]}
        </motion.h2>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {c.cards.map((card, i) => {
            const Icon = ICONS[card.icon];
            return (
              <motion.div
                key={card.name}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.14 }}
                className="group rounded-2xl border border-surface-border bg-background-dark p-8 transition-all hover:-translate-y-1 hover:border-primary/50"
              >
                <Icon className="h-7 w-7 text-primary" />
                <h3 className="mt-5 font-display text-xl font-bold text-white">{card.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">{card.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── BELIEFS ─────────────── */

const BELIEFS: Record<Lang, { kicker: string; items: string[] }> = {
  en: {
    kicker: 'We believe',
    items: [
      'Businesses are living systems — and can be understood more deeply.',
      'Possibilities can be explored before decisions are made.',
      'Information should arrive while there is still time to act.',
      'Technology should serve the business — not define it.',
      'AI should accelerate intelligence, not complexity.',
      'Speed creates value when it accelerates learning.',
      'The best strategy is the one that can actually be executed.',
      'Better businesses can be engineered.',
    ],
  },
  es: {
    kicker: 'Creemos',
    items: [
      'Los negocios son sistemas vivos — y pueden entenderse más profundamente.',
      'Las posibilidades pueden explorarse antes de tomar las decisiones.',
      'La información debe llegar mientras aún hay tiempo de actuar.',
      'La tecnología debe servir al negocio — no definirlo.',
      'La IA debe acelerar la inteligencia, no la complejidad.',
      'La velocidad crea valor cuando acelera el aprendizaje.',
      'La mejor estrategia es la que realmente puede ejecutarse.',
      'Los mejores negocios pueden ingenierizarse.',
    ],
  },
  pt: {
    kicker: 'Acreditamos',
    items: [
      'Os negócios são sistemas vivos — e podem ser entendidos mais profundamente.',
      'As possibilidades podem ser exploradas antes de as decisões serem tomadas.',
      'A informação deve chegar enquanto ainda há tempo de agir.',
      'A tecnologia deve servir ao negócio — não defini-lo.',
      'A IA deve acelerar a inteligência, não a complexidade.',
      'A velocidade cria valor quando acelera o aprendizado.',
      'A melhor estratégia é a que realmente pode ser executada.',
      'Negócios melhores podem ser projetados.',
    ],
  },
};

export function Beliefs() {
  const { lang } = useLanguage();
  const c = pick(BELIEFS, lang);
  return (
    <section className="bg-background-dark py-24 px-6 md:py-32">
      <div className="mx-auto max-w-[1100px]">
        <div className="glass-panel rounded-[2rem] border border-surface-border/60 p-10 md:p-14">
          <motion.p {...fadeUp} className="mb-12 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white drop-shadow-[0_0_20px_rgba(206,16,38,0.3)] w-fit">
            {c.kicker}
          </motion.p>
          <div className="space-y-8">
            {c.items.map((b, i) => (
              <motion.p
                key={b}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                className="border-l-2 border-primary pl-6 font-display text-xl font-semibold leading-snug text-gray-100 md:text-2xl"
              >
                {b}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── CTA FINAL ─────────────── */

const CTA: Record<Lang, { pre: string; lines: string[]; closing: string; punch: [string, string]; button: string }> = {
  en: {
    pre: 'Imagine If…',
    lines: [
      '…your business could tell you what is changing.',
      '…your model could tell you why.',
      '…your simulator could show you what might happen next.',
      '…and your Business Cockpit could bring it all together while there is still time to act.',
    ],
    closing: 'Imagine understanding your business before simply reacting to it.',
    punch: ['IMAGINE', ' PRO CORP.'],
    button: 'Start the conversation',
  },
  es: {
    pre: 'Imagina Si…',
    lines: [
      '…tu negocio pudiera decirte qué está cambiando.',
      '…tu modelo pudiera decirte por qué.',
      '…tu simulador pudiera mostrarte qué podría pasar después.',
      '…y tu Business Cockpit lo reuniera todo mientras aún hay tiempo de actuar.',
    ],
    closing: 'Imagina entender tu negocio antes de simplemente reaccionar a él.',
    punch: ['IMAGINA', ' PRO CORP.'],
    button: 'Empecemos la conversación',
  },
  pt: {
    pre: 'Imagine Se…',
    lines: [
      '…seu negócio pudesse dizer o que está mudando.',
      '…seu modelo pudesse dizer por quê.',
      '…seu simulador pudesse mostrar o que pode acontecer em seguida.',
      '…e seu Business Cockpit reunisse tudo enquanto ainda há tempo de agir.',
    ],
    closing: 'Imagine entender seu negócio antes de simplesmente reagir a ele.',
    punch: ['IMAGINE', ' A PRO CORP.'],
    button: 'Comece a conversa',
  },
};

export function FinalCTA() {
  const { lang } = useLanguage();
  const c = pick(CTA, lang);
  return (
    <section className="bg-background-dark py-28 md:py-36">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.p {...fadeUp} className="mb-8 text-4xl font-extrabold tracking-tight leading-[1.05] md:text-5xl lg:text-6xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">
            {c.pre.split(' ')[0]}
          </span>{' '}
          <span className="text-white">{c.pre.split(' ').slice(1).join(' ')}</span>
        </motion.p>
        <div className="space-y-4">
          {c.lines.map((l, i) => (
            <motion.p
              key={l}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.15 }}
              className={`text-lg italic leading-relaxed text-gray-300 md:text-xl ${i === c.lines.length - 1 ? 'lg:whitespace-nowrap' : ''}`}
            >
              {/* "Business Cockpit" se resalta como nombre propio del producto */}
              {l.split(/(Business Cockpit)/).map((part, k) =>
                part === 'Business Cockpit' ? (
                  <strong key={k} className="font-bold not-italic text-white">{part}</strong>
                ) : (
                  part
                )
              )}
            </motion.p>
          ))}
        </div>
        <motion.p {...fadeUp} className="mt-10 font-display text-xl font-bold text-white md:text-2xl">
          {c.closing}
        </motion.p>
        <motion.p {...fadeUp} className="mt-8 text-3xl font-extrabold tracking-tight md:text-4xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white drop-shadow-[0_0_20px_rgba(206,16,38,0.3)]">
            {c.punch[0]}
          </span>
          <span className="text-white">{c.punch[1]}</span>
        </motion.p>
        <motion.div {...fadeUp}>
          <Link
            href="/contact"
            className="mt-10 inline-block rounded-lg bg-primary px-10 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light"
          >
            {c.button}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
