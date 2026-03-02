'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Privacy() {
  const { t } = useLanguage();

  const sections = [
    { title: t('privacy.s1.title'), text: t('privacy.s1.text') },
    { title: t('privacy.s2.title'), text: t('privacy.s2.text') },
    { title: t('privacy.s3.title'), text: t('privacy.s3.text') },
    { title: t('privacy.s4.title'), text: t('privacy.s4.text') },
    { title: t('privacy.s5.title'), text: t('privacy.s5.text') },
    { title: t('privacy.s6.title'), text: t('privacy.s6.text') },
    { title: t('privacy.s7.title'), text: t('privacy.s7.text') },
    { title: t('privacy.s8.title'), text: t('privacy.s8.text') },
    { title: t('privacy.s9.title'), text: t('privacy.s9.text') },
  ];

  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-secondary hover:text-white text-sm font-medium transition-colors mb-10">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          {t('nav.home')}
        </Link>

        <div className="mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            {t('privacy.badge')}
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{t('privacy.title')}</h1>
          <p className="text-secondary text-sm">{t('privacy.updated')}</p>
        </div>

        <div className="bg-surface-dark border border-surface-border rounded-2xl p-8 md:p-12 mb-10">
          <p className="text-secondary leading-relaxed text-sm">{t('privacy.intro')}</p>
        </div>

        <div className="space-y-10">
          {sections.map((section, i) => (
            <section key={i} className="border-b border-surface-border pb-10 last:border-0">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-primary font-mono text-sm">{String(i + 1).padStart(2, '0')}</span>
                {section.title}
              </h2>
              <div className="text-secondary text-sm leading-relaxed whitespace-pre-line">
                {section.text}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-surface-border text-center">
          <p className="text-secondary text-xs">
            &copy; {new Date().getFullYear()} Pro Corp S.A.S. — extranjeria@pro-corp.net
          </p>
        </div>
      </div>
    </main>
  );
}
