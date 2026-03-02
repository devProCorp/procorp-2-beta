'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Cookies() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-secondary hover:text-white text-sm font-medium transition-colors mb-10">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          {t('nav.home')}
        </Link>

        <div className="mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            {t('cookies.badge')}
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{t('cookies.title')}</h1>
          <p className="text-secondary text-sm">{t('cookies.updated')}</p>
        </div>

        <div className="bg-surface-dark border border-surface-border rounded-2xl p-8 md:p-12 mb-10">
          <p className="text-secondary leading-relaxed text-sm">{t('cookies.intro')}</p>
        </div>

        <div className="space-y-10">
          {/* What Are Cookies */}
          <section className="border-b border-surface-border pb-10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-primary font-mono text-sm">01</span>
              {t('cookies.s1.title')}
            </h2>
            <p className="text-secondary text-sm leading-relaxed">{t('cookies.s1.text')}</p>
          </section>

          {/* Types of Cookies */}
          <section className="border-b border-surface-border pb-10">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-primary font-mono text-sm">02</span>
              {t('cookies.s2.title')}
            </h2>
            <div className="space-y-6">
              <div className="bg-surface-dark border border-surface-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-primary text-lg">lock</span>
                  <h3 className="text-white font-bold">{t('cookies.s2.essential.title')}</h3>
                </div>
                <p className="text-secondary text-sm leading-relaxed">{t('cookies.s2.essential.text')}</p>
              </div>
              <div className="bg-surface-dark border border-surface-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-primary text-lg">analytics</span>
                  <h3 className="text-white font-bold">{t('cookies.s2.analytics.title')}</h3>
                </div>
                <p className="text-secondary text-sm leading-relaxed">{t('cookies.s2.analytics.text')}</p>
              </div>
              <div className="bg-surface-dark border border-surface-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-primary text-lg">tune</span>
                  <h3 className="text-white font-bold">{t('cookies.s2.functional.title')}</h3>
                </div>
                <p className="text-secondary text-sm leading-relaxed">{t('cookies.s2.functional.text')}</p>
              </div>
            </div>
          </section>

          {/* Cookie Details Table */}
          <section className="border-b border-surface-border pb-10">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-primary font-mono text-sm">03</span>
              {t('cookies.s3.title')}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border">
                    <th className="text-left text-secondary font-bold uppercase tracking-wider text-xs py-3 pr-4">Cookie</th>
                    <th className="text-left text-secondary font-bold uppercase tracking-wider text-xs py-3 pr-4">{t('cookies.badge') === 'Legal' ? 'Type' : 'Tipo'}</th>
                    <th className="text-left text-secondary font-bold uppercase tracking-wider text-xs py-3">{t('cookies.badge') === 'Legal' ? 'Duration' : 'Duración'}</th>
                  </tr>
                </thead>
                <tbody className="text-secondary">
                  {[t('cookies.s3.c1'), t('cookies.s3.c2'), t('cookies.s3.c3')].map((row, i) => {
                    const parts = row.split(' — ');
                    return (
                      <tr key={i} className="border-b border-surface-border/50">
                        <td className="py-3 pr-4 text-white font-mono text-xs">{parts[0]}</td>
                        <td className="py-3 pr-4">{parts[1]}</td>
                        <td className="py-3">{parts[2]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* How to Manage */}
          <section className="border-b border-surface-border pb-10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-primary font-mono text-sm">04</span>
              {t('cookies.s4.title')}
            </h2>
            <div className="text-secondary text-sm leading-relaxed whitespace-pre-line">{t('cookies.s4.text')}</div>
          </section>

          {/* Changes */}
          <section className="border-b border-surface-border pb-10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-primary font-mono text-sm">05</span>
              {t('cookies.s5.title')}
            </h2>
            <p className="text-secondary text-sm leading-relaxed">{t('cookies.s5.text')}</p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-primary font-mono text-sm">06</span>
              {t('cookies.s6.title')}
            </h2>
            <p className="text-secondary text-sm leading-relaxed">{t('cookies.s6.text')}</p>
          </section>
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
