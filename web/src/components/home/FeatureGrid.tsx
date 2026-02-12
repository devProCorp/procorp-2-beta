'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const FeatureGrid = () => {
    const { t } = useLanguage();

    return (
        <section className="bg-background-light dark:bg-background-dark/50 py-24 border-y border-gray-100 dark:border-white/5">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="p-8 border-l-2 border-primary/20 hover:border-primary transition-colors group">
                        <h3 className="text-4xl font-bold mb-4 dark:text-white font-display group-hover:text-primary transition-colors">01</h3>
                        <h4 className="text-xl font-bold mb-4 uppercase tracking-wide dark:text-white font-display">{t('features.01.title')}</h4>
                        <p className="text-gray-500 dark:text-gray-400 font-ui leading-relaxed">{t('features.01.desc')}</p>
                    </div>
                    <div className="p-8 border-l-2 border-primary/20 hover:border-primary transition-colors group">
                        <h3 className="text-4xl font-bold mb-4 dark:text-white font-display group-hover:text-primary transition-colors">02</h3>
                        <h4 className="text-xl font-bold mb-4 uppercase tracking-wide dark:text-white font-display">{t('features.02.title')}</h4>
                        <p className="text-gray-500 dark:text-gray-400 font-ui leading-relaxed">{t('features.02.desc')}</p>
                    </div>
                    <div className="p-8 border-l-2 border-primary/20 hover:border-primary transition-colors group">
                        <h3 className="text-4xl font-bold mb-4 dark:text-white font-display group-hover:text-primary transition-colors">03</h3>
                        <h4 className="text-xl font-bold mb-4 uppercase tracking-wide dark:text-white font-display">{t('features.03.title')}</h4>
                        <p className="text-gray-500 dark:text-gray-400 font-ui leading-relaxed">{t('features.03.desc')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureGrid;
