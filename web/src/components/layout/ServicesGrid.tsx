'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, FileText, Briefcase, TrendingUp, Users, Laptop } from 'lucide-react';

const services = [
    {
        icon: Globe,
        title: 'Ciudadanía Europea',
        description: 'Gestión integral para nacionalidad española y portuguesa por origen sefardí, y Ley de Memoria Democrática.',
    },
    {
        icon: Briefcase,
        title: 'Golden Visa & Inversión',
        description: 'Residencia por inversión inmobiliaria o empresarial en España y Portugal. Estructuración legal completa.',
    },
    {
        icon: Laptop,
        title: 'Nómadas Digitales',
        description: 'Tramitación de visados para teletrabajadores que deseen residir en Europa con beneficios fiscales.',
    },
    {
        icon: TrendingUp,
        title: 'Estructuración de Proyectos',
        description: 'Modelaje financiero, búsqueda de fondos y reingeniería de procesos para crecimiento empresarial.',
    },
    {
        icon: FileText,
        title: 'Legal & Tributario',
        description: 'Asesoría jurídica especializada en normativa española/portuguesa y optimización fiscal binacional.',
    },
    {
        icon: Users,
        title: 'Arraigo y Familia',
        description: 'Soluciones para regularización, arraigo social/familiar y tarjetas de familiar comunitario UE.',
    },
];

const ServicesGrid = () => {
    return (
        <section id="servicios" className="py-24 bg-gray-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute right-0 top-0 w-96 h-96 bg-[var(--pro-red)] rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute left-0 bottom-0 w-96 h-96 bg-gray-400 rounded-full filter blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Soluciones Integrales <span className="text-[var(--pro-red)]">Transfronterizas</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Combinamos experiencia legal con tecnología de automatización para agilizar tus trámites y maximizar resultados.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
                        >
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-[var(--pro-red)] mb-6 group-hover:bg-[var(--pro-red)] group-hover:text-white transition-colors">
                                <service.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesGrid;
