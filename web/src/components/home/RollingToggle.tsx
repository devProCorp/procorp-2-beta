'use client';

import { useEffect, useState } from 'react';

/**
 * Interruptor "Rolling" (esquina superior derecha de HOME, solo escritorio):
 * ON → la página avanza sección a sección (CSS scroll-snap);
 * OFF (default) → landing de scroll continuo estándar.
 * La clase se limpia al salir de HOME.
 */
export default function RollingToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('snap-home', on);
    return () => document.documentElement.classList.remove('snap-home');
  }, [on]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className="fixed right-6 top-24 z-40 hidden items-center gap-3 rounded-lg border border-white/15 bg-background-dark/70 px-4 py-1.5 backdrop-blur-md transition-colors hover:border-primary/60 md:flex"
    >
      <span className={`text-[10px] font-bold uppercase tracking-[0.25em] transition-colors ${on ? 'text-white' : 'text-white/60'}`}>
        No Rolling
      </span>
      <span className={`relative h-4 w-8 shrink-0 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-white/20'}`}>
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-[18px]' : 'translate-x-0.5'}`}
        ></span>
      </span>
    </button>
  );
}
