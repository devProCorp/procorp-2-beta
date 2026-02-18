'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-white pt-20">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-[var(--pro-light)] to-transparent pointer-events-none opacity-50" />

            {/* Diagonal Slice - Brand Element */}
            <div className="absolute top-0 right-0 w-[60%] h-full bg-slate-50 transform -skew-x-12 translate-x-20 z-0 pointer-events-none opacity-60 mix-blend-multiply" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">

                {/* Text Content */}
                <div className="w-full md:w-1/2 pt-10 md:pt-0 space-y-8">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 border border-red-100 text-[var(--pro-red)] text-xs font-bold uppercase tracking-wider mb-6">
                            <Zap size={14} className="mr-2" />
                            Tecnología + Experiencia Legal
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900">
                            Desarrollo Corporativo <br />
                            <span className="text-[var(--pro-red)]">Automatizado</span>
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                            Facilitamos el acceso a la ciudadanía europea y optimizamos el crecimiento de tu empresa mediante <strong>tecnología propia</strong> y automatización de procesos (BPA).
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <button className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-[var(--pro-red)] rounded shadow-lg hover:bg-red-700 hover:shadow-xl transition-all hover:-translate-y-1">
                            Consultar con LIA (AI)
                            <ArrowRight className="ml-2" size={20} />
                        </button>
                        <button className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[var(--pro-red)] bg-transparent border-2 border-[var(--pro-red)] rounded hover:bg-red-50 transition-colors">
                            Ver Servicios
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex items-center gap-6 text-sm text-gray-500 pt-4"
                        a
                    >
                        <div className="flex items-center">
                            <CheckCircle size={16} className="text-[var(--pro-red)] mr-2" />
                            <span>Monitoreo en tiempo real</span>
                        </div>
                        <div className="flex items-center">
                            <CheckCircle size={16} className="text-[var(--pro-red)] mr-2" />
                            <span>Transparencia total</span>
                        </div>
                    </motion.div>
                </div>

                {/* Hero Image / Visual */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="w-full md:w-1/2 mt-12 md:mt-0 relative"
                >
                    {/* Abstract representation of Automation/Dashboard */}
                    <div className="relative rounded-xl shadow-2xl bg-white border border-gray-200 overflow-hidden transform md:rotate-2 md:translate-x-10 hover:rotate-0 transition-transform duration-500">
                        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-[var(--pro-red)] to-gray-400" />
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-red-100 flex items-center justify-center text-[var(--pro-red)] font-bold">PC</div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">Estado del Trámite</div>
                                        <div className="text-xs text-green-600 font-medium flex items-center">
                                            <span className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse" />
                                            Activo / En proceso
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400">ID: #ESP-2026-892</div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Recolección Documental</span>
                                    <span className="text-[var(--pro-red)] font-bold">100%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-[var(--pro-red)] h-2 rounded-full w-full" />
                                </div>

                                <div className="flex justify-between text-sm mt-4">
                                    <span className="text-gray-600">Validación Jurídica</span>
                                    <span className="text-[var(--pro-red)] font-bold">85%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-[var(--pro-red)] h-2 rounded-full w-[85%]" />
                                </div>

                                <div className="flex justify-between text-sm mt-4">
                                    <span className="text-gray-600">Presentación Ministerio</span>
                                    <span className="text-gray-400 font-bold">Pendiente</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-gray-300 h-2 rounded-full w-0" />
                                </div>
                            </div>

                            <div className="pt-4 flex items-center gap-3 bg-gray-50 p-3 rounded border border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                                    AI
                                </div>
                                <div className="text-xs text-gray-600 italic">
                                    &quot;Hola, he validado tus documentos de genealogía. Están listos para la firma.&quot;
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating badge */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl border-l-4 border-[var(--pro-red)]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="text-3xl font-bold text-gray-900">98%</div>
                            <div className="text-xs text-gray-500 leading-tight">
                                Tasa de éxito <br /> en expedientes
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
