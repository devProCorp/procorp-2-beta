'use client';

import { useEffect, useRef } from 'react';
import type { MotionValue } from 'framer-motion';

// Insumos del negocio que alimentan al organismo (acto 1)
const FEEDER_NAMES: Record<string, string[]> = {
  en: ['CASH', 'NEW BUSINESSES', 'ACCOUNT RECEIVABLES', 'CAPEX', 'PERSONNEL', 'OFFICE SPACE', 'TRAINING', 'UTILITIES'],
  es: ['EFECTIVO', 'NUEVOS NEGOCIOS', 'CUENTAS POR COBRAR', 'CAPEX', 'PERSONAL', 'OFICINAS', 'FORMACIÓN', 'SERVICIOS'],
  pt: ['CAIXA', 'NOVOS NEGÓCIOS', 'CONTAS A RECEBER', 'CAPEX', 'PESSOAL', 'ESCRITÓRIOS', 'TREINAMENTO', 'UTILIDADES'],
};

// Etiqueta del contador de corridas Monte Carlo (acto de simulación)
const SIM_LABEL: Record<string, string> = { en: 'RUN', es: 'SIMULACIÓN', pt: 'SIMULAÇÃO' };

// Leyenda del reloj de 36 semanas (acto 2)
const WEEKS_LABEL: Record<string, string> = { en: 'WEEKS', es: 'SEMANAS', pt: 'SEMANAS' };
const WEEK_WORD: Record<string, string> = { en: 'Week', es: 'Semana', pt: 'Semana' };

// Números romanos para la esfera del reloj (1..36)
const roman = (n: number): string => {
  const map: [number, string][] = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
  return out;
};

// Procesos del negocio para el mapa mental del acto 3
const PROCESS_NAMES: Record<string, string[]> = {
  en: ['SALES', 'MARKETING', 'BILLING', 'HIRING', 'LOGISTICS', 'PROCUREMENT', 'CUSTOMER SERVICE', 'FINANCE', 'COMPLIANCE', 'REPORTING', 'QUALITY', 'ONBOARDING'],
  es: ['VENTAS', 'MARKETING', 'FACTURACIÓN', 'CONTRATACIÓN', 'LOGÍSTICA', 'COMPRAS', 'ATENCIÓN AL CLIENTE', 'FINANZAS', 'CUMPLIMIENTO', 'REPORTES', 'CALIDAD', 'ONBOARDING'],
  pt: ['VENDAS', 'MARKETING', 'FATURAMENTO', 'CONTRATAÇÃO', 'LOGÍSTICA', 'COMPRAS', 'ATENDIMENTO', 'FINANÇAS', 'COMPLIANCE', 'RELATÓRIOS', 'QUALIDADE', 'ONBOARDING'],
};

/**
 * Red neuronal narrativa del hero — el negocio como sistema vivo.
 * Lee `phase` (0..4 continuo) sin re-renders y muta la escena:
 *  0 sistema vivo (rojo, pulso) · 1 congelado gris + barrido de tiempo
 *  2 bifurcación en 3 futuros fantasma · 3 un futuro se enciende
 *  4 convergencia y fade bajo la tesis
 */

const N = 110;
const LINK_DIST = 150;
const R = 206, G = 16, B = 38; // #CE1026
const GRAY = 148;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface Node {
  hx: number; hy: number;      // home (fracciones 0..1)
  jx: number; jy: number;      // jitter actual
  vx: number; vy: number;
  r: number;
  pulse: number; speed: number;
  cluster: 0 | 1 | 2;
  life: number;                // 0..1 — ciclo celular: nace, vive, muere, renace
  dying: boolean;
  dim: number;                 // atenuación por la manecilla del reloj (acto 2)
}

export default function StoryNetwork({ phase, lang = 'en' }: { phase: MotionValue<number>; lang?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const namesRef = useRef(FEEDER_NAMES.en);
  namesRef.current = FEEDER_NAMES[lang] ?? FEEDER_NAMES.en;
  const procRef = useRef(PROCESS_NAMES.en);
  procRef.current = PROCESS_NAMES[lang] ?? PROCESS_NAMES.en;
  const simRef = useRef(SIM_LABEL.en);
  simRef.current = SIM_LABEL[lang] ?? SIM_LABEL.en;
  const wkRef = useRef(WEEKS_LABEL.en);
  wkRef.current = WEEKS_LABEL[lang] ?? WEEKS_LABEL.en;
  const wkWordRef = useRef(WEEK_WORD.en);
  wkWordRef.current = WEEK_WORD[lang] ?? WEEK_WORD.en;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1, raf = 0;
    const nodes: Node[] = Array.from({ length: N }, (_, i) => ({
      hx: 0.08 + Math.random() * 0.84,
      hy: 0.10 + Math.random() * 0.80,
      jx: 0, jy: 0, vx: 0, vy: 0,
      r: 1.4 + Math.random() * 2.2,
      pulse: Math.random() * Math.PI * 2,
      speed: 0.010 + Math.random() * 0.022,
      cluster: (i % 3) as 0 | 1 | 2,
      life: 1,
      dying: false,
      dim: 1,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Centros de los 3 futuros (fracciones)
    const CL = [
      { x: 0.22, y: 0.42 },
      { x: 0.50, y: 0.55 },
      { x: 0.78, y: 0.40 },
    ];

    const pos = new Array<number>(N * 2);
    const lifeE = new Array<number>(N);
    // Acto de conexión: 2/3 del mapa base es blanco, 1/3 rojo; lo NUEVO llega en rojo
    const tone = Array.from({ length: N }, () => (Math.random() < 1 / 3 ? 1 : 0));
    const extras = Array.from({ length: 26 }, () => ({
      x: 0.08 + Math.random() * 0.84,
      y: 0.12 + Math.random() * 0.76,
      birth: Math.random() * 0.85,
    }));
    let connT = 0;

    // Vida del organismo (acto 1): respiración, renovación celular y alimento.
    // Puntos blancos entran desde fuera; al cruzar la membrana se vuelven rojos
    // (parte del organismo) y al ser absorbidos la ameba crece.
    const feeders: { x: number; y: number; tx: number; ty: number; sp: number; inside: boolean; name: string }[] = [];
    let memScale = 0.5; // la ameba nace a la mitad de su tamaño y crece al alimentarse
    let memFill = 0.1; // cuerpo 90% transparente al nacer; cada reto absorbido lo vuelve 5 pts menos transparente
    let renewT = 0, impT = 0, breathP = 0, memT = 0;
    let last = performance.now();
    // Acto 2 — reloj subliminal: la manecilla barre y los indicadores pierden
    // importancia a su paso (1er paso: se atenúan; 2º paso: desaparecen)
    const K = 14;
    const inds = Array.from({ length: K }, () => ({
      ang: Math.random() * Math.PI * 2,
      rad: 0.5 + Math.random() * 0.42,
      size: 2 + Math.random() * 2.4,
      lvl: 1,
    }));
    let clockT = 0, prevHand = 0;

    // Acto 3 — mapa mental de procesos: ramas que nacen y se retiran; el mapa
    // del final del banner no es el del principio
    interface Branch {
      slot: number; name: string; t: number; state: 'in' | 'live' | 'out';
      kids: number; kt: number;
    }
    const branches: Branch[] = [];
    const MSLOTS = 8;
    let mindT = 0, mindTick = 0;

    // Acto de simulación — corridas Monte Carlo: mismas condiciones de partida,
    // muchas trayectorias, la evidencia se acumula sobre el futuro central
    interface Traj {
      cx: number; cy: number; x1: number; y1: number;
      t: number; age: number; side: 0 | 1 | 2; sp: number; done: boolean;
    }
    const trajs: Traj[] = [];
    const heat = [0, 0, 0];
    let simT = 1.4, runN = 0;

    // Pantalla de control de la simulación: paretos, sliders y lecturas que
    // cambian con cada corrida (los valores se deslizan hacia su nuevo objetivo)
    const newBars = () =>
      Array.from({ length: 6 }, () => 0.25 + Math.random() * 0.75).sort((a, b) => b - a);
    const newGauss = () => [
      { mu: 0.3 + Math.random() * 0.25, sig: 0.07 + Math.random() * 0.09 },
      { mu: 0.5 + Math.random() * 0.3, sig: 0.09 + Math.random() * 0.12 },
    ];
    const panel = {
      bars: newBars(), barsT: newBars(),
      s: [0.5, 0.65], sT: [0.5, 0.65],
      val: 78, valT: 78,
      g: newGauss(), gT: newGauss(),
    };

    const M = 16; // puntos de la membrana orgánica
    const memSeed = Array.from({ length: M }, () => ({
      a: 1.5 + Math.random() * 2.5,
      b: 0.8 + Math.random() * 1.6,
      s: 0.25 + Math.random() * 0.3,
    }));
    const memX = new Array<number>(M);
    const memY = new Array<number>(M);
    const easeOut3 = (t: number) => 1 - (1 - t) ** 3;

    const draw = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const p = clamp(phase.get(), 0, 4);
      const grayF = seg(p, 0.55, 1.05) * (1 - seg(p, 2.55, 3.15)); // gris del acto 2, vuelve el color al elegir futuro
      const aliveF = 1 - seg(p, 0.55, 1.05) * 0.92;                // congela en el acto 2
      const branchF = seg(p, 1.55, 2.45) * (1 - seg(p, 3.45, 3.95));
      const hlF = seg(p, 2.65, 3.25);                              // se enciende el futuro central
      const convF = seg(p, 3.45, 4.0);                             // convergencia final
      const fadeF = 1 - 0.7 * seg(p, 3.55, 4.0);

      ctx.clearRect(0, 0, w, h);

      // Renovación celular: cada ~1.4s de vida, una célula muere y otra nace en otro lugar
      renewT += dt * aliveF;
      if (renewT > 0.8) {
        renewT = 0;
        for (let tries = 0; tries < 8; tries++) {
          const cand = nodes[(Math.random() * N) | 0];
          if (!cand.dying && cand.life > 0.95) { cand.dying = true; break; }
        }
      }

      // Respiración: el organismo entero inhala y exhala (~6s por ciclo)
      breathP += dt;
      const breath = 1 + 0.028 * Math.sin((breathP * Math.PI * 2) / 6) * aliveF;

      // Membrana: el contorno del organismo, morfando en vivo; se congela con el
      // sistema y se disuelve cuando la red se bifurca en futuros
      memT += dt * (0.1 + 0.9 * aliveF);
      // la membrana vive solo en el acto 1: desaparece al entrar el reloj del acto 2
      const memA = (1 - seg(p, 0.55, 1.0)) * (1 - branchF) * (1 - seg(p, 3.45, 3.8)) * fadeF;
      const Rm = Math.min(w, h) * 0.36 * breath * memScale;
      if (memA > 0.02) {
        const cx = w * 0.5, cy = h * 0.5;
        for (let k = 0; k < M; k++) {
          const ang = (k / M) * Math.PI * 2;
          const sd = memSeed[k];
          const wob = 1 + 0.09 * Math.sin(memT * sd.s + sd.a) + 0.05 * Math.sin(memT * sd.s * 2.3 + sd.b);
          memX[k] = cx + Math.cos(ang) * Rm * wob * 1.35; // elipse ancha
          memY[k] = cy + Math.sin(ang) * Rm * wob * 0.85;
        }
        const cr = lerp(R, GRAY, grayF) | 0;
        const cg = lerp(G, GRAY, grayF) | 0;
        const cb = lerp(B, GRAY + 4, grayF) | 0;
        ctx.beginPath();
        ctx.moveTo((memX[M - 1] + memX[0]) / 2, (memY[M - 1] + memY[0]) / 2);
        for (let k = 0; k < M; k++) {
          const nk = (k + 1) % M;
          ctx.quadraticCurveTo(memX[k], memY[k], (memX[k] + memX[nk]) / 2, (memY[k] + memY[nk]) / 2);
        }
        ctx.closePath();
        // Cuerpo original (degradado rojo) al 70% de transparencia; cada reto
        // absorbido lo vuelve 10 pts menos transparente — luego se ajusta
        const grad = ctx.createRadialGradient(cx, cy, Rm * 0.2, cx, cy, Rm * 1.3);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${memFill * memA})`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},${memFill * 0.35 * memA})`);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${0.42 * memA})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      // ── Acto 2: el reloj — el tiempo pasa y los indicadores pierden valor ──
      const clockA = seg(p, 0.65, 1.05) * (1 - seg(p, 1.55, 2.0)) * fadeF;
      if (clockA > 0.02) {
        const cx = w * 0.5, cy = h * 0.5;
        const Rc = Math.min(w, h) * 0.32;
        clockT += dt;
        const handAng = ((clockT % 10) / 10) * Math.PI * 2 - Math.PI / 2; // 10s por vuelta

        // la manecilla apaga lo que barre
        const prev = ((prevHand + Math.PI * 2.5) % (Math.PI * 2));
        const cur = ((handAng + Math.PI * 2.5) % (Math.PI * 2));
        const sweptBy = (a: number) => {
          const tgt = ((a + Math.PI * 2.5) % (Math.PI * 2));
          return prev <= cur ? tgt > prev && tgt <= cur : tgt > prev || tgt <= cur;
        };
        for (const ind of inds) {
          if (sweptBy(ind.ang - Math.PI / 2) && ind.lvl > 0) {
            ind.lvl *= 0.2; // cada pasada apaga el 80%
            if (ind.lvl < 0.05) ind.lvl = 0;
          }
        }
        // también la red congelada (puntos y líneas grises) se apaga a su paso
        for (let i = 0; i < N; i++) {
          const a = Math.atan2(pos[i * 2 + 1] - cy, pos[i * 2] - cx);
          if (sweptBy(a) && nodes[i].dim > 0) {
            nodes[i].dim *= 0.2;
            if (nodes[i].dim < 0.05) nodes[i].dim = 0;
          }
        }
        prevHand = handAng;

        // esfera y marcas: reloj de 36 semanas — bisel con numerales romanos por fuera
        ctx.strokeStyle = `rgba(255,255,255,${0.7 * clockA})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(cx, cy, Rc, 0, Math.PI * 2);
        ctx.stroke();
        ctx.textBaseline = 'middle';
        for (let k = 0; k < 36; k++) {
          const a = -Math.PI / 2 + (k / 36) * Math.PI * 2;
          const major = k % 4 === 0;
          ctx.strokeStyle = `rgba(255,255,255,${0.7 * clockA})`;
          ctx.lineWidth = major ? 1.6 : 1;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * Rc * (major ? 0.92 : 0.95), cy + Math.sin(a) * Rc * (major ? 0.92 : 0.95));
          ctx.lineTo(cx + Math.cos(a) * Rc, cy + Math.sin(a) * Rc);
          ctx.stroke();
          // etiqueta romana fuera del círculo, orientada radialmente (estilo bisel)
          const week = k === 0 ? 36 : k;
          const label = `${roman(week)} ${wkWordRef.current}`;
          ctx.save();
          ctx.translate(cx + Math.cos(a) * Rc * 1.045, cy + Math.sin(a) * Rc * 1.045);
          if (Math.cos(a) < -0.001) {
            ctx.rotate(a + Math.PI);
            ctx.textAlign = 'right';
          } else {
            ctx.rotate(a);
            ctx.textAlign = 'left';
          }
          ctx.font = `${major ? '700' : '400'} 9px system-ui, sans-serif`;
          ctx.fillStyle = `rgba(255,255,255,${0.7 * clockA})`;
          ctx.fillText(label, 0, 0);
          ctx.restore();
        }
        ctx.textAlign = 'center';
        ctx.font = '700 9px system-ui, sans-serif';
        ctx.fillStyle = `rgba(255,255,255,${0.7 * clockA})`;
        ctx.fillText(wkRef.current, cx, cy + Rc * 0.4);
        ctx.textBaseline = 'alphabetic';

        // indicadores: orbes de datos que aún importan… hasta que la manecilla los alcanza
        for (const ind of inds) {
          if (ind.lvl <= 0) continue;
          const a = ind.ang - Math.PI / 2;
          const ix = cx + Math.cos(a) * Rc * ind.rad;
          const iy = cy + Math.sin(a) * Rc * ind.rad;
          const ia = clockA * ind.lvl;
          const orbR = ind.size * 20;
          const og = ctx.createRadialGradient(ix, iy, 0, ix, iy, orbR);
          og.addColorStop(0, `rgba(206,16,38,${0.8 * ia})`);
          og.addColorStop(0.5, `rgba(206,16,38,${0.35 * ia})`);
          og.addColorStop(1, 'rgba(206,16,38,0)');
          ctx.fillStyle = og;
          ctx.beginPath();
          ctx.arc(ix, iy, orbR, 0, Math.PI * 2);
          ctx.fill();
        }

        // manecilla: gris con punta encendida
        ctx.strokeStyle = `rgba(190,190,195,${0.34 * clockA})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(handAng) * Rc * 0.9, cy + Math.sin(handAng) * Rc * 0.9);
        ctx.stroke();
        ctx.fillStyle = `rgba(255,235,238,${0.8 * clockA})`;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(handAng) * Rc * 0.9, cy + Math.sin(handAng) * Rc * 0.9, 2.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // reloj oculto: reiniciar para que la próxima entrada arranque con todos
        // los indicadores y la red a plena intensidad
        clockT = 0;
        prevHand = -Math.PI / 2;
        for (const ind of inds) ind.lvl = 1;
        for (const n of nodes) n.dim = 1;
      }

      // ── Acto 3: mapa mental de procesos en constante transformación ──
      const mindA = seg(p, 1.7, 2.15) * (1 - seg(p, 2.45, 2.65)) * fadeF;
      if (mindA > 0.02) {
        const cx = w * 0.5, cy = h * 0.5;
        const R1 = Math.min(w, h) * 0.30;

        // primera entrada: sembrar 5 ramas escalonadas
        if (branches.length === 0) {
          const names = procRef.current;
          const slots = Array.from({ length: MSLOTS }, (_, i) => i).sort(() => Math.random() - 0.5);
          for (let i = 0; i < 5; i++) {
            branches.push({
              slot: slots[i],
              name: names[(Math.random() * names.length) | 0],
              t: -i * 0.18,
              state: 'in',
              kids: (Math.random() * 3) | 0,
              kt: 0,
            });
          }
        }

        // churn: alternar retirar una rama / crear una nueva (~cada 1.1s)
        mindT += dt;
        if (mindT > 1.1) {
          mindT = 0;
          mindTick++;
          if (mindTick % 2 === 1 || branches.length >= 7) {
            const live = branches.filter((b) => b.state === 'live');
            if (live.length > 3) live[(Math.random() * live.length) | 0].state = 'out';
          } else if (branches.length < 7) {
            const names = procRef.current;
            const usedN = new Set(branches.map((b) => b.name));
            const usedS = new Set(branches.map((b) => b.slot));
            const poolN = names.filter((n) => !usedN.has(n));
            const poolS = Array.from({ length: MSLOTS }, (_, i) => i).filter((s) => !usedS.has(s));
            if (poolN.length && poolS.length) {
              branches.push({
                slot: poolS[(Math.random() * poolS.length) | 0],
                name: poolN[(Math.random() * poolN.length) | 0],
                t: 0.001,
                state: 'in',
                kids: (Math.random() * 3) | 0,
                kt: 0,
              });
            }
          }
        }

        // raíz
        ctx.fillStyle = `rgba(206,16,38,${0.9 * mindA})`;
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(206,16,38,${0.3 * mindA})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, 16, 0, Math.PI * 2);
        ctx.stroke();

        // ramas
        for (let k = branches.length - 1; k >= 0; k--) {
          const b = branches[k];
          if (b.state === 'out') {
            b.t -= dt / 0.5;
            if (b.t <= 0) { branches.splice(k, 1); continue; }
          } else {
            b.t += dt / 0.6;
            if (b.t >= 1) { b.t = 1; b.state = 'live'; }
          }
          if (b.t <= 0) continue;
          if (b.state === 'live' && b.kt < 1) b.kt = Math.min(1, b.kt + dt / 0.5);
          if (b.state === 'out') b.kt = Math.max(0, b.kt - dt / 0.3);

          const te = easeOut3(clamp(b.t, 0, 1));
          const a = (b.slot / MSLOTS) * Math.PI * 2 - Math.PI / 2;
          const ex = cx + Math.cos(a) * R1 * 1.35 * te;
          const ey = cy + Math.sin(a) * R1 * 0.8 * te;

          ctx.strokeStyle = `rgba(206,16,38,${0.55 * mindA * te})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(ex, ey);
          ctx.stroke();
          ctx.fillStyle = `rgba(206,16,38,${0.9 * mindA * te})`;
          ctx.beginPath();
          ctx.arc(ex, ey, 6.5 * te, 0, Math.PI * 2);
          ctx.fill();

          // sub-ramas sin etiqueta
          for (let c = 0; c < b.kids; c++) {
            const ke = easeOut3(b.kt);
            if (ke <= 0) break;
            const ka = a + (c === 0 ? 0.45 : -0.45);
            const kx = ex + Math.cos(ka) * R1 * 0.38 * ke;
            const ky = ey + Math.sin(ka) * R1 * 0.34 * ke;
            ctx.strokeStyle = `rgba(206,16,38,${0.4 * mindA * ke})`;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(ex, ey);
            ctx.lineTo(kx, ky);
            ctx.stroke();
            ctx.fillStyle = `rgba(206,16,38,${0.7 * mindA * ke})`;
            ctx.beginPath();
            ctx.arc(kx, ky, 3.5 * ke, 0, Math.PI * 2);
            ctx.fill();
          }

          // etiqueta del proceso
          const lx = cx + Math.cos(a) * (R1 * 1.35 * te + 26);
          const ly = cy + Math.sin(a) * (R1 * 0.8 * te + 22);
          ctx.font = '700 11px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(255,235,238,${0.9 * mindA * te})`;
          ctx.fillText(b.name, lx, ly + 4);
        }
      } else {
        branches.length = 0;
        mindT = 0;
        mindTick = 0;
      }

      // ── Acto de simulación: corridas Monte Carlo hacia los tres futuros ──
      const simW = seg(p, 3.05, 3.25) * (1 - seg(p, 3.5, 3.75)) * fadeF;
      if (simW > 0.05) {
        const ox = w * 0.5, oy = h * 0.84;

        // nueva corrida cada ~1.5s: un abanico de trayectorias desde el origen
        simT += dt;
        if (simT > 1.5 && runN < 99) {
          simT = 0;
          runN++;
          // cada corrida trae nuevos parámetros a la pantalla de control
          panel.barsT = newBars();
          panel.sT = [Math.random(), Math.random()];
          panel.valT = 55 + Math.random() * 44;
          panel.gT = newGauss();
          const count = 6 + ((Math.random() * 3) | 0);
          for (let k = 0; k < count; k++) {
            const r = Math.random();
            const side = (r < 0.45 ? 1 : r < 0.725 ? 0 : 2) as 0 | 1 | 2;
            const c = CL[side];
            const tx = (c.x + (Math.random() - 0.5) * 0.16) * w;
            const ty = (c.y + (Math.random() - 0.5) * 0.14) * h;
            trajs.push({
              cx: (ox + tx) / 2 + (Math.random() - 0.5) * w * 0.3,
              cy: (oy + ty) / 2 + (Math.random() - 0.5) * h * 0.18,
              x1: tx, y1: ty,
              t: 0, age: 0, side, sp: 0.9 + Math.random() * 0.5, done: false,
            });
          }
        }

        // ── pantalla de control (fondo, atenuada): pareto, gaussianas, sliders ──
        const k = 1 - Math.pow(0.002, dt); // deslizamiento suave hacia el objetivo
        for (let i = 0; i < 6; i++) panel.bars[i] += (panel.barsT[i] - panel.bars[i]) * k;
        for (let i = 0; i < 2; i++) panel.s[i] += (panel.sT[i] - panel.s[i]) * k;
        panel.val += (panel.valT - panel.val) * k;
        for (let i = 0; i < 2; i++) {
          panel.g[i].mu += (panel.gT[i].mu - panel.g[i].mu) * k;
          panel.g[i].sig += (panel.gT[i].sig - panel.g[i].sig) * k;
        }

        const pa = 0.7 * simW; // un poco atenuada: es telón de fondo
        const pw = Math.min(380, w * 0.5);
        const ph = pw * 0.6;
        const px = clamp(ox - pw / 2, 12, w - pw - 12);
        const py = Math.max(12, oy - ph - 42); // justo encima del número de corrida

        // marco
        ctx.fillStyle = `rgba(10,10,14,${0.5 * pa})`;
        ctx.strokeStyle = `rgba(255,255,255,${0.16 * pa})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const rr = 12;
        ctx.moveTo(px + rr, py);
        ctx.arcTo(px + pw, py, px + pw, py + ph, rr);
        ctx.arcTo(px + pw, py + ph, px, py + ph, rr);
        ctx.arcTo(px, py + ph, px, py, rr);
        ctx.arcTo(px, py, px + pw, py, rr);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // pareto (columna izquierda): barras descendentes + curva acumulada
        const chL = px + 16, chR = px + pw * 0.55, chB = py + ph - 42, chT = py + 20;
        const bw = (chR - chL) / 6;
        let cum = 0;
        const total = panel.bars.reduce((s, b) => s + b, 0);
        const cumPts: number[] = [];
        for (let i = 0; i < 6; i++) {
          const bh = (chB - chT) * panel.bars[i];
          ctx.fillStyle = `rgba(206,16,38,${0.7 * pa})`;
          ctx.fillRect(chL + i * bw + 2, chB - bh, bw - 4, bh);
          cum += panel.bars[i];
          cumPts.push(chL + i * bw + bw / 2, chB - (chB - chT) * (cum / total));
        }
        ctx.strokeStyle = `rgba(255,235,238,${0.5 * pa})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(cumPts[0], cumPts[1]);
        for (let i = 1; i < 6; i++) ctx.lineTo(cumPts[i * 2], cumPts[i * 2 + 1]);
        ctx.stroke();

        // lectura principal (derecha, arriba)
        ctx.font = `700 ${Math.round(pw * 0.09)}px system-ui, sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillStyle = `rgba(255,235,238,${0.85 * pa})`;
        ctx.fillText(`${panel.val.toFixed(1)}%`, px + pw - 16, py + 34);
        ctx.font = '600 9px system-ui, sans-serif';
        ctx.fillStyle = `rgba(170,172,178,${0.7 * pa})`;
        ctx.fillText('P(SUCCESS)', px + pw - 16, py + 48);

        // distribuciones gaussianas (derecha, centro): dos campanas que se mueven
        const gL = chR + 14, gR = px + pw - 16, gB = chB, gT2 = py + 58;
        for (let gi = 0; gi < 2; gi++) {
          const { mu, sig } = panel.g[gi];
          ctx.strokeStyle = gi === 0
            ? `rgba(206,16,38,${0.8 * pa})`
            : `rgba(235,238,245,${0.55 * pa})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          for (let s = 0; s <= 36; s++) {
            const xf = s / 36;
            const yv = Math.exp(-((xf - mu) ** 2) / (2 * sig * sig));
            const X = gL + (gR - gL) * xf;
            const Y = gB - (gB - gT2) * yv * 0.92;
            if (s === 0) ctx.moveTo(X, Y);
            else ctx.lineTo(X, Y);
          }
          ctx.stroke();
        }
        // línea base de las campanas
        ctx.strokeStyle = `rgba(255,255,255,${0.14 * pa})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(gL, gB);
        ctx.lineTo(gR, gB);
        ctx.stroke();

        // sliders (abajo, ancho completo)
        for (let i = 0; i < 2; i++) {
          const sy = py + ph - 28 + i * 14;
          const sl = px + 16, sr = px + pw - 16;
          ctx.strokeStyle = `rgba(255,255,255,${0.18 * pa})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sl, sy);
          ctx.lineTo(sr, sy);
          ctx.stroke();
          const kx = sl + (sr - sl) * panel.s[i];
          ctx.strokeStyle = `rgba(206,16,38,${0.75 * pa})`;
          ctx.beginPath();
          ctx.moveTo(sl, sy);
          ctx.lineTo(kx, sy);
          ctx.stroke();
          ctx.fillStyle = `rgba(255,240,242,${0.9 * pa})`;
          ctx.beginPath();
          ctx.arc(kx, sy, 3.6, 0, Math.PI * 2);
          ctx.fill();
        }

        // origen: el estado presente del negocio
        const og = ctx.createRadialGradient(ox, oy, 0, ox, oy, 26);
        og.addColorStop(0, `rgba(255,235,238,${0.8 * simW})`);
        og.addColorStop(0.4, `rgba(206,16,38,${0.5 * simW})`);
        og.addColorStop(1, 'rgba(206,16,38,0)');
        ctx.fillStyle = og;
        ctx.beginPath();
        ctx.arc(ox, oy, 26, 0, Math.PI * 2);
        ctx.fill();

        // trayectorias (bezier cuadrática origen → futuro)
        for (let k = trajs.length - 1; k >= 0; k--) {
          const tr = trajs[k];
          tr.t = Math.min(1, tr.t + (dt / 1.1) * tr.sp);
          if (tr.t >= 1) {
            if (!tr.done) { tr.done = true; heat[tr.side] += 1; }
            tr.age += dt;
          }
          const maxAge = tr.side === 1 ? 3.5 : 1.6;
          if (tr.age > maxAge) { trajs.splice(k, 1); continue; }
          const fade = 1 - tr.age / maxAge;
          const col = tr.side === 1 ? '206,16,38' : '168,170,176';
          const la = (tr.side === 1 ? 0.5 : 0.32) * fade * simW;
          ctx.strokeStyle = `rgba(${col},${la})`;
          ctx.lineWidth = tr.side === 1 ? 1.4 : 1;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          const steps = 18;
          for (let s = 1; s <= steps; s++) {
            const tt = (s / steps) * tr.t;
            const mt = 1 - tt;
            ctx.lineTo(
              mt * mt * ox + 2 * mt * tt * tr.cx + tt * tt * tr.x1,
              mt * mt * oy + 2 * mt * tt * tr.cy + tt * tt * tr.y1,
            );
          }
          ctx.stroke();
          // cabeza del recorrido
          if (tr.t < 1) {
            const mt = 1 - tr.t;
            const hx = mt * mt * ox + 2 * mt * tr.t * tr.cx + tr.t * tr.t * tr.x1;
            const hy = mt * mt * oy + 2 * mt * tr.t * tr.cy + tr.t * tr.t * tr.y1;
            ctx.fillStyle = `rgba(255,240,242,${0.95 * simW})`;
            ctx.beginPath();
            ctx.arc(hx, hy, 2.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // calor acumulado sobre cada futuro: la evidencia de las corridas
        for (let s = 0; s < 3; s++) {
          if (s !== 1) heat[s] *= Math.pow(0.5, dt / 1.6); // los laterales se enfrían
          if (heat[s] < 0.1) continue;
          const inten = Math.min(1, heat[s] / 9);
          const gx = CL[s].x * w, gy = CL[s].y * h;
          const gr = 55 + 65 * inten;
          const hg = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
          const hcol = s === 1 ? '206,16,38' : '168,170,176';
          hg.addColorStop(0, `rgba(${hcol},${0.3 * inten * simW})`);
          hg.addColorStop(1, `rgba(${hcol},0)`);
          ctx.fillStyle = hg;
          ctx.beginPath();
          ctx.arc(gx, gy, gr, 0, Math.PI * 2);
          ctx.fill();
        }

        // contador de corridas
        if (runN > 0) {
          ctx.font = '700 12px system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillStyle = `rgba(255,235,238,${0.85 * simW})`;
          ctx.fillText(`${simRef.current} ${String(runN).padStart(2, '0')}`, ox + 38, oy + 4);
        }

      } else {
        trajs.length = 0;
        heat[0] = heat[1] = heat[2] = 0;
        simT = 1.4;
        runN = 0;
      }

      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        // ciclo de vida — pausado (y completado) cuando el sistema se congela
        if (aliveF < 0.3) {
          n.dying = false;
          n.life = Math.min(1, n.life + dt * 1.5);
        } else if (n.dying) {
          n.life -= dt / 0.7;
          if (n.life <= 0) {
            n.dying = false;
            n.life = 0.001;
            n.hx = 0.08 + Math.random() * 0.84;
            n.hy = 0.10 + Math.random() * 0.80;
            n.jx = 0; n.jy = 0; n.vx = 0; n.vy = 0;
          }
        } else if (n.life < 1) {
          n.life = Math.min(1, n.life + dt);
        }
        lifeE[i] = easeOut3(clamp(n.life, 0, 1));

        // jitter orgánico solo mientras el sistema está vivo
        n.vx += (Math.random() - 0.5) * 0.05 * aliveF;
        n.vy += (Math.random() - 0.5) * 0.05 * aliveF;
        n.vx *= 0.9; n.vy *= 0.9;
        n.jx = clamp(n.jx + n.vx, -18, 18);
        n.jy = clamp(n.jy + n.vy, -18, 18);
        n.pulse += n.speed * (0.35 + aliveF);

        const c = CL[n.cluster];
        // hogar → cluster (bifurcación) → centro (convergencia)
        let x = lerp(n.hx, c.x + (n.hx - 0.5) * 0.36, branchF) * w + n.jx;
        let y = lerp(n.hy, c.y + (n.hy - 0.5) * 0.36, branchF) * h + n.jy;
        x = lerp(x, w * 0.5, convF * 0.85);
        y = lerp(y, h * 0.52, convF * 0.85);
        x = w * 0.5 + (x - w * 0.5) * breath;
        y = h * 0.5 + (y - h * 0.5) * breath;
        pos[i * 2] = x; pos[i * 2 + 1] = y;
      }

      // ── Acto de conexión: mapa base 2/3 blanco + 1/3 rojo; la conectividad
      // crece y todo lo nuevo (líneas, puentes, puntos) llega en rojo ──
      const connW = seg(p, 2.5, 2.6) * (1 - seg(p, 3.05, 3.3));
      let cp = 0;
      if (connW > 0.05) {
        connT += dt;
        cp = clamp(connT / 8, 0, 1); // 8s para conectarlo todo
      } else {
        connT = 0;
      }
      const LD = LINK_DIST * (1 + (connW > 0.05 ? 0.8 * cp : 0)); // el alcance crece: nada queda aislado

      // Conexiones
      for (let i = 0; i < N; i++) {
        const ni = nodes[i];
        for (let j = i + 1; j < N; j++) {
          const nj = nodes[j];
          const cross = ni.cluster !== nj.cluster;
          if (branchF > 0.35 && cross && connW <= 0.05) continue; // los futuros se separan
          const dx = pos[i * 2] - pos[j * 2];
          const dy = pos[i * 2 + 1] - pos[j * 2 + 1];
          const d2 = dx * dx + dy * dy;
          if (d2 > LD * LD) continue;
          const lm = Math.min(lifeE[i], lifeE[j]) * Math.min(ni.dim, nj.dim);
          if (lm < 0.05) continue; // las conexiones se tejen con la vida de la célula
          const d = Math.sqrt(d2);
          let a = (1 - d / LD) * 0.44 * lm;
          if (connW > 0.05) {
            // lo que solo existe gracias a la nueva conectividad es NUEVO → rojo
            const isNew = d > LINK_DIST || (cross && branchF > 0.35);
            if (isNew) {
              const reach = clamp((LD - d) / 50, 0, 1) * (cross ? cp : 1);
              if (reach < 0.02) continue;
              ctx.strokeStyle = `rgba(206,16,38,${0.5 * reach * lm * connW * fadeF})`;
              ctx.lineWidth = 1.1;
              ctx.beginPath();
              ctx.moveTo(pos[i * 2], pos[i * 2 + 1]);
              ctx.lineTo(pos[j * 2], pos[j * 2 + 1]);
              ctx.stroke();
              continue;
            }
            // mapa base: blanco, salvo las líneas entre dos nodos rojos.
            // Arranca 50% atenuado y termina fuertemente conectado (ramp con cp)
            const isRed = tone[i] === 1 && tone[j] === 1;
            const col = isRed ? '206,16,38' : '225,228,235';
            const strength = 0.5 + 0.7 * cp;
            ctx.strokeStyle = `rgba(${col},${clamp(a * strength, 0, 0.9) * connW * fadeF})`;
            ctx.lineWidth = 1 + 0.5 * cp;
            ctx.beginPath();
            ctx.moveTo(pos[i * 2], pos[i * 2 + 1]);
            ctx.lineTo(pos[j * 2], pos[j * 2 + 1]);
            ctx.stroke();
            if (connW > 0.95) continue;
            a *= 1 - connW; // mezcla con el color normal durante la transición
          }
          // futuros fantasma vs futuro elegido
          if (hlF > 0) a *= ni.cluster === 1 ? 1 + hlF * 0.7 : 1 - hlF * 0.72;
          const cr = lerp(R, GRAY, grayF);
          const cg = lerp(G, GRAY, grayF);
          const cb = lerp(B, GRAY + 4, grayF);
          ctx.strokeStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${a * fadeF})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pos[i * 2], pos[i * 2 + 1]);
          ctx.lineTo(pos[j * 2], pos[j * 2 + 1]);
          ctx.stroke();
        }
      }

      // Nodos
      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        const le = lifeE[i] * n.dim;
        if (le < 0.02) continue;
        const pr = n.r * 1.45 * (1 + 0.35 * Math.sin(n.pulse) * aliveF) * le;
        let a = (0.55 + 0.35 * Math.sin(n.pulse) * aliveF) * le;
        if (hlF > 0) a *= n.cluster === 1 ? 1 + hlF * 0.6 : 1 - hlF * 0.7;
        const cr = lerp(R, GRAY, grayF);
        const cg = lerp(G, GRAY, grayF);
        const cb = lerp(B, GRAY + 4, grayF);
        if (connW > 0.5) {
          // acto de conexión: el mapa base se ve 2/3 blanco, 1/3 rojo
          ctx.fillStyle = tone[i] === 1
            ? `rgba(206,16,38,${clamp(a, 0.06, 1) * fadeF})`
            : `rgba(225,228,235,${clamp(a, 0.06, 1) * fadeF})`;
        } else {
          ctx.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${clamp(a, 0.06, 1) * fadeF})`;
        }
        ctx.beginPath();
        ctx.arc(pos[i * 2], pos[i * 2 + 1], pr, 0, Math.PI * 2);
        ctx.fill();

        // halo de nacimiento: la célula nueva brilla mientras se teje a la red
        if (!n.dying && n.life > 0 && n.life < 0.45 && aliveF > 0.3) {
          const g = (0.45 - n.life) / 0.45;
          ctx.strokeStyle = `rgba(255,120,130,${g * 0.55 * fadeF})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(pos[i * 2], pos[i * 2 + 1], pr + 3 + g * 7, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Puntos NUEVOS del acto de conexión: aparecen en rojo y tejen enlaces rojos
      if (connW > 0.05) {
        for (const e of extras) {
          if (cp <= e.birth) continue;
          const pe = easeOut3(clamp((cp - e.birth) / 0.12, 0, 1));
          const exx = e.x * w, eyy = e.y * h;
          const LDe = LD * 0.8;
          for (let i = 0; i < N; i++) {
            const dx = exx - pos[i * 2], dy = eyy - pos[i * 2 + 1];
            const d2 = dx * dx + dy * dy;
            if (d2 > LDe * LDe) continue;
            const d = Math.sqrt(d2);
            const la = (1 - d / LDe) * 0.4 * pe * connW * fadeF * lifeE[i];
            if (la < 0.02) continue;
            ctx.strokeStyle = `rgba(206,16,38,${la})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(exx, eyy);
            ctx.lineTo(pos[i * 2], pos[i * 2 + 1]);
            ctx.stroke();
          }
          ctx.fillStyle = `rgba(206,16,38,${0.9 * pe * connW * fadeF})`;
          ctx.beginPath();
          ctx.arc(exx, eyy, 3.6 * pe, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Alimento: puntos blancos que entran, cruzan la membrana (→ rojos) y
      // al ser absorbidos hacen crecer la ameba
      if (memA > 0.3) {
        impT += dt * aliveF;
        if (impT > 0.9 && feeders.length < 5) {
          impT = 0;
          const side = (Math.random() * 4) | 0;
          const fx = side === 0 ? -40 : side === 1 ? w + 40 : Math.random() * w;
          const fy = side === 0 || side === 1 ? Math.random() * h : side === 2 ? -40 : h + 40;
          const ang = Math.random() * Math.PI * 2;
          const names = namesRef.current;
          const active = new Set(feeders.map((f) => f.name));
          const pool = names.filter((n) => !active.has(n));
          feeders.push({
            x: fx, y: fy,
            tx: w * 0.5 + Math.cos(ang) * Rm * 0.35,
            ty: h * 0.5 + Math.sin(ang) * Rm * 0.25,
            sp: 135 + Math.random() * 105,
            inside: false,
            name: (pool.length ? pool : names)[(Math.random() * (pool.length || names.length)) | 0],
          });
        }
        for (let k = feeders.length - 1; k >= 0; k--) {
          const f = feeders[k];
          const dx = f.tx - f.x, dy = f.ty - f.y;
          const d = Math.hypot(dx, dy);
          const step = f.sp * dt;
          if (d < Math.max(step, 14)) {
            // absorbido: el organismo crece y su cuerpo se vuelve más denso
            feeders.splice(k, 1);
            memScale = Math.min(1.5, memScale + 0.09);
            memFill = Math.min(0.8, memFill + 0.05);
            continue;
          }
          f.x += (dx / d) * step;
          f.y += (dy / d) * step;
          if (!f.inside) {
            const ex = (f.x - w * 0.5) / (Rm * 1.35);
            const ey = (f.y - h * 0.5) / (Rm * 0.85);
            if (ex * ex + ey * ey < 1) f.inside = true; // cruzó la membrana: ahora es rojo
          }
          const ia = aliveF * fadeF;
          const glow = f.inside ? '206,16,38' : '255,200,206';
          const core = f.inside ? 'rgba(226,60,78,' : 'rgba(255,240,242,';
          const sg = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 32);
          sg.addColorStop(0, `rgba(${glow},${0.5 * ia})`);
          sg.addColorStop(1, `rgba(${glow},0)`);
          ctx.fillStyle = sg;
          ctx.beginPath();
          ctx.arc(f.x, f.y, 32, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = core + ia + ')';
          ctx.beginPath();
          ctx.arc(f.x, f.y, 13, 0, Math.PI * 2);
          ctx.fill();
          // etiqueta del insumo
          ctx.font = '700 11px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = f.inside ? `rgba(235,120,132,${0.95 * ia})` : `rgba(255,246,247,${0.9 * ia})`;
          ctx.fillText(f.name, f.x, f.y - 24);
        }
      } else if (memA <= 0.02) {
        // fuera del acto 1: la ameba renace pequeña y translúcida para el próximo ciclo
        feeders.length = 0;
        memScale = 0.5;
        memFill = 0.1;
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [phase]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
