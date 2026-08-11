'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, TrendingUp, Cpu, RefreshCw } from 'lucide-react';
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

const WHY: Record<Lang, { kicker: string; lines: string[]; punch: string }> = {
  en: {
    kicker: 'Why we exist',
    lines: [
      'Consultants deliver strategy and leave before it runs.',
      'Developers build what they are told — whether or not it should be built.',
      'AI vendors sell acceleration, whatever the direction.',
    ],
    punch: 'Each holds one piece. The business needs the whole. We exist in the space between.',
  },
  es: {
    kicker: 'Por qué existimos',
    lines: [
      'Los consultores entregan la estrategia y se van antes de que funcione.',
      'Los desarrolladores construyen lo que les piden — deba o no construirse.',
      'Los vendedores de IA venden aceleración, sea cual sea la dirección.',
    ],
    punch: 'Cada uno tiene una pieza. El negocio necesita el todo. Existimos en el espacio intermedio.',
  },
  pt: {
    kicker: 'Por que existimos',
    lines: [
      'Consultores entregam a estratégia e vão embora antes de ela funcionar.',
      'Desenvolvedores constroem o que pedem — devendo ou não ser construído.',
      'Vendedores de IA vendem aceleração, seja qual for a direção.',
    ],
    punch: 'Cada um tem uma peça. O negócio precisa do todo. Existimos no espaço entre eles.',
  },
};

export function WhyWeExist() {
  const { lang } = useLanguage();
  const c = pick(WHY, lang);
  return (
    <section className="bg-background-dark py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <motion.p {...fadeUp} className="mb-10 text-xs font-bold uppercase tracking-[0.35em] text-primary">
          {c.kicker}
        </motion.p>
        <div className="space-y-6">
          {c.lines.map((l, i) => (
            <motion.p
              key={l}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.12 }}
              className="font-display text-xl font-semibold leading-snug text-gray-500 md:text-3xl"
            >
              {l}
            </motion.p>
          ))}
        </div>
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.4 }}
          className="mt-12 font-display text-2xl font-extrabold leading-snug text-white md:text-4xl"
        >
          {c.punch}
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
    punch: 'The client does not need four answers. The client needs one solution that works.',
  },
  es: {
    kicker: 'Toda solución debe funcionar en el mundo real',
    cards: [
      { word: 'VIABLE', fail: 'Una estructura legal sofisticada que no hace crecer el negocio no es una solución.' },
      { word: 'PERMISIBLE', fail: 'Una estrategia de crecimiento brillante que no puede implementarse legalmente no es una solución.' },
      { word: 'EJECUTABLE', fail: 'Una oportunidad sin la tecnología para ejecutarla no es una solución.' },
    ],
    punch: 'El cliente no necesita cuatro respuestas. Necesita una solución que funcione.',
  },
  pt: {
    kicker: 'Toda solução deve funcionar no mundo real',
    cards: [
      { word: 'VIÁVEL', fail: 'Uma estrutura legal sofisticada que não faz o negócio crescer não é uma solução.' },
      { word: 'PERMISSÍVEL', fail: 'Uma estratégia de crescimento brilhante que não pode ser implementada legalmente não é uma solução.' },
      { word: 'EXECUTÁVEL', fail: 'Uma oportunidade sem a tecnologia para executá-la não é uma solução.' },
    ],
    punch: 'O cliente não precisa de quatro respostas. Precisa de uma solução que funcione.',
  },
};

export function Triad() {
  const { lang } = useLanguage();
  const c = pick(TRIAD, lang);
  return (
    <section className="bg-surface-darker py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.p {...fadeUp} className="mb-12 text-xs font-bold uppercase tracking-[0.35em] text-primary">
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
              <p className="mt-5 text-sm leading-relaxed text-gray-500 transition-colors group-hover:text-gray-300">
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

/* ─────────────── OUR WAY — el ciclo ─────────────── */

const WAY: Record<Lang, { kicker: string; steps: string[]; repeat: string; closing: string }> = {
  en: {
    kicker: 'Our way',
    steps: ['Understand', 'Model', 'Simulate', 'Redesign', 'Build', 'Measure', 'Learn'],
    repeat: 'And repeat.',
    closing: 'Because a business is never finished. Neither is Business Engineering.',
  },
  es: {
    kicker: 'Nuestra forma',
    steps: ['Entender', 'Modelar', 'Simular', 'Rediseñar', 'Construir', 'Medir', 'Aprender'],
    repeat: 'Y repetir.',
    closing: 'Porque un negocio nunca está terminado. La Ingeniería de Negocios tampoco.',
  },
  pt: {
    kicker: 'Nosso jeito',
    steps: ['Entender', 'Modelar', 'Simular', 'Redesenhar', 'Construir', 'Medir', 'Aprender'],
    repeat: 'E repetir.',
    closing: 'Porque um negócio nunca está pronto. A Engenharia de Negócios também não.',
  },
};

export function OurWay() {
  const { lang } = useLanguage();
  const c = pick(WAY, lang);
  return (
    <section className="overflow-hidden bg-background-dark py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.p {...fadeUp} className="mb-14 text-xs font-bold uppercase tracking-[0.35em] text-primary">
          {c.kicker}
        </motion.p>
        <div className="flex flex-wrap items-center gap-y-6">
          {c.steps.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
              className="flex items-center"
            >
              <span className="font-display text-lg font-bold text-white md:text-2xl">
                <span className="mr-1.5 text-xs font-extrabold tabular-nums text-primary align-super">{i + 1}</span>
                {s}
              </span>
              <span className="mx-3 text-primary/60 md:mx-5">→</span>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, rotate: -90 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: c.steps.length * 0.12 }}
            className="flex items-center gap-2 rounded-full border border-primary/40 px-4 py-1.5"
          >
            <RefreshCw className="h-4 w-4 text-primary" />
            <span className="font-display text-sm font-bold uppercase tracking-widest text-primary">{c.repeat}</span>
          </motion.div>
        </div>
        <motion.p {...fadeUp} className="mt-12 max-w-2xl text-lg italic text-gray-500">
          {c.closing}
        </motion.p>
      </div>
    </section>
  );
}

/* ─────────────── LOS 3 PILARES ─────────────── */

const PILLARS: Record<Lang, { kicker: string; title: string; cards: { icon: 'legal' | 'growth' | 'tech'; name: string; desc: string }[] }> = {
  en: {
    kicker: 'Three disciplines. One solution.',
    title: 'Where Business Engineering lives',
    cards: [
      { icon: 'legal', name: 'Legal Solutions', desc: 'Governance frameworks, cross-border structuring and compliance — engineered as part of the solution, not as an afterthought.' },
      { icon: 'growth', name: 'Sustainable Growth', desc: 'Strategy differentiated by execution: operating models, KPI systems, simulators — and we stay for the last mile.' },
      { icon: 'tech', name: 'Process Engineering', desc: 'Architectures that connect instead of fragmenting. Automation where it creates value. AI where it accelerates the business.' },
    ],
  },
  es: {
    kicker: 'Tres disciplinas. Una solución.',
    title: 'Donde vive la Ingeniería de Negocios',
    cards: [
      { icon: 'legal', name: 'Soluciones Legales', desc: 'Gobernanza, estructuración transfronteriza y cumplimiento — ingenierizados como parte de la solución, no como un anexo.' },
      { icon: 'growth', name: 'Crecimiento Sostenible', desc: 'Estrategia diferenciada por la ejecución: modelos operativos, KPIs, simuladores — y nos quedamos para la última milla.' },
      { icon: 'tech', name: 'Ingeniería de Procesos', desc: 'Arquitecturas que conectan en vez de fragmentar. Automatización donde crea valor. IA donde acelera el negocio.' },
    ],
  },
  pt: {
    kicker: 'Três disciplinas. Uma solução.',
    title: 'Onde vive a Engenharia de Negócios',
    cards: [
      { icon: 'legal', name: 'Soluções Legais', desc: 'Governança, estruturação internacional e compliance — projetados como parte da solução, não como um anexo.' },
      { icon: 'growth', name: 'Crescimento Sustentável', desc: 'Estratégia diferenciada pela execução: modelos operacionais, KPIs, simuladores — e ficamos para a última milha.' },
      { icon: 'tech', name: 'Engenharia de Processos', desc: 'Arquiteturas que conectam em vez de fragmentar. Automação onde cria valor. IA onde acelera o negócio.' },
    ],
  },
};

const ICONS = { legal: Scale, growth: TrendingUp, tech: Cpu };

export function Pillars() {
  const { lang } = useLanguage();
  const c = pick(PILLARS, lang);
  return (
    <section className="bg-surface-darker py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.p {...fadeUp} className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-primary">
          {c.kicker}
        </motion.p>
        <motion.h2 {...fadeUp} className="mb-12 font-display text-3xl font-extrabold text-white md:text-5xl">
          {c.title}
        </motion.h2>
        <div className="grid gap-5 md:grid-cols-3">
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
      'Information should arrive while there is still time to act.',
      'Technology should serve the business — not define it.',
      'Better businesses can be engineered.',
    ],
  },
  es: {
    kicker: 'Creemos',
    items: [
      'Los negocios son sistemas vivos — y pueden entenderse más profundamente.',
      'La información debe llegar mientras aún hay tiempo de actuar.',
      'La tecnología debe servir al negocio — no definirlo.',
      'Los mejores negocios pueden ingenierizarse.',
    ],
  },
  pt: {
    kicker: 'Acreditamos',
    items: [
      'Os negócios são sistemas vivos — e podem ser entendidos mais profundamente.',
      'A informação deve chegar enquanto ainda há tempo de agir.',
      'A tecnologia deve servir ao negócio — não defini-lo.',
      'Negócios melhores podem ser projetados.',
    ],
  },
};

export function Beliefs() {
  const { lang } = useLanguage();
  const c = pick(BELIEFS, lang);
  return (
    <section className="bg-background-light py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <motion.p {...fadeUp} className="mb-12 text-xs font-bold uppercase tracking-[0.35em] text-primary">
          {c.kicker}
        </motion.p>
        <div className="space-y-8">
          {c.items.map((b, i) => (
            <motion.p
              key={b}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="border-l-2 border-primary pl-6 font-display text-xl font-semibold leading-snug text-gray-900 md:text-3xl"
            >
              {b}
            </motion.p>
          ))}
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
      '…you could see next quarter before committing to it.',
      '…your growth plan, your legal structure and your technology were one design.',
      '…your business told you what is happening while you can still change it.',
    ],
    closing: 'That is where every engagement begins.',
    button: 'Start the conversation',
  },
  es: {
    pre: 'IMAGINA SI…',
    lines: [
      '…pudieras ver el próximo trimestre antes de comprometerte con él.',
      '…tu plan de crecimiento, tu estructura legal y tu tecnología fueran un solo diseño.',
      '…tu negocio te dijera qué está pasando mientras aún puedes cambiarlo.',
    ],
    closing: 'Ahí empieza cada proyecto.',
    button: 'Empecemos la conversación',
  },
  pt: {
    pre: 'IMAGINE SE…',
    lines: [
      '…você pudesse ver o próximo trimestre antes de se comprometer com ele.',
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
