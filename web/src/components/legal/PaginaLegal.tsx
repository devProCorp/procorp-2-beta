'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useLanguage } from '@/context/LanguageContext';

// Marco común de los textos legales: mismo aspecto que /privacy y /cookies.
export default function PaginaLegal({
  titulo,
  actualizado,
  children,
}: {
  titulo: string;
  actualizado?: string;
  children: ReactNode;
}) {
  const { t, lang } = useLanguage();

  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-secondary hover:text-white text-sm font-medium transition-colors mb-10">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          {t('nav.home')}
        </Link>

        <div className="mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wider mb-4">
            {t('privacy.badge')}
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{titulo}</h1>
          {actualizado && <p className="text-secondary text-sm">{actualizado}</p>}
          {/* El texto legal no se traduce sin revisión jurídica. */}
          {lang !== 'es' && (
            <p className="text-secondary text-sm mt-2">{t('legal.spanishOnly')}</p>
          )}
        </div>

        <div lang="es" className="text-secondary text-base leading-relaxed space-y-5 max-w-[72ch]">
          {children}
        </div>
      </div>
    </main>
  );
}
