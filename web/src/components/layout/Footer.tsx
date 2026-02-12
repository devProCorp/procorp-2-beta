'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-white dark:bg-background-dark py-20 px-8 border-t border-gray-100 dark:border-white/10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                <div>
                    <div className="mb-8">
                        <img
                            src="/logo-negro.png"
                            alt="PRO CORP"
                            className="h-10 w-auto object-contain"
                        />
                    </div>
                    <address className="not-italic text-gray-500 dark:text-gray-400 space-y-2 font-ui text-sm">
                        <p>World Trade Center, Torre C, Of. 1013</p>
                        <p>Bogotá, Colombia</p>
                    </address>
                </div>
                <div className="flex flex-wrap gap-12 font-ui">
                    <div className="space-y-4">
                        <h5 className="text-xs font-bold uppercase tracking-widest text-primary">{t('footer.contact')}</h5>
                        <a href="mailto:gestion@pro-corp.net" className="block text-xl text-neutral-dark dark:text-white hover:text-primary transition-colors font-display">
                            gestion@pro-corp.net
                        </a>
                        <p className="text-sm text-gray-500 dark:text-gray-400">+57 300 929 1891</p>
                    </div>
                    <div className="space-y-4">
                        <h5 className="text-xs font-bold uppercase tracking-widest text-primary">{t('footer.follow')}</h5>
                        <div className="flex space-x-6 text-gray-500 dark:text-gray-400 text-sm">
                            <a href="https://www.linkedin.com/company/procorp-corporate-development" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
                            <a href="https://www.instagram.com/pro.corp" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-50 dark:border-white/5 flex flex-col md:flex-row justify-between text-[10px] uppercase tracking-[0.2em] text-gray-400 font-ui">
                <span>&copy; {new Date().getFullYear()} PRO CORP SAS. {t('footer.rights')}</span>
                <span>www.pro-corp.net</span>
            </div>
        </footer>
    );
};

export default Footer;
