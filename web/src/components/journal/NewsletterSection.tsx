'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function NewsletterSection() {
  const { t } = useLanguage();

  return (
    <section className="rounded-2xl bg-surface-dark border border-surface-border p-8 md:p-12 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{t('journal.newsletter.title')}</h2>
          <p className="text-secondary font-light">{t('journal.newsletter.desc')}</p>
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <label htmlFor="newsletter-email" className="sr-only">{t('journal.newsletter.placeholder')}</label>
          <input
            id="newsletter-email"
            className="h-12 px-4 rounded-lg bg-background-dark border border-surface-border text-white placeholder:text-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none min-w-[300px]"
            placeholder={t('journal.newsletter.placeholder')}
            type="email"
          />
          <button className="h-12 px-6 rounded-lg bg-primary hover:bg-primary-light text-white font-bold transition-all shadow-lg shadow-primary/20 whitespace-nowrap uppercase tracking-wide text-sm">
            {t('journal.newsletter.button')}
          </button>
        </div>
      </div>
    </section>
  );
}
