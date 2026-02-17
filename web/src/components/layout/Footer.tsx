'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="bg-[#0f0708] border-t border-surface-border text-secondary py-12 px-4 md:px-10">
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
                            <a href="https://www.linkedin.com/company/procorp-corporate-development" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">public</span>
                            </a>
                            <a href="https://www.instagram.com/pro.corp" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">work</span>
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
                            <li><a href="#" className="hover:text-primary transition-colors">{t('footer.legal.privacy')}</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">{t('footer.legal.terms')}</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">{t('footer.legal.cookies')}</a></li>
                        </ul>
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
