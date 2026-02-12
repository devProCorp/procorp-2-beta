'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Contact() {
    const { t } = useLanguage();
    return (
        <main className="flex-grow flex items-center justify-center py-32 px-4 md:px-8 min-h-screen bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Left Side: Information & Offices */}
                <div className="space-y-12">
                    <div className="space-y-6">
                        <div className="w-12 h-1 bg-primary"></div>
                        <h1 className="font-bold text-5xl md:text-6xl text-neutral-dark dark:text-white leading-tight font-display">
                            {t('contact.title.1')} <br /><span className="text-primary">{t('contact.title.2')}</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed font-ui">
                            {t('contact.desc')}
                        </p>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/5 rounded-xl -rotate-1 group-hover:rotate-0 transition-transform"></div>
                        <div className="relative bg-white dark:bg-slate-900/50 p-8 rounded-xl border border-primary/10 space-y-8">
                            <h2 className="font-bold text-xl uppercase tracking-wider border-b border-primary/20 pb-4 font-display">{t('contact.offices')}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <h3 className="font-bold text-primary font-display">{t('contact.hq')}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-ui">
                                        World Trade Center, Torre C, Of. 1013<br />
                                        PBX: +57 601 915 6579<br />
                                        gestion@pro-corp.net
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-primary font-display">{t('contact.spain')}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-ui">
                                        {t('contact.spain.type')}<br />
                                        WhatsApp: +57 300 929 0858<br />
                                        www.pro-ley.es
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-primary font-display">{t('contact.portugal')}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-ui">
                                        {t('contact.portugal.type')}<br />
                                        WhatsApp: +57 311 516 3806<br />
                                        lisbon@pro-corp.net
                                    </p>
                                </div>
                            </div>

                            {/* Minimal Map Background */}
                            <div className="mt-8 overflow-hidden rounded-lg h-40 relative opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    className="w-full h-full object-cover"
                                    alt="Pro Corp Global Presence"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5J3kOx3dOI_ycRlwZFpw1k-henhnkKm2JG2q9VsRUlL3neBfEIne3-MKV-VkRC4tmM3MvdG60JeLWI2rcxoEW5pwCGT07Yl6nC1mevx9FPjKhhTvxiWa0Nuh7REtUmLRjrvca3RrHX5TSJsT2SlJdyiGPjksXqbE_6imZgo0g7nGYkPxZDsdxB2ctOGi3Fdy37rV6MXUZmsKrG3xBDXlahJaa5vUUmYuwAAVzD5zdn7hySD17VztfYF3mESHazEdJ5tTY4hsbFvs"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-background-dark to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Contact Form */}
                <div className="bg-white dark:bg-slate-900/40 p-8 md:p-12 rounded-xl shadow-2xl shadow-primary/5 border border-primary/5">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 font-ui">{t('contact.form.name')}</label>
                                <input
                                    className="form-input-custom w-full p-4 rounded-lg font-ui text-slate-800 dark:text-white placeholder:text-slate-400"
                                    placeholder={t('contact.form.name.placeholder')}
                                    type="text"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 font-ui">{t('contact.form.company')}</label>
                                <input
                                    className="form-input-custom w-full p-4 rounded-lg font-ui text-slate-800 dark:text-white placeholder:text-slate-400"
                                    placeholder={t('contact.form.company.placeholder')}
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 font-ui">{t('contact.form.email')}</label>
                            <input
                                className="form-input-custom w-full p-4 rounded-lg font-ui text-slate-800 dark:text-white placeholder:text-slate-400"
                                placeholder="email@example.com"
                                type="email"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 font-ui">{t('contact.form.vertical')}</label>
                                <select
                                    className="form-input-custom w-full p-4 rounded-lg font-ui text-slate-800 dark:text-white appearance-none cursor-pointer"
                                    defaultValue=""
                                >
                                    <option disabled value="">{t('contact.form.vertical.placeholder')}</option>
                                    <option>{t('contact.form.vertical.1')}</option>
                                    <option>{t('contact.form.vertical.2')}</option>
                                    <option>{t('contact.form.vertical.3')}</option>
                                    <option>{t('contact.form.vertical.4')}</option>
                                    <option>{t('contact.form.vertical.5')}</option>
                                    <option>{t('contact.form.vertical.other')}</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 font-ui">{t('contact.form.how')}</label>
                                <select
                                    className="form-input-custom w-full p-4 rounded-lg font-ui text-slate-800 dark:text-white appearance-none cursor-pointer"
                                    defaultValue=""
                                >
                                    <option disabled value="">{t('contact.form.how.placeholder')}</option>
                                    <option>{t('contact.form.how.social')}</option>
                                    <option>{t('contact.form.how.google')}</option>
                                    <option>{t('contact.form.how.referral')}</option>
                                    <option>{t('contact.form.how.event')}</option>
                                    <option>{t('contact.form.how.other')}</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 font-ui">{t('contact.form.message')}</label>
                            <textarea
                                className="form-input-custom w-full p-4 rounded-lg font-ui text-slate-800 dark:text-white placeholder:text-slate-400 resize-none"
                                placeholder={t('contact.form.message.placeholder')}
                                rows={4}
                            ></textarea>
                        </div>

                        <button
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-sm transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-primary/20 uppercase tracking-widest text-sm font-ui"
                            type="submit"
                        >
                            {t('contact.form.submit')}
                        </button>
                        <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-ui">
                            {t('contact.form.disclaimer')}
                        </p>
                    </form>
                </div>
            </div>
        </main>
    );
}
