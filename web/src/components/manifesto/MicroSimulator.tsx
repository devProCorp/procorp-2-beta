'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Micro-simulador del home — "Simulation is understanding" hecho tangible.
 * Modelo de juguete: dos palancas (precio, capacidad) → 12 meses de ingreso
 * proyectado, con futuros alternativos en fantasma. No dice — deja tocar.
 */

type Lang = 'en' | 'es' | 'pt';

const T: Record<Lang, Record<string, string>> = {
  en: {
    kicker: 'Simulation is understanding',
    title: 'Move a lever. Watch a future change.',
    price: 'Price adjustment',
    capacity: 'Capacity invested',
    revenue: '12-month revenue vs. baseline',
    baseline: 'Baseline',
    scenario: 'Your scenario',
    ghosts: 'Alternative futures',
    note: 'A toy model — ten seconds of play. Now imagine it with your numbers, your processes, your market.',
  },
  es: {
    kicker: 'La simulación es entendimiento',
    title: 'Mueve una palanca. Mira cambiar un futuro.',
    price: 'Ajuste de precio',
    capacity: 'Capacidad invertida',
    revenue: 'Ingreso a 12 meses vs. línea base',
    baseline: 'Línea base',
    scenario: 'Tu escenario',
    ghosts: 'Futuros alternativos',
    note: 'Un modelo de juguete — diez segundos de juego. Ahora imagínalo con tus números, tus procesos, tu mercado.',
  },
  pt: {
    kicker: 'A simulação é entendimento',
    title: 'Mova uma alavanca. Veja um futuro mudar.',
    price: 'Ajuste de preço',
    capacity: 'Capacidade investida',
    revenue: 'Receita em 12 meses vs. linha de base',
    baseline: 'Linha de base',
    scenario: 'Seu cenário',
    ghosts: 'Futuros alternativos',
    note: 'Um modelo de brinquedo — dez segundos de jogo. Agora imagine com seus números, seus processos, seu mercado.',
  },
};

const MONTHS = 12;
const W = 640;
const H = 240;
const PAD = 18;

function series(priceD: number, capF: number): number[] {
  // volumen con elasticidad al precio; capacidad limita; leve rampa de adopción
  const out: number[] = [];
  for (let m = 0; m < MONTHS; m++) {
    const demand = (1 + 0.018 * m) * (1 - 1.15 * priceD);
    const vol = Math.min(demand, capF * (0.92 + 0.008 * m));
    out.push(Math.max(0.2, vol * (1 + priceD)));
  }
  return out;
}

function toPath(vals: number[], max: number): string {
  return vals
    .map((v, i) => {
      const x = PAD + (i / (MONTHS - 1)) * (W - PAD * 2);
      const y = H - PAD - (v / max) * (H - PAD * 2);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export default function MicroSimulator() {
  const { lang } = useLanguage();
  const t = T[(lang as Lang) in T ? (lang as Lang) : 'en'];

  const [priceD, setPriceD] = useState(0); // -0.10 .. +0.15
  const [capF, setCapF] = useState(1);     // 0.8 .. 1.3

  const { base, scen, g1, g2, delta, max } = useMemo(() => {
    const base = series(0, 1);
    const scen = series(priceD, capF);
    const g1 = series(priceD + 0.05, capF);
    const g2 = series(priceD - 0.05, Math.min(1.3, capF + 0.1));
    const max = Math.max(...base, ...scen, ...g1, ...g2) * 1.08;
    const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);
    const delta = (sum(scen) / sum(base) - 1) * 100;
    return { base, scen, g1, g2, delta, max };
  }, [priceD, capF]);

  return (
    <section className="bg-surface-darker py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-primary">{t.kicker}</p>
        <h2 className="mb-12 font-display text-3xl font-extrabold text-white md:text-5xl">{t.title}</h2>

        <div className="grid gap-10 md:grid-cols-[300px_1fr]">
          {/* Palancas */}
          <div className="space-y-8">
            {[
              { label: t.price, value: priceD, min: -0.1, max: 0.15, step: 0.01, set: setPriceD, fmt: (v: number) => `${v > 0 ? '+' : ''}${Math.round(v * 100)}%` },
              { label: t.capacity, value: capF, min: 0.8, max: 1.3, step: 0.01, set: setCapF, fmt: (v: number) => `${Math.round(v * 100)}%` },
            ].map((s) => (
              <div key={s.label}>
                <div className="mb-2 flex items-baseline justify-between">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">{s.label}</label>
                  <span className="font-display text-xl font-bold tabular-nums text-white">{s.fmt(s.value)}</span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={s.value}
                  onChange={(e) => s.set(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            ))}

            <div className="rounded-xl border border-surface-border bg-background-dark p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">{t.revenue}</p>
              <motion.p
                key={delta.toFixed(1)}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className={`mt-1 font-display text-4xl font-extrabold tabular-nums ${delta >= 0 ? 'text-primary-light' : 'text-gray-300'}`}
              >
                {delta >= 0 ? '+' : ''}
                {delta.toFixed(1)}%
              </motion.p>
            </div>
          </div>

          {/* La curva y sus futuros */}
          <div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border border-surface-border bg-background-dark">
              {[0.25, 0.5, 0.75].map((f) => (
                <line key={f} x1={PAD} x2={W - PAD} y1={H * f} y2={H * f} stroke="#1e293b" strokeWidth="1" />
              ))}
              <path d={toPath(g1, max)} fill="none" stroke="rgba(206,16,38,0.18)" strokeWidth="1.5" />
              <path d={toPath(g2, max)} fill="none" stroke="rgba(206,16,38,0.18)" strokeWidth="1.5" />
              <path d={toPath(base, max)} fill="none" stroke="#8F9295" strokeWidth="1.5" strokeDasharray="5 5" />
              <path d={toPath(scen, max)} fill="none" stroke="#CE1026" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-gray-500">
              <span className="flex items-center gap-2"><i className="inline-block h-0.5 w-5 bg-[#8F9295]" style={{ borderTop: '2px dashed #8F9295', height: 0 }} />{t.baseline}</span>
              <span className="flex items-center gap-2"><i className="inline-block h-[3px] w-5 rounded bg-primary" />{t.scenario}</span>
              <span className="flex items-center gap-2"><i className="inline-block h-[2px] w-5 rounded bg-primary/25" />{t.ghosts}</span>
            </div>
          </div>
        </div>

        <p className="mt-10 max-w-2xl text-sm italic leading-relaxed text-gray-500">{t.note}</p>
      </div>
    </section>
  );
}
