'use client';

import React from 'react';
import Link from 'next/link';

const Manifesto = () => {
    return (
        <section className="bg-white dark:bg-background-dark py-32 px-8 md:px-24">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-12 gap-8">
                    {/* Vertical Label */}
                    <div className="hidden lg:block col-span-1">
                        <div className="rotate-90 origin-left mt-24 whitespace-nowrap">
                            <span className="text-primary font-bold text-xs uppercase tracking-[0.8em] font-display">NUESTRO PROPÓSITO / DESDE 2008</span>
                        </div>
                    </div>
                    {/* Main Content */}
                    <div className="col-span-12 lg:col-span-11">
                        <header className="mb-20">
                            <span className="text-primary text-sm font-bold uppercase tracking-widest mb-4 block font-ui">Desarrollo Corporativo</span>
                            <h2 className="text-5xl md:text-8xl font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tighter font-display">
                                Cada vez más <span className="text-primary italic">cerca</span> <br />
                                de tu <span className="text-primary">origen.</span> <br />
                                Tu futuro en Europa.
                            </h2>
                        </header>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 border-t border-gray-100 dark:border-white/10 pt-16">
                            <div>
                                <p className="text-2xl md:text-3xl font-light text-gray-600 dark:text-gray-400 leading-relaxed font-ui">
                                    En PRO CORP, empoderamos a empresas, emprendedores y profesionales para alcanzar un crecimiento sostenible. Somos más que una asesoría: estamos contigo de principio a fin.
                                </p>
                            </div>
                            <div className="space-y-8 font-ui">
                                <p className="text-lg text-gray-500 dark:text-gray-500 leading-relaxed">
                                    Combinamos planificación estratégica, estructuración de proyectos, modelaje financiero y tecnologías propias para ofrecer soluciones personalizadas con transparencia, eficiencia y resultados medibles.
                                </p>
                                <p className="text-lg text-gray-500 dark:text-gray-500 leading-relaxed">
                                    Con presencia en Colombia, España, Portugal y Suiza, facilitamos el acceso a la ciudadanía europea, oportunidades de inversión y automatización de procesos corporativos para la siguiente generación de líderes globales.
                                </p>
                                <div className="pt-8">
                                    <Link href="/studio" className="inline-flex items-center space-x-4 group">
                                        <span className="w-12 h-px bg-primary group-hover:w-20 transition-all duration-300"></span>
                                        <span className="text-primary font-bold uppercase tracking-widest text-sm">Conoce nuestro equipo</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Manifesto;
