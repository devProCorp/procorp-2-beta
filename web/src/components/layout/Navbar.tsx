'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

// Bandera circular del país que representa cada idioma (ES → Colombia, PT → Brasil)
const LangFlag = ({ lang }: { lang: string }) => {
    if (lang === 'es') {
        return (
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
                <defs><clipPath id="flag-co"><circle cx="12" cy="12" r="12" /></clipPath></defs>
                <g clipPath="url(#flag-co)">
                    <rect width="24" height="12" fill="#FCD116" />
                    <rect y="12" width="24" height="6" fill="#003893" />
                    <rect y="18" width="24" height="6" fill="#CE1126" />
                </g>
            </svg>
        );
    }
    if (lang === 'pt') {
        return (
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
                <defs><clipPath id="flag-br"><circle cx="12" cy="12" r="12" /></clipPath></defs>
                <g clipPath="url(#flag-br)">
                    <rect width="24" height="24" fill="#009C3B" />
                    <path d="M12 3.5 20.5 12 12 20.5 3.5 12Z" fill="#FFDF00" />
                    <circle cx="12" cy="12" r="4.2" fill="#002776" />
                </g>
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
            <defs><clipPath id="flag-us"><circle cx="12" cy="12" r="12" /></clipPath></defs>
            <g clipPath="url(#flag-us)">
                <rect width="24" height="24" fill="#fff" />
                {[0, 2, 4, 6, 8, 10, 12].map((i) => (
                    <rect key={i} y={i * (24 / 13)} width="24" height={24 / 13} fill="#B22234" />
                ))}
                <rect width="11" height={24 * (7 / 13)} fill="#3C3B6E" />
                {[2, 5.5, 9].flatMap((cx) => [2, 5.5, 9].map((cy) => (
                    <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.8" fill="#fff" />
                )))}
            </g>
        </svg>
    );
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { lang, toggleLang, t } = useLanguage();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const linksBefore = [
        { name: t('nav.home'), href: '/' },
        { name: t('nav.about'), href: '/about' },
    ];
    // Categoría SOLUTIONS: agrupa los dos pilares
    const solutionItems = [
        { name: t('nav.growth'), href: '/studio' },
        { name: t('nav.legal'), href: '/projects' },
    ];
    const linksAfter = [
        { name: t('nav.projects'), href: 'https://inversion.pro-corp.net', external: true },
        { name: t('nav.blog'), href: '/journal' },
        { name: t('nav.contact'), href: '/contact' },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-surface-border/50 bg-background-dark/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background-dark/60">
            <div className="flex h-20 items-center justify-between px-4 md:px-10 max-w-[1440px] mx-auto w-full">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image src="/brand/Signature_PCP.png" alt="Pro Corp" width={160} height={40} className="h-10 w-auto object-contain" priority />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8">
                    {linksBefore.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-semibold uppercase tracking-wide transition-colors ${isActive(link.href)
                                    ? 'text-white text-shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {/* SOLUTIONS: desplegable con los dos pilares */}
                    <div className="relative group">
                        <button
                            type="button"
                            className={`flex items-center gap-1 text-sm font-semibold uppercase tracking-wide transition-colors ${solutionItems.some((l) => isActive(l.href))
                                    ? 'text-white text-shadow-sm'
                                    : 'text-gray-400 group-hover:text-white'
                                }`}
                        >
                            {t('nav.solutions')}
                            <span className="material-symbols-outlined text-base leading-none transition-transform group-hover:rotate-180">expand_more</span>
                        </button>
                        <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                            <div className="min-w-[260px] rounded-xl border border-surface-border bg-background-dark/95 p-2 shadow-2xl backdrop-blur-xl">
                                {solutionItems.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`block rounded-lg px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${isActive(link.href)
                                                ? 'text-white bg-surface-dark'
                                                : 'text-gray-400 hover:bg-surface-dark hover:text-white'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    {linksAfter.map((link) =>
                        link.external ? (
                            <a
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-semibold uppercase tracking-wide text-gray-400 transition-colors hover:text-white"
                            >
                                {link.name}
                            </a>
                        ) : (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-semibold uppercase tracking-wide transition-colors ${isActive(link.href)
                                        ? 'text-white text-shadow-sm'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        )
                    )}
                </div>

                {/* Right side: CTA + Lang + Mobile */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleLang}
                        className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] border border-surface-border rounded-lg px-3 py-1.5 text-gray-400 hover:text-white hover:border-primary/50 hover:bg-surface-dark transition-all"
                    >
                        <LangFlag lang={lang} />
                        {lang.toUpperCase()}
                    </button>
                    <a
                        href="https://www.pro-corp.net/login/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden md:flex cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-primary hover:bg-primary-light text-white text-[11px] font-bold uppercase tracking-[0.2em] glow-primary glow-primary-hover transition-all border border-primary-light/30"
                    >
                        <span className="truncate">{t('nav.login')}</span>
                    </a>
                    <button
                        className="lg:hidden text-white p-1 rounded-md focus-visible:ring-2 focus-visible:ring-primary"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-expanded={isOpen}
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 top-20 z-40 bg-background-dark h-screen flex flex-col p-8 lg:hidden"
                    >
                        <div className="flex flex-col space-y-4 mt-8">
                            {linksBefore.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`font-condensed text-lg font-semibold uppercase tracking-wide transition-colors ${isActive(link.href) ? 'text-primary' : 'text-white hover:text-primary'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {/* SOLUTIONS: grupo con los dos pilares */}
                            <div>
                                <p className="font-condensed text-lg font-semibold uppercase tracking-wide text-gray-500">{t('nav.solutions')}</p>
                                <div className="mt-3 flex flex-col space-y-3 border-l border-surface-border pl-4">
                                    {solutionItems.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`font-condensed text-lg font-semibold uppercase tracking-wide transition-colors ${isActive(link.href) ? 'text-primary' : 'text-white hover:text-primary'
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            {linksAfter.map((link) =>
                                link.external ? (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setIsOpen(false)}
                                        className="font-condensed text-lg font-semibold uppercase tracking-wide text-white transition-colors hover:text-primary"
                                    >
                                        {link.name}
                                    </a>
                                ) : (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`font-condensed text-lg font-semibold uppercase tracking-wide transition-colors ${isActive(link.href) ? 'text-primary' : 'text-white hover:text-primary'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                )
                            )}
                            <a
                                href="https://www.pro-corp.net/login/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsOpen(false)}
                                className="font-condensed text-lg font-semibold uppercase tracking-wide text-primary mt-4"
                            >
                                {t('nav.login')}
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
