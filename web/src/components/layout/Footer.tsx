'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/context/LanguageContext';

const FooterMap = dynamic(() => import('./FooterMap'), { ssr: false });

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="bg-transparent border-t border-surface-border/50 text-secondary py-16 px-4 md:px-10 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen"></div>
            <div className="max-w-[1440px] mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="mb-6">
                            <Image src="https://www.pro-corp.net/wp-content/uploads/2023/07/Signature_PCP.png" alt="Pro Corp" width={140} height={35} className="h-9 w-auto object-contain" />
                        </div>
                        <p className="text-sm leading-relaxed mb-6 font-medium text-secondary">
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
                    <div>
                        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">{t('footer.company')}</h4>
                        <ul className="flex flex-col gap-3 text-sm font-medium">
                            <li><Link href="/about" className="hover:text-primary transition-colors">{t('footer.about')}</Link></li>
                            <li><Link href="/journal" className="hover:text-primary transition-colors">{t('footer.blog')}</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">{t('footer.contact')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">{t('footer.services')}</h4>
                        <ul className="flex flex-col gap-3 text-sm font-medium">
                            <li><Link href="/projects" className="hover:text-primary transition-colors">{t('footer.legal.solutions')}</Link></li>
                            <li><Link href="/studio" className="hover:text-primary transition-colors">{t('footer.legal.growth')}</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">{t('footer.legal.consulting')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">{t('footer.legal.title')}</h4>
                        <ul className="flex flex-col gap-3 text-sm font-medium">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">{t('footer.legal.privacy')}</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">{t('footer.legal.terms')}</Link></li>
                            <li><Link href="/cookies" className="hover:text-primary transition-colors">{t('footer.legal.cookies')}</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mb-12 rounded-[2rem] overflow-hidden border border-surface-border/50 relative group glass-panel shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12">
                        {/* Map */}
                        <div className="lg:col-span-8 relative h-[220px] lg:h-[240px]">
                            <FooterMap />
                        </div>
                        {/* Info Panel */}
                        <div className="lg:col-span-4 bg-background-dark/60 backdrop-blur-xl p-10 flex flex-col justify-center gap-6 border-t lg:border-t-0 lg:border-l border-surface-border/50">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(206,16,38,0.1)]">
                                    <span className="material-symbols-outlined text-primary-light text-[24px]">location_on</span>
                                </div>
                                <h4 className="text-white font-bold text-[11px] uppercase tracking-[0.2em]">{t('footer.location')}</h4>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-white font-semibold text-sm">{t('footer.location.address')}</p>
                                <p className="text-secondary text-sm">{t('footer.location.city')}</p>
                            </div>
                            <div className="flex items-center gap-2 text-secondary text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span>09:00 – 18:00 CET</span>
                            </div>
                            <a
                                href="https://maps.google.com/?q=4.703564,-74.029023"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-light transition-colors mt-1 group/link"
                            >
                                {t('footer.location.cta')}
                                <span className="material-symbols-outlined text-sm transition-transform group-hover/link:translate-x-0.5">arrow_forward</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-surface-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
                    <p>&copy; {new Date().getFullYear()} Pro Corp. {t('footer.rights')}</p>
                    <div className="flex gap-6">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> {t('footer.system')}
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
