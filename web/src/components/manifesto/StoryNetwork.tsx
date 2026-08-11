'use client';

import { useEffect, useRef } from 'react';
import type { MotionValue } from 'framer-motion';

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
}

export default function StoryNetwork({ phase }: { phase: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const draw = () => {
      const p = clamp(phase.get(), 0, 4);
      const grayF = seg(p, 0.55, 1.05) * (1 - seg(p, 2.55, 3.15)); // gris del acto 2, vuelve el color al elegir futuro
      const aliveF = 1 - seg(p, 0.55, 1.05) * 0.92;                // congela en el acto 2
      const branchF = seg(p, 1.55, 2.45) * (1 - seg(p, 3.45, 3.95));
      const hlF = seg(p, 2.65, 3.25);                              // se enciende el futuro central
      const convF = seg(p, 3.45, 4.0);                             // convergencia final
      const fadeF = 1 - 0.7 * seg(p, 3.55, 4.0);
      const sweepT = seg(p, 0.95, 1.65);                           // barrido de la ventana de tiempo

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < N; i++) {
        const n = nodes[i];
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
        pos[i * 2] = x; pos[i * 2 + 1] = y;
      }

      // Conexiones
      for (let i = 0; i < N; i++) {
        const ni = nodes[i];
        for (let j = i + 1; j < N; j++) {
          const nj = nodes[j];
          if (branchF > 0.35 && ni.cluster !== nj.cluster) continue; // los futuros se separan
          const dx = pos[i * 2] - pos[j * 2];
          const dy = pos[i * 2 + 1] - pos[j * 2 + 1];
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST * LINK_DIST) continue;
          const d = Math.sqrt(d2);
          let a = (1 - d / LINK_DIST) * 0.34;
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
        const pr = n.r * (1 + 0.35 * Math.sin(n.pulse) * aliveF);
        let a = 0.55 + 0.35 * Math.sin(n.pulse) * aliveF;
        if (hlF > 0) a *= n.cluster === 1 ? 1 + hlF * 0.6 : 1 - hlF * 0.7;
        const cr = lerp(R, GRAY, grayF);
        const cg = lerp(G, GRAY, grayF);
        const cb = lerp(B, GRAY + 4, grayF);
        ctx.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${clamp(a, 0.06, 1) * fadeF})`;
        ctx.beginPath();
        ctx.arc(pos[i * 2], pos[i * 2 + 1], pr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Barrido: la ventana de acción pasando de largo (acto 2)
      if (sweepT > 0 && sweepT < 1) {
        const sx = w * (0.05 + 0.9 * sweepT);
        const ga = Math.sin(sweepT * Math.PI) * 0.5;
        const grad = ctx.createLinearGradient(sx - 60, 0, sx, 0);
        grad.addColorStop(0, 'rgba(206,16,38,0)');
        grad.addColorStop(1, `rgba(206,16,38,${ga})`);
        ctx.fillStyle = grad;
        ctx.fillRect(sx - 60, 0, 60, h);
        ctx.fillStyle = `rgba(255,255,255,${ga * 0.9})`;
        ctx.fillRect(sx, 0, 1.5, h);
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
