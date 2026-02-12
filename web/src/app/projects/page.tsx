'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { services } from '@/lib/services';

export default function ProjectsIndex() {
    const { t } = useLanguage();
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="pt-32 pb-20 px-6 min-h-screen bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="mb-20">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 uppercase font-display text-neutral-dark dark:text-white">
                        {t('projects.title')}<span className="text-primary">.</span>
                    </h1>
                    <p className="max-w-xl text-lg text-neutral-gray dark:text-white/70 font-light leading-relaxed font-ui">
                        {t('projects.desc')}
                    </p>
                </header>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-6 border-y border-neutral-dark/10 dark:border-white/10 mb-12 gap-6">
                    <div className="flex flex-wrap gap-8 font-ui text-[11px] font-semibold tracking-[0.2em] uppercase">
                        <button className="text-primary border-b-2 border-primary pb-1">{t('projects.filter.all')}</button>
                        <button className="text-neutral-gray dark:text-white/60 hover:text-primary transition-colors pb-1">{t('projects.filter.legal')}</button>
                        <button className="text-neutral-gray dark:text-white/60 hover:text-primary transition-colors pb-1">{t('projects.filter.growth')}</button>
                        <button className="text-neutral-gray dark:text-white/60 hover:text-primary transition-colors pb-1">{t('projects.filter.engineering')}</button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-[10px] font-ui tracking-widest opacity-50 uppercase text-neutral-gray dark:text-white">{services.length} {t('projects.count')}</span>
                    </div>
                </div>

                {/* Service List */}
                <div className="space-y-0 relative">
                    {services.map((service) => (
                        <Link href={`/projects/${service.slug}`} key={service.id} className="block">
                            <div className="project-row group relative border-b border-neutral-dark/5 dark:border-white/5 py-12 flex items-center cursor-pointer overflow-hidden">
                                {/* Hover Preview Image */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-32 hidden lg:block project-image-preview pointer-events-none">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        alt={service.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                        src={service.image}
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row items-baseline w-full lg:pl-64">
                                    <span className="project-number text-primary font-display font-bold text-lg md:text-xl w-16">{service.id}</span>
                                    <div className="project-details flex flex-col md:flex-row md:items-center justify-between w-full">
                                        <h2 className="font-ui font-bold text-2xl md:text-4xl tracking-tight uppercase group-hover:text-primary transition-colors text-neutral-dark dark:text-white">
                                            {t(service.title)}
                                        </h2>
                                        <div className="font-ui font-light text-sm md:text-lg tracking-wide opacity-60 mt-2 md:mt-0 text-neutral-dark dark:text-white">
                                            {t(service.description)} <span className="mx-3 text-primary">&mdash;</span> {t(service.detail)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer Meta */}
                <div className="mt-20 flex flex-col md:flex-row items-center justify-between text-[10px] font-ui tracking-[0.3em] uppercase opacity-40 text-neutral-dark dark:text-white">
                    <div className="mb-4 md:mb-0">{t('projects.footer')}</div>
                    <div className="flex space-x-8">
                        <a className="hover:text-primary transition-colors" href="#">{t('projects.privacy')}</a>
                        <a className="hover:text-primary transition-colors" href="#">{t('projects.data')}</a>
                        <a className="hover:text-primary transition-colors" href="#">{t('projects.terms')}</a>
                    </div>
                </div>
            </div>

            {/* Floating Back to Top */}
            <div className={`fixed bottom-10 right-10 flex flex-col items-center space-y-4 transition-opacity duration-300 z-40 ${showBackToTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="w-px h-24 bg-primary/30"></div>
                <button
                    onClick={scrollToTop}
                    className="bg-primary text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
                >
                    <span className="material-symbols-outlined">arrow_upward</span>
                </button>
            </div>

            {/* Background Decoration */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-5">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[160px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-[160px]"></div>
            </div>
        </main>
    );
}
