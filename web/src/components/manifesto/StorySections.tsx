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

const WHY: Record<Lang, { kicker: [string, string]; lines: string[] }> = {
  en: {
    kicker: ['Why', ' we exist'],
    lines: [
      'To help you grow your productivity.',
      'To connect your dots, watch and simulate your company or project as a system.',
      'To design innovative business monitoring and legal solutions.',
    ],
  },
  es: {
    kicker: ['Por qué', ' existimos'],
    lines: [
      'Para ayudarte a crecer tu productividad.',
      'Para conectar tus puntos, observar y simular tu empresa o proyecto como un sistema.',
      'Para diseñar soluciones innovadoras de monitoreo de negocios y soluciones legales.',
    ],
  },
  pt: {
    kicker: ['Por que', ' existimos'],
    lines: [
      'Para ajudar sua produtividade a crescer.',
      'Para conectar seus pontos, observar e simular sua empresa ou projeto como um sistema.',
      'Para desenhar soluções inovadoras de monitoramento de negócios e soluções jurídicas.',
    ],
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
              className="font-display text-xl font-semibold leading-snug text-gray-100 md:text-3xl"
            >
              {l}
            </motion.p>
          ))}
        </div>
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

const CTA: Record<Lang, { pre: string; lines: string[]; closing: string; button: string }> = {
  en: {
    pre: 'Imagine If…',
    lines: [
      '…your growth plan, your legal structure and your technology were one design.',
      '…your business told you what is happening while you can still change it.',
    ],
    closing: 'That is where every engagement begins.',
    button: 'Start the conversation',
  },
  es: {
    pre: 'Imagina Si…',
    lines: [
      '…tu plan de crecimiento, tu estructura legal y tu tecnología fueran un solo diseño.',
      '…tu negocio te dijera qué está pasando mientras aún puedes cambiarlo.',
    ],
    closing: 'Ahí empieza cada proyecto.',
    button: 'Empecemos la conversación',
  },
  pt: {
    pre: 'Imagine Se…',
    lines: [
      '…seu plano de crescimento, sua estrutura legal e sua tecnologia fossem um único design.',
      '…seu negócio dissesse o que está acontecendo enquanto você ainda pode mudar.',
    ],
    closing: 'É aí que todo projeto começa.',
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
              className="text-lg italic leading-relaxed text-gray-300 md:text-xl"
            >
              {l}
            </motion.p>
          ))}
        </div>
        <motion.p {...fadeUp} className="mt-10 font-display text-xl font-bold text-white md:text-2xl">
          {c.closing}
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
