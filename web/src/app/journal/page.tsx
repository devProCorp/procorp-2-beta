'use client';

import React from 'react';

const articles = [
    {
        id: 1,
        title: "Nacionalidad Española por Origen Sefardí: Todo lo que Necesitas Saber",
        date: "Ene 15, 2025",
        category: "Ciudadanía"
    },
    {
        id: 2,
        title: "Golden Visa en España: Requisitos y Oportunidades de Inversión",
        date: "Dic 20, 2024",
        category: "Inversión"
    },
    {
        id: 3,
        title: "Ley de Memoria Democrática: Nueva Vía para la Nacionalidad Española",
        date: "Nov 28, 2024",
        category: "Legislación"
    },
    {
        id: 4,
        title: "Visa Nómada Digital: Trabajar desde España con Residencia Legal",
        date: "Nov 10, 2024",
        category: "Migración"
    },
    {
        id: 5,
        title: "Automatización de Procesos: Tecnología al Servicio de tu Crecimiento",
        date: "Oct 22, 2024",
        category: "Tecnología"
    }
];

export default function Journal() {
    return (
        <main className="min-h-screen bg-background-light dark:bg-background-dark pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-20">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 uppercase font-display text-neutral-dark dark:text-white">
                        Blog<span className="text-primary">.</span>
                    </h1>
                    <p className="max-w-xl text-lg text-neutral-gray dark:text-white/70 font-light leading-relaxed font-ui">
                        Artículos sobre ciudadanía europea, migración, inversión, legislación y desarrollo corporativo.
                    </p>
                </header>

                <div className="space-y-4">
                    {articles.map((article) => (
                        <div key={article.id} className="group border-t border-neutral-dark/10 dark:border-white/10 py-12 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors px-4 -mx-4 rounded-sm">
                            <div className="mb-4 md:mb-0">
                                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">{article.category}</span>
                                <h2 className="text-3xl md:text-4xl font-display font-bold uppercase text-neutral-dark dark:text-white group-hover:text-primary transition-colors">
                                    {article.title}
                                </h2>
                            </div>
                            <div className="text-neutral-gray dark:text-gray-500 font-ui text-sm uppercase tracking-widest">
                                {article.date}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
