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

const WHY: Record<Lang, { kicker: string; lines: string[]; punch: string; closing: string }> = {
  en: {
    kicker: 'Why we exist',
    lines: [
      'Developers build what they are told — whether or not it should be built.',
      'AI vendors sell acceleration, whatever the direction.',
    ],
    punch: 'Each holds one piece. The business needs the whole.',
    closing:
      'We exist in the space between — where understanding, design and execution belong to the same hands, committed to the sustainable growth of your business.',
  },
  es: {
    kicker: 'Por qué existimos',
    lines: [
      'Los desarrolladores construyen lo que les piden — deba o no construirse.',
      'Los vendedores de IA venden aceleración, sea cual sea la dirección.',
    ],
    punch: 'Cada uno tiene una pieza. El negocio necesita el todo.',
    closing:
      'Existimos en el espacio intermedio — donde el entendimiento, el diseño y la ejecución pertenecen a las mismas manos, comprometidas con el crecimiento sostenible de tu negocio.',
  },
  pt: {
    kicker: 'Por que existimos',
    lines: [
      'Desenvolvedores constroem o que pedem — devendo ou não ser construído.',
      'Vendedores de IA vendem aceleração, seja qual for a direção.',
    ],
    punch: 'Cada um tem uma peça. O negócio precisa do todo.',
    closing:
      'Existimos no espaço entre — onde o entendimento, o design e a execução pertencem às mesmas mãos, comprometidas com o crescimento sustentável do seu negócio.',
  },
};

export function WhyWeExist() {
  const { lang } = useLanguage();
  const c = pick(WHY, lang);
  return (
    <section className="bg-background-dark py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.p {...fadeUp} className="mb-10 text-base font-extrabold uppercase tracking-[0.3em] text-primary md:text-xl">
          {c.kicker}
        </motion.p>
        <div className="space-y-6">
          {c.lines.map((l, i) => (
            <motion.p
              key={l}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.12 }}
              className="font-display text-xl font-semibold leading-snug text-gray-400 md:text-3xl"
            >
              {l}
            </motion.p>
          ))}
        </div>
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.4 }}
          className="mt-12 font-display text-xl font-semibold leading-snug text-gray-400 md:text-3xl"
        >
          {c.punch}
        </motion.p>
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.55 }}
          className="mt-6 font-display text-xl font-semibold leading-snug text-white md:text-3xl"
        >
          {c.closing}
        </motion.p>
      </div>
    </section>
  );
}

/* ─────────────── VIABLE · PERMISSIBLE · EXECUTABLE ─────────────── */

const TRIAD: Record<Lang, { kicker: string; cards: { word: string; fail: string }[]; punch: string }> = {
  en: {
    kicker: 'Every solution must work in the real world',
    cards: [
      { word: 'VIABLE', fail: 'A sophisticated legal structure that doesn’t grow the business isn’t a solution.' },
      { word: 'PERMISSIBLE', fail: 'A brilliant growth strategy that cannot legally be implemented isn’t a solution.' },
      { word: 'EXECUTABLE', fail: 'An opportunity without the technology to execute it isn’t a solution.' },
    ],
    punch: 'The client needs one solution that works.',
  },
  es: {
    kicker: 'Toda solución debe funcionar en el mundo real',
    cards: [
      { word: 'VIABLE', fail: 'Una estructura legal sofisticada que no hace crecer el negocio no es una solución.' },
      { word: 'PERMISIBLE', fail: 'Una estrategia de crecimiento brillante que no puede implementarse legalmente no es una solución.' },
      { word: 'EJECUTABLE', fail: 'Una oportunidad sin la tecnología para ejecutarla no es una solución.' },
    ],
    punch: 'El cliente necesita una solución que funcione.',
  },
  pt: {
    kicker: 'Toda solução deve funcionar no mundo real',
    cards: [
      { word: 'VIÁVEL', fail: 'Uma estrutura legal sofisticada que não faz o negócio crescer não é uma solução.' },
      { word: 'PERMISSÍVEL', fail: 'Uma estratégia de crescimento brilhante que não pode ser implementada legalmente não é uma solução.' },
      { word: 'EXECUTÁVEL', fail: 'Uma oportunidade sem a tecnologia para executá-la não é uma solução.' },
    ],
    punch: 'O cliente precisa de uma solução que funcione.',
  },
};

export function Triad() {
  const { lang } = useLanguage();
  const c = pick(TRIAD, lang);
  return (
    <section className="bg-background-dark py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.p {...fadeUp} className="mb-12 text-base font-extrabold uppercase tracking-[0.3em] text-primary md:text-xl">
          {c.kicker}
        </motion.p>
        <div className="grid gap-5 md:grid-cols-3">
          {c.cards.map((card, i) => (
            <motion.div
              key={card.word}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.14 }}
              className="group relative overflow-hidden rounded-2xl border border-surface-border bg-background-dark p-8 transition-colors hover:border-primary/50"
            >
              <p className="font-display text-2xl font-extrabold tracking-wide text-white md:text-3xl">{card.word}</p>
              <div className="mt-4 h-0.5 w-10 bg-primary transition-all duration-500 group-hover:w-20" />
              <p className="mt-5 text-sm leading-relaxed text-gray-400 transition-colors group-hover:text-gray-300">
                {card.fail}
              </p>
            </motion.div>
          ))}
        </div>
        <motion.p
          {...fadeUp}
          className="mt-14 max-w-3xl font-display text-2xl font-extrabold leading-snug text-white md:text-3xl"
        >
          {c.punch}
        </motion.p>
      </div>
    </section>
  );
}

/* ─────────────── LOS 3 PILARES ─────────────── */

const PILLARS: Record<Lang, { kicker: string; title: string; cards: { icon: 'legal' | 'growth'; name: string; desc: string }[] }> = {
  en: {
    kicker: 'Two disciplines. One solution.',
    title: 'Where Business Engineering lives',
    cards: [
      { icon: 'legal', name: 'Legal Solutions', desc: 'Governance frameworks, cross-border structuring and compliance — engineered as part of the solution, not as an afterthought.' },
      { icon: 'growth', name: 'Sustainable Growth - BPA', desc: 'Strategy differentiated by execution: operating models, KPI systems, simulators and Business Process Automation — and we stay for the last mile.' },
    ],
  },
  es: {
    kicker: 'Dos disciplinas. Una solución.',
    title: 'Donde vive la Ingeniería de Negocios',
    cards: [
      { icon: 'legal', name: 'Soluciones Legales', desc: 'Gobernanza, estructuración transfronteriza y cumplimiento — ingenierizados como parte de la solución, no como un anexo.' },
      { icon: 'growth', name: 'Crecimiento Sostenible - BPA', desc: 'Estrategia diferenciada por la ejecución: modelos operativos, KPIs, simuladores y automatización de procesos (BPA) — y nos quedamos para la última milla.' },
    ],
  },
  pt: {
    kicker: 'Duas disciplinas. Uma solução.',
    title: 'Onde vive a Engenharia de Negócios',
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
        <motion.p {...fadeUp} className="mb-3 text-base font-extrabold uppercase tracking-[0.3em] text-primary md:text-xl">
          {c.kicker}
        </motion.p>
        <motion.h2 {...fadeUp} className="mb-12 font-display text-3xl font-extrabold text-white md:text-5xl">
          {c.title}
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
          <motion.p {...fadeUp} className="mb-12 text-base font-extrabold uppercase tracking-[0.3em] text-primary md:text-xl">
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
    pre: 'IMAGINE IF…',
    lines: [
      '…your growth plan, your legal structure and your technology were one design.',
      '…your business told you what is happening while you can still change it.',
    ],
    closing: 'That is where every engagement begins.',
    button: 'Start the conversation',
  },
  es: {
    pre: 'IMAGINA SI…',
    lines: [
      '…tu plan de crecimiento, tu estructura legal y tu tecnología fueran un solo diseño.',
      '…tu negocio te dijera qué está pasando mientras aún puedes cambiarlo.',
    ],
    closing: 'Ahí empieza cada proyecto.',
    button: 'Empecemos la conversación',
  },
  pt: {
    pre: 'IMAGINE SE…',
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
        <motion.p {...fadeUp} className="mb-8 font-display text-2xl font-extrabold tracking-[0.25em] text-primary md:text-3xl">
          {c.pre}
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
