'use client';

import React from 'react';

const FeatureGrid = () => {
    return (
        <section className="bg-background-light dark:bg-background-dark/50 py-24 border-y border-gray-100 dark:border-white/5">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Feature 01 */}
                    <div className="p-8 border-l-2 border-primary/20 hover:border-primary transition-colors group">
                        <h3 className="text-4xl font-bold mb-4 dark:text-white font-display group-hover:text-primary transition-colors">01</h3>
                        <h4 className="text-xl font-bold mb-4 uppercase tracking-wide dark:text-white font-display">Soluciones Legales</h4>
                        <p className="text-gray-500 dark:text-gray-400 font-ui leading-relaxed">Nacionalidad española y portuguesa por origen sefardí, Golden Visa, Ley de Memoria Democrática, visa nómada digital y más rutas hacia la ciudadanía europea.</p>
                    </div>
                    {/* Feature 02 */}
                    <div className="p-8 border-l-2 border-primary/20 hover:border-primary transition-colors group">
                        <h3 className="text-4xl font-bold mb-4 dark:text-white font-display group-hover:text-primary transition-colors">02</h3>
                        <h4 className="text-xl font-bold mb-4 uppercase tracking-wide dark:text-white font-display">Inversión y Consultoría</h4>
                        <p className="text-gray-500 dark:text-gray-400 font-ui leading-relaxed">Oportunidades de inversión en España y Europa, estructuración de proyectos, modelajes financieros, cierre de fondos y monitoreo en tiempo real.</p>
                    </div>
                    {/* Feature 03 */}
                    <div className="p-8 border-l-2 border-primary/20 hover:border-primary transition-colors group">
                        <h3 className="text-4xl font-bold mb-4 dark:text-white font-display group-hover:text-primary transition-colors">03</h3>
                        <h4 className="text-xl font-bold mb-4 uppercase tracking-wide dark:text-white font-display">Automatización</h4>
                        <p className="text-gray-500 dark:text-gray-400 font-ui leading-relaxed">Tecnología propia que impulsa tu desarrollo: flujos legales automatizados, chatbot IA (LIA), dashboards en tiempo real, CRM y gestión inteligente de procesos.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureGrid;
