'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Servicios', href: '/projects' },
        { name: 'Nosotros', href: '/studio' },
        { name: 'Blog', href: '/journal' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md py-4 border-b border-primary/10' : 'py-6 bg-transparent mix-blend-difference text-white'
                }`}
        >
            <div className="px-8 max-w-[1920px] mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-sm transition-colors ${scrolled ? 'bg-primary text-white' : 'bg-white text-black'}`}>
                        <span className="font-bold text-lg font-display">P</span>
                    </div>
                    <span className={`font-bold text-xl tracking-tighter uppercase font-display ${scrolled ? 'text-neutral-dark dark:text-white' : 'text-white'}`}>
                        PRO CORP
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-12">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest font-ui ${scrolled ? 'text-neutral-dark dark:text-white' : 'text-white'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/contact"
                        className={`text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest border px-6 py-2 rounded-sm hover:bg-white hover:text-black transition-all font-ui ${scrolled
                                ? 'border-neutral-dark dark:border-white text-neutral-dark dark:text-white'
                                : 'border-white text-white'
                            }`}
                    >
                        Contacto
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
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
                                    key={link.name}
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
                                Contacto
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
