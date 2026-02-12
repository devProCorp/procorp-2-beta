'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { lang, toggleLang, t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: t('nav.services'), href: '/projects' },
        { name: t('nav.about'), href: '/studio' },
        { name: t('nav.journal'), href: '/journal' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md py-4 border-b border-primary/10' : 'py-6 bg-transparent mix-blend-difference text-white'
                }`}
        >
            <div className="px-8 max-w-[1920px] mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="relative h-10 w-40 block">
                    <img
                        src="/logo-blanco.png"
                        alt="PRO CORP"
                        className={`absolute inset-0 h-full w-auto object-contain transition-opacity duration-300 ${scrolled ? 'opacity-0' : 'opacity-100'}`}
                    />
                    <img
                        src="/logo-negro.png"
                        alt="PRO CORP"
                        className={`absolute inset-0 h-full w-auto object-contain transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-12">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest font-ui ${scrolled ? 'text-neutral-dark dark:text-white' : 'text-white'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/contact"
                        className={`text-sm font-medium hover:text-primary uppercase tracking-widest border px-6 py-2 rounded-sm transition-all font-ui ${scrolled
                                ? 'border-neutral-dark dark:border-white text-neutral-dark dark:text-white hover:bg-white hover:text-black'
                                : 'border-white text-white hover:bg-white hover:text-black'
                            }`}
                    >
                        {t('nav.contact')}
                    </Link>

                    {/* Language Toggle */}
                    <button
                        onClick={toggleLang}
                        className={`text-xs font-bold uppercase tracking-widest font-ui border rounded-sm px-3 py-1.5 transition-all ${scrolled
                                ? 'border-neutral-dark/30 dark:border-white/30 text-neutral-dark dark:text-white hover:border-primary hover:text-primary'
                                : 'border-white/40 text-white hover:border-white hover:text-white'
                            }`}
                    >
                        {lang === 'en' ? 'ES' : 'EN'}
                    </button>
                </div>

                {/* Mobile Menu Button + Lang Toggle */}
                <div className="md:hidden flex items-center space-x-4">
                    <button
                        onClick={toggleLang}
                        className={`text-xs font-bold uppercase tracking-widest font-ui border rounded-sm px-2.5 py-1 transition-all ${scrolled
                                ? 'border-neutral-dark/30 dark:border-white/30 text-neutral-dark dark:text-white'
                                : 'border-white/40 text-white'
                            }`}
                    >
                        {lang === 'en' ? 'ES' : 'EN'}
                    </button>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`${scrolled ? 'text-neutral-dark dark:text-white' : 'text-white'} hover:text-primary transition-colors`}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 top-[70px] z-40 bg-background-light dark:bg-background-dark h-screen flex flex-col p-8 md:hidden"
                    >
                        <div className="flex flex-col space-y-8 mt-12">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-4xl font-bold font-display uppercase tracking-tight text-neutral-dark dark:text-white hover:text-primary transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/contact"
                                onClick={() => setIsOpen(false)}
                                className="text-4xl font-bold font-display uppercase tracking-tight text-primary mt-8"
                            >
                                {t('nav.contact')}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
