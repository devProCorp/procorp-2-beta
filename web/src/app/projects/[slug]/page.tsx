'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { getServiceBySlug, getNextService } from '@/lib/services';

export default function ProjectDetail() {
    const params = useParams();
    const slug = params.slug as string;
    const { t } = useLanguage();

    const service = getServiceBySlug(slug);
    if (!service) notFound();

    const next = getNextService(slug);

    return (
        <main className="min-h-screen bg-background-light dark:bg-background-dark pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Back */}
                <div className="mb-12">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-sm font-ui uppercase tracking-widest text-neutral-gray dark:text-gray-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">arrow_back</span>
                        {t('svc.back')}
                    </Link>
                </div>

                {/* Header */}
                <header className="mb-20">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-xl">{service.icon}</span>
                        </span>
                        <span className="text-primary font-bold text-xs uppercase tracking-[0.4em] font-display">
                            {t(service.description)}
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 uppercase font-display text-neutral-dark dark:text-white leading-[0.9]">
                        {t(service.title)}
                    </h1>

                    <p className="max-w-2xl text-lg text-neutral-gray dark:text-white/60 font-light leading-relaxed font-ui">
                        {t(service.detail)}
                    </p>
                </header>

                <div className="space-y-24">
                    {/* Hero Image */}
                    <div className="w-full h-[60vh] relative overflow-hidden rounded-sm">
                        <Image
                            src={service.heroImage}
                            alt={t(service.title)}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 1280px"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/10" />
                    </div>

                    {/* Challenge & Solution */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                        <div>
                            <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] font-display block mb-4">
                                {t('svc.challenge')}
                            </span>
                            <p className="font-ui text-lg text-neutral-gray dark:text-gray-400 leading-relaxed">
                                {t(`svc.${service.id}.challenge`)}
                            </p>
                        </div>
                        <div>
                            <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] font-display block mb-4">
                                {t('svc.solution')}
                            </span>
                            <p className="font-ui text-lg text-neutral-gray dark:text-gray-400 leading-relaxed">
                                {t(`svc.${service.id}.solution`)}
                            </p>
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] font-display block mb-10">
                            {t('svc.capabilities')}
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {service.features.map((feat, i) => (
                                <div key={i} className="border-t border-neutral-dark/10 dark:border-white/10 pt-8">
                                    <span className="text-3xl font-bold text-primary/30 font-display block mb-3">
                                        0{i + 1}
                                    </span>
                                    <h3 className="text-lg font-bold uppercase tracking-wide text-neutral-dark dark:text-white font-display mb-3">
                                        {t(`${feat}.title`)}
                                    </h3>
                                    <p className="text-sm text-neutral-gray dark:text-gray-500 font-ui leading-relaxed">
                                        {t(`${feat}.desc`)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gallery */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {service.galleryImages.map((img, i) => (
                            <div key={i} className="relative aspect-[4/5] overflow-hidden rounded-sm">
                                <Image
                                    src={img}
                                    alt={`${t(service.title)} — ${i + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 640px"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Service */}
                <div className="mt-32 pt-20 border-t border-neutral-dark/10 dark:border-white/10 text-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-gray dark:text-gray-500 mb-4 block font-ui">
                        {t('svc.next')}
                    </span>
                    <Link
                        href={`/projects/${next.slug}`}
                        className="text-4xl md:text-6xl font-display font-bold uppercase text-neutral-dark dark:text-white hover:text-primary transition-colors"
                    >
                        {t(next.title)}
                    </Link>
                </div>
            </div>
        </main>
    );
}
