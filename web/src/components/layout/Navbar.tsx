'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

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

    const navLinks = [
        { name: t('nav.home'), href: '/' },
        { name: t('nav.blog'), href: '/journal' },
        { name: t('nav.legal'), href: '/projects' },
        { name: t('nav.growth'), href: '/studio' },
        { name: t('nav.about'), href: '/about' },
        { name: t('nav.contact'), href: '/contact' },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-surface-border bg-background-dark/95 backdrop-blur-md">
            <div className="flex h-20 items-center justify-between px-4 md:px-10 max-w-[1440px] mx-auto w-full">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image src="https://www.pro-corp.net/wp-content/uploads/2023/07/Signature_PCP.png" alt="Pro Corp" width={160} height={40} className="h-10 w-auto object-contain" priority />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-semibold uppercase tracking-wide transition-colors ${
                                isActive(link.href)
                                    ? 'text-white'
                                    : 'text-secondary hover:text-white'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right side: CTA + Lang + Mobile */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleLang}
                        className="text-xs font-bold uppercase tracking-widest border border-surface-border rounded-lg px-3 py-1.5 text-secondary hover:text-white hover:border-primary transition-all"
                    >
                        {lang === 'en' ? 'ES' : 'EN'}
                    </button>
                    <Link
                        href="/login"
                        className="hidden md:flex cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-primary hover:bg-primary-light transition-colors text-white text-sm font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(206,16,38,0.4)]"
                    >
                        <span className="truncate">{t('nav.login')}</span>
                    </Link>
                    <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
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
                        <div className="flex flex-col space-y-6 mt-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-3xl font-bold uppercase tracking-tight transition-colors ${
                                        isActive(link.href) ? 'text-primary' : 'text-white hover:text-primary'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="text-3xl font-bold uppercase tracking-tight text-primary mt-4"
                            >
                                {t('nav.login')}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
