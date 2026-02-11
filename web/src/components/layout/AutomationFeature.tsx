'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldCheck, BarChart3, Bot } from 'lucide-react';

const AutomationFeature = () => {
    return (
        <section id="automatizacion" className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Text Content */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div className="inline-flex items-center space-x-2 text-[var(--pro-red)] font-bold uppercase tracking-wider text-sm">
                            <span className="w-2 h-2 bg-[var(--pro-red)] rounded-full animate-pulse" />
                            <span>BPA - Business Process Automation</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Tecnología propia que <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--pro-red)] to-red-800">
                                acelera tu futuro
                            </span>
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed">
                            En PRO CORP no solo somos abogados y consultores; somos <strong>automatizadores de procesos</strong>. Nuestra tecnología propietaria nos permite gestionar expedientes complejos con una eficiencia y transparencia imposibles de igualar manualmente.
                        </p>

                        <div className="space-y-6 pt-4">
                            {[
                                {
                                    icon: Bot,
                                    title: 'LIA (Legal AI)',
                                    text: 'Nuestra asistente inteligente valida tu elegibilidad y responde consultas 24/7.'
                                },
                                {
                                    icon: Clock,
                                    title: 'Velocidad y Precisión',
                                    text: 'Reducción de tiempos de espera y minimización de errores humanos en la gestión documental.'
                                },
                                {
                                    icon: BarChart3,
                                    title: 'Monitoreo en Tiempo Real',
                                    text: 'Visualiza el estado exacto de tu trámite desde tu panel de cliente.'
                                }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + (idx * 0.1) }}
                                    className="flex gap-4"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[var(--pro-red)] border border-gray-100">
                                        <item.icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">{item.title}</h4>
                                        <p className="text-gray-600 text-sm mt-1">{item.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Graphical/UI Representation */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-transparent rounded-[2rem] transform rotate-3 scale-95 -z-10" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-gray-900 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden border border-gray-800"
                        >
                            {/* Chat Interface Mockup */}
                            <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-[var(--pro-red)] flex items-center justify-center text-white font-bold">LIA</div>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                                    </div>
                                    <div>
                                        <div className="text-white font-bold">LIA Assistant</div>
                                        <div className="text-gray-400 text-xs">Online • PRO CORP Legal AI</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 font-mono text-sm max-h-[400px] overflow-y-auto">
                                <div className="flex gap-3">
                                    <div className="bg-gray-800 text-gray-200 p-4 rounded-2xl rounded-tl-none max-w-[85%]">
                                        Hola. Soy LIA. ¿En qué puedo ayudarte hoy con tu proceso de ciudadanía o inversión?
                                    </div>
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <div className="bg-[var(--pro-red)] text-white p-4 rounded-2xl rounded-tr-none max-w-[85%]">
                                        Quiero saber si aplico para la nacionalidad española por apellido.
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="bg-gray-800 text-gray-200 p-4 rounded-2xl rounded-tl-none max-w-[85%]">
                                        <div className="flex items-center gap-2 mb-2 text-green-400 text-xs uppercase font-bold">
                                            <ShieldCheck size={12} /> Análisis en curso...
                                        </div>
                                        Para la nacionalidad por Carta de Naturaleza (Sefardí), el plazo cerró en 2019, pero existen vías actuales como la <strong>Ley de Memoria Democrática</strong>.
                                        <br /><br />
                                        ¿Tienes abuelos o padres que hayan sido españoles?
                                    </div>
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <div className="bg-[var(--pro-red)] text-white p-4 rounded-2xl rounded-tr-none max-w-[85%]">
                                        Sí, mi abuelo era español.
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    {/* Typing indicator */}
                                    <div className="bg-gray-800 text-gray-200 p-4 rounded-2xl rounded-tl-none">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Input Area Mockup */}
                            <div className="mt-8 relative">
                                <div className="bg-gray-800 rounded-full p-4 flex justify-between items-center">
                                    <div className="text-gray-500 ml-2">Escribe tu respuesta...</div>
                                    <div className="w-8 h-8 rounded-full bg-[var(--pro-red)] flex items-center justify-center text-white">
                                        <ArrowUpIcon />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ArrowUpIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
    </svg>
);

export default AutomationFeature;
