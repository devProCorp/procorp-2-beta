'use client';

import React from 'react';

export default function Studio() {
    return (
        <main className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Hero Section: Split Screen */}
            <section className="relative min-h-screen pt-20 flex flex-col md:flex-row overflow-hidden">
                {/* Left: Imagery */}
                <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-screen overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        alt="Oficinas PRO CORP"
                        className="absolute inset-0 w-full h-full object-cover monochrome-img"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfASzBgLrhWIyE8UmOOhjs7pfOsFEL8EhDc7Hlc5Frumknzj3cUXVUlwmgfoFuePsuoBGZG3RH_1jVpCXPeo0savLZi_MZopr6oYU6I3Q-Duz8ZMt8rvR3RjXGSA_Rsj6nm4-7zWtbXKwZE6uMX6Ral3B9Yyn9Lt3cvFINFTcWNlmZ0yECaHTgkVWzz5zgmvSnW4nboOVD05JXb3oHAmGHUO-etiJGwuCsH-Z0eh1oVgfaPvO4NPFegF5jZ1n6Cdcla5JMwmfF2C8"
                    />
                    <div className="absolute inset-0 bg-stone-900/10"></div>
                    {/* Diagonal Overlay Element */}
                    <div
                        className="absolute right-0 top-0 bottom-0 w-24 bg-background-light dark:bg-background-dark hidden md:block translate-x-12"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' }}
                    ></div>
                </div>

                {/* Right: Content */}
                <div className="w-full md:w-1/2 flex items-center px-8 md:px-20 py-20 bg-background-light dark:bg-background-dark relative">
                    <div className="max-w-xl">
                        <div className="w-12 h-1 bg-primary mb-8"></div>
                        <h1 className="text-5xl md:text-7xl font-bold text-primary mb-8 leading-tight uppercase tracking-tight">
                            Desarrollo corporativo <span className="block">integral</span>
                        </h1>
                        <div className="space-y-6 text-lg md:text-xl font-light leading-relaxed text-stone-600 dark:text-stone-400 font-ui">
                            <p>
                                PRO CORP Corporate Development es una organización global fundada en 2008, comprometida con empoderar a empresas, emprendedores y profesionales para que alcancen un crecimiento sostenible.
                            </p>
                            <p>
                                Combinamos experiencia legal internacional, estrategia de inversión y tecnologías propias para ofrecer soluciones personalizadas con transparencia, eficiencia y resultados medibles.
                            </p>
                        </div>
                        <div className="mt-12">
                            <button className="group flex items-center space-x-4 border-b-2 border-primary pb-2 hover:translate-x-2 transition-transform">
                                <span className="uppercase tracking-widest font-bold text-sm">Conoce nuestros servicios</span>
                                <span className="material-symbols-outlined group-hover:text-primary transition-colors">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Diagonal Accent Divider */}
            <div
                className="h-24 w-full bg-stone-100 dark:bg-stone-900/50"
                style={{ background: 'linear-gradient(115deg, transparent 75%, rgba(209, 16, 38, 0.05) 75.1%)' }}
            ></div>

            {/* Section: Services */}
            <section className="py-24 px-6 md:px-20 bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20 text-center">
                        <h2 className="text-sm font-bold tracking-[0.5em] uppercase text-stone-400 mb-4 font-ui">Nuestros Pilares</h2>
                        <h3 className="text-3xl md:text-4xl font-light">Soluciones para tu crecimiento global</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-px md:bg-stone-200 dark:md:bg-stone-800">
                        {/* Soluciones Legales */}
                        <div className="bg-background-light dark:bg-background-dark p-12 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors group">
                            <div className="mb-8">
                                <span
                                    className="material-symbols-outlined text-5xl text-primary"
                                    style={{ fontVariationSettings: "'wght' 100" }}
                                >
                                    gavel
                                </span>
                            </div>
                            <h4 className="text-2xl font-bold mb-4 uppercase tracking-tighter group-hover:text-primary transition-colors">01. Soluciones Legales</h4>
                            <p className="text-stone-600 dark:text-stone-400 font-light leading-relaxed mb-8 font-ui">
                                Facilitamos el acceso a la ciudadanía y residencia europea para latinoamericanos con acompañamiento jurídico integral de principio a fin.
                            </p>
                            <ul className="space-y-3 text-sm font-medium text-stone-500 uppercase tracking-wider font-ui">
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary mr-3 shrink-0"></span>Nacionalidad Sefardí</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary mr-3 shrink-0"></span>Golden Visa</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary mr-3 shrink-0"></span>Memoria Democrática</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary mr-3 shrink-0"></span>Visa Nómada Digital</li>
                            </ul>
                        </div>

                        {/* Inversión y Consultoría */}
                        <div className="bg-background-light dark:bg-background-dark p-12 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors group">
                            <div className="mb-8">
                                <span
                                    className="material-symbols-outlined text-5xl text-primary"
                                    style={{ fontVariationSettings: "'wght' 100" }}
                                >
                                    trending_up
                                </span>
                            </div>
                            <h4 className="text-2xl font-bold mb-4 uppercase tracking-tighter group-hover:text-primary transition-colors">02. Inversión</h4>
                            <p className="text-stone-600 dark:text-stone-400 font-light leading-relaxed mb-8 font-ui">
                                Estructuración de proyectos, modelajes financieros y acompañamiento legal para invertir en España y Europa con seguridad y visión estratégica.
                            </p>
                            <ul className="space-y-3 text-sm font-medium text-stone-500 uppercase tracking-wider font-ui">
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary mr-3 shrink-0"></span>Oportunidades Europa</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary mr-3 shrink-0"></span>Modelaje Financiero</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary mr-3 shrink-0"></span>Cierre de Fondos</li>
                            </ul>
                        </div>

                        {/* Automatización */}
                        <div className="bg-background-light dark:bg-background-dark p-12 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors group">
                            <div className="mb-8">
                                <span
                                    className="material-symbols-outlined text-5xl text-primary"
                                    style={{ fontVariationSettings: "'wght' 100" }}
                                >
                                    smart_toy
                                </span>
                            </div>
                            <h4 className="text-2xl font-bold mb-4 uppercase tracking-tighter group-hover:text-primary transition-colors">03. Automatización</h4>
                            <p className="text-stone-600 dark:text-stone-400 font-light leading-relaxed mb-8 font-ui">
                                Tecnología propia al servicio de tu crecimiento. Automatizamos flujos legales, documentales y operativos para más velocidad, transparencia y control.
                            </p>
                            <ul className="space-y-3 text-sm font-medium text-stone-500 uppercase tracking-wider font-ui">
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary mr-3 shrink-0"></span>Chatbot IA (LIA)</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary mr-3 shrink-0"></span>Dashboards en Tiempo Real</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary mr-3 shrink-0"></span>CRM Inteligente</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Split Screen: Leadership / Statement */}
            <section className="flex flex-col md:flex-row-reverse border-t border-stone-200 dark:border-stone-800">
                <div className="w-full md:w-1/2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        alt="Equipo directivo PRO CORP"
                        className="w-full h-[600px] object-cover monochrome-img"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDozrEdrTU3W3H3ZqIMdXOyWxenZTWy6Z7TkY_ijTFPQ4rzAEiiLlVlviWRIQ19ZqYL_Fy-Np6nQHzyk0Lsr72oZ3_CYq6tZYFG4mAZXh0nILHnC4KNOmcXFP-UcSlB9eNz8lLwZ0MC6hktjX-Rsq155d-wH06QQ4GIM6FTEE1l3i8oFCFStPRVpLMYWvBN5OF2NgXphNuzBFIRVwtLIkA6jn9B1GlzBVhXY1Ibqi1k_4bMH19A1bKqCfGnVyQ0_HvIPwhQVf4DwUY"
                    />
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-24 bg-stone-50 dark:bg-stone-900/30">
                    <div className="border-l border-primary/30 pl-8 py-4">
                        <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block font-ui">Equipo Directivo</span>
                        <h3 className="text-4xl font-bold mb-8 leading-tight">Experiencia global, compromiso local.</h3>
                        <p className="text-lg text-stone-600 dark:text-stone-400 font-light leading-loose mb-10 font-ui">
                            Nuestro equipo combina décadas de experiencia en derecho internacional, ingeniería de negocios y finanzas corporativas. Con formación en universidades como la Javeriana, Universidad de los Andes, el Graduate Institute de Ginebra, MIT, Harvard y Stanford.
                        </p>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <div className="text-3xl font-bold text-primary">5</div>
                                <div className="text-xs uppercase tracking-widest font-medium text-stone-500 font-ui">Países con Presencia</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary">+17</div>
                                <div className="text-xs uppercase tracking-widest font-medium text-stone-500 font-ui">Años de Experiencia</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
