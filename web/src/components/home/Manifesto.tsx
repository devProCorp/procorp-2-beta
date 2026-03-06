'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const Manifesto = () => {
    const { t } = useLanguage();

    return (
        <section className="bg-transparent py-32 px-8 md:px-24 relative overflow-hidden border-y border-surface-border">
            <div className="absolute inset-0 bg-surface-dark/30 backdrop-blur-md -z-10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 mix-blend-screen"></div>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-12 gap-8">
                    <div className="hidden lg:block col-span-1">
                        <div className="rotate-90 origin-left mt-24 whitespace-nowrap">
                            <span className="text-primary font-bold text-xs uppercase tracking-[0.8em] font-display">{t('manifesto.label.side')}</span>
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-11">
                        <header className="mb-20">
                            <span className="inline-flex items-center justify-center py-1.5 px-4 rounded-full border border-primary/20 bg-primary/10 text-[10px] text-primary-light font-bold uppercase tracking-[0.2em] mb-8 shadow-[0_0_15px_rgba(206,16,38,0.15)]">{t('manifesto.label')}</span>
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.05] tracking-tight drop-shadow-2xl">
                                {t('manifesto.title.1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-primary-dark italic whitespace-nowrap drop-shadow-[0_0_15px_rgba(206,16,38,0.4)]">{t('manifesto.title.accent1')}</span> <br />
                                {t('manifesto.title.2')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">{t('manifesto.title.accent2')}</span> <br />
                                {t('manifesto.title.3')}
                            </h2>
                        </header>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 border-t border-surface-border/50 pt-16 mt-8">
                            <div>
                                <p className="text-2xl md:text-3xl font-light text-gray-300 leading-relaxed border-l-4 border-primary pl-8">
                                    {t('manifesto.text')}
                                </p>
                            </div>
                            <div className="space-y-8 glass-panel p-10 rounded-[2rem] border border-surface-border/50 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/20 transition-colors duration-700 pointer-events-none"></div>
                                <p className="text-lg text-gray-400 font-light leading-relaxed relative z-10">{t('manifesto.p1')}</p>
                                <p className="text-lg text-gray-400 font-light leading-relaxed relative z-10">{t('manifesto.p2')}</p>
                                <div className="pt-8 relative z-10">
                                    <Link href="/studio" className="inline-flex items-center justify-center gap-3 h-14 px-8 rounded-xl bg-primary hover:bg-primary-light text-white font-bold transition-all glow-primary glow-primary-hover uppercase tracking-widest text-sm group/btn border border-primary-light/50 w-full sm:w-auto">
                                        <span>{t('manifesto.cta')}</span>
                                        <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Manifesto;
