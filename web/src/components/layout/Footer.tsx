'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const FooterMap = dynamic(() => import('./FooterMap'), { ssr: false });

const offices = [
    {
        key: 'bogota',
        icon: 'location_city',
        mapUrl: 'https://maps.google.com/?q=4.703564,-74.029023',
        showMap: true,
    },
    {
        key: 'madrid',
        icon: 'flight',
        mapUrl: 'https://maps.google.com/?q=Calle+Jorge+Juan+30+Madrid+Spain',
        showMap: false,
    },
    {
        key: 'contact',
        icon: 'contact_phone',
        mapUrl: 'https://wa.me/573009292911',
        showMap: false,
    },
];

const Footer = () => {
    const { t } = useLanguage();
    const [mapOpen, setMapOpen] = useState(false);

    return (
        <footer className="bg-transparent border-t border-surface-border/50 text-secondary py-12 px-4 md:px-10 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen"></div>
            <div className="max-w-[1440px] mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
                    {/* Logo + Desc */}
                    <div className="md:col-span-3">
                        <div className="mb-4">
                            <Image src="https://www.pro-corp.net/wp-content/uploads/2023/07/Signature_PCP.png" alt="Pro Corp" width={140} height={35} className="h-9 w-auto object-contain" />
                        </div>
                        <p className="text-sm leading-relaxed mb-4 font-medium text-secondary">
                            {t('footer.desc')}
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.linkedin.com/company/procorp-corporate-development" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors" aria-label="LinkedIn">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </a>
                            <a href="https://www.instagram.com/pro.corp" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors" aria-label="Instagram">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Links columns */}
                    <div className="md:col-span-2">
                        <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">{t('footer.company')}</h4>
                        <ul className="flex flex-col gap-2.5 text-sm font-medium">
                            <li><Link href="/about" className="hover:text-primary transition-colors">{t('footer.about')}</Link></li>
                            <li><Link href="/journal" className="hover:text-primary transition-colors">{t('footer.blog')}</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">{t('footer.contact')}</Link></li>
                        </ul>
                    </div>
                    <div className="md:col-span-2">
                        <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">{t('footer.services')}</h4>
                        <ul className="flex flex-col gap-2.5 text-sm font-medium">
                            <li><Link href="/projects" className="hover:text-primary transition-colors">{t('footer.legal.solutions')}</Link></li>
                            <li><Link href="/studio" className="hover:text-primary transition-colors">{t('footer.legal.growth')}</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">{t('footer.legal.consulting')}</Link></li>
                        </ul>
                    </div>
                    {/* Offices */}
                    <div className="md:col-span-5">
                        <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">{t('footer.offices')}</h4>
                        <div className="flex flex-col gap-3">
                            {offices.map((office) => (
                                <button
                                    key={office.key}
                                    onClick={() => {
                                        if (office.showMap) {
                                            setMapOpen(true);
                                        } else {
                                            window.open(office.mapUrl, '_blank');
                                        }
                                    }}
                                    className="group flex items-center gap-3 text-left rounded-xl border border-surface-border/50 bg-surface-dark/30 hover:border-primary/30 hover:bg-surface-dark/60 px-4 py-3 transition-all cursor-pointer"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">{office.icon}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white text-sm font-semibold leading-tight">
                                            {t(`footer.office.${office.key}`)}
                                            <span className="text-secondary font-normal text-xs ml-1.5">{t(`footer.office.${office.key}.label`)}</span>
                                        </p>
                                        <p className="text-secondary text-xs truncate mt-0.5">
                                            {t(`footer.office.${office.key}.${office.key === 'contact' ? 'detail' : 'address'}`)}
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-[16px] text-gray-600 group-hover:text-primary ml-auto shrink-0 transition-colors">
                                        {office.showMap ? 'map' : 'open_in_new'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-surface-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
                    <p>&copy; {new Date().getFullYear()} Pro Corp. {t('footer.rights')}</p>
                    <div className="flex items-center gap-4">
                        <Link href="/privacy" className="text-secondary hover:text-primary transition-colors">{t('footer.legal.privacy')}</Link>
                        <span className="text-surface-border">·</span>
                        <Link href="/privacy" className="text-secondary hover:text-primary transition-colors">{t('footer.legal.terms')}</Link>
                        <span className="text-surface-border">·</span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> {t('footer.system')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Map Modal */}
            <AnimatePresence>
                {mapOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                        onClick={() => setMapOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', duration: 0.4 }}
                            className="relative w-full max-w-3xl h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-surface-border/50 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FooterMap />
                            <button
                                onClick={() => setMapOpen(false)}
                                className="absolute top-4 right-4 z-[10000] flex items-center gap-1.5 bg-background-dark/80 backdrop-blur-md border border-surface-border rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary hover:border-primary transition-all"
                            >
                                <span className="material-symbols-outlined text-[16px]">close</span>
                                {t('footer.map.close')}
                            </button>
                            <div className="absolute bottom-4 left-4 z-[10000] flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary animate-ping"></div>
                                <div className="h-2 w-2 rounded-full bg-primary absolute"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-black/60 px-3 py-1.5 rounded border border-white/10 backdrop-blur-md ml-2">
                                    {t('footer.location.address')} — Bogotá
                                </span>
                            </div>
                            <a
                                href="https://maps.google.com/?q=4.703564,-74.029023"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute bottom-4 right-4 z-[10000] inline-flex items-center gap-1.5 bg-primary hover:bg-primary-light border border-primary-light/30 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all"
                            >
                                {t('footer.location.cta')}
                                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </footer>
    );
};

export default Footer;
