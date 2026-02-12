'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const articles = [
    {
        id: 1,
        title: "journal.a1.title",
        date: "Jan 15, 2025",
        category: "BPA"
    },
    {
        id: 2,
        title: "journal.a2.title",
        date: "Dec 20, 2024",
        category: "Platform"
    },
    {
        id: 3,
        title: "journal.a3.title",
        date: "Nov 28, 2024",
        category: "Methodology"
    },
    {
        id: 4,
        title: "journal.a4.title",
        date: "Nov 10, 2024",
        category: "IP2$"
    },
    {
        id: 5,
        title: "journal.a5.title",
        date: "Oct 22, 2024",
        category: "Legal Solutions"
    }
];

export default function Journal() {
    const { t } = useLanguage();
    return (
        <main className="min-h-screen bg-background-light dark:bg-background-dark pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-20">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 uppercase font-display text-neutral-dark dark:text-white">
                        {t('journal.title')}<span className="text-primary">.</span>
                    </h1>
                    <p className="max-w-xl text-lg text-neutral-gray dark:text-white/70 font-light leading-relaxed font-ui">
                        {t('journal.desc')}
                    </p>
                </header>

                <div className="space-y-4">
                    {articles.map((article) => (
                        <div key={article.id} className="group border-t border-neutral-dark/10 dark:border-white/10 py-12 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors px-4 -mx-4 rounded-sm">
                            <div className="mb-4 md:mb-0">
                                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">{article.category}</span>
                                <h2 className="text-3xl md:text-4xl font-display font-bold uppercase text-neutral-dark dark:text-white group-hover:text-primary transition-colors">
                                    {t(article.title)}
                                </h2>
                            </div>
                            <div className="text-neutral-gray dark:text-gray-500 font-ui text-sm uppercase tracking-widest">
                                {article.date}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
