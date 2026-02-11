'use client';

import React from 'react';

export default function Contact() {
    return (
        <main className="flex-grow flex items-center justify-center py-32 px-4 md:px-8 min-h-screen bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Left Side: Information & Offices */}
                <div className="space-y-12">
                    <div className="space-y-6">
                        <div className="w-12 h-1 bg-primary"></div>
                        <h1 className="font-bold text-5xl md:text-6xl text-neutral-dark dark:text-white leading-tight font-display">
                            Hablemos de tu <br /><span className="text-primary">futuro.</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed font-ui">
                            Te acompañamos a descubrir tu origen y construir tu camino hacia la ciudadanía europea. Agenda una consulta con nuestro equipo.
                        </p>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/5 rounded-xl -rotate-1 group-hover:rotate-0 transition-transform"></div>
                        <div className="relative bg-white dark:bg-slate-900/50 p-8 rounded-xl border border-primary/10 space-y-8">
                            <h2 className="font-bold text-xl uppercase tracking-wider border-b border-primary/20 pb-4 font-display">Nuestras Oficinas</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <h3 className="font-bold text-primary font-display">Bogotá (Sede Principal)</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-ui">
                                        World Trade Center, Torre C, Of. 1013<br />
                                        PBX: +57 601 915 6579<br />
                                        gestion@pro-corp.net
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-primary font-display">España</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-ui">
                                        Oficina de representación<br />
                                        WhatsApp: +57 300 929 0858<br />
                                        www.pro-ley.es
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-primary font-display">Portugal</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-ui">
                                        Oficina de representación<br />
                                        WhatsApp: +57 311 516 3806<br />
                                        lisbon@pro-corp.net
                                    </p>
                                </div>
                            </div>

                            {/* Minimal Map Background */}
                            <div className="mt-8 overflow-hidden rounded-lg h-40 relative opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    className="w-full h-full object-cover"
                                    alt="Presencia global PRO CORP"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5J3kOx3dOI_ycRlwZFpw1k-henhnkKm2JG2q9VsRUlL3neBfEIne3-MKV-VkRC4tmM3MvdG60JeLWI2rcxoEW5pwCGT07Yl6nC1mevx9FPjKhhTvxiWa0Nuh7REtUmLRjrvca3RrHX5TSJsT2SlJdyiGPjksXqbE_6imZgo0g7nGYkPxZDsdxB2ctOGi3Fdy37rV6MXUZmsKrG3xBDXlahJaa5vUUmYuwAAVzD5zdn7hySD17VztfYF3mESHazEdJ5tTY4hsbFvs"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-background-dark to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Contact Form */}
                <div className="bg-white dark:bg-slate-900/40 p-8 md:p-12 rounded-xl shadow-2xl shadow-primary/5 border border-primary/5">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 font-ui">Nombre Completo</label>
                                <input
                                    className="form-input-custom w-full p-4 rounded-lg font-ui text-slate-800 dark:text-white placeholder:text-slate-400"
                                    placeholder="Ej. Juan Pérez"
                                    type="text"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 font-ui">País de Residencia</label>
                                <input
                                    className="form-input-custom w-full p-4 rounded-lg font-ui text-slate-800 dark:text-white placeholder:text-slate-400"
                                    placeholder="Ej. Colombia"
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 font-ui">Correo Electrónico</label>
                            <input
                                className="form-input-custom w-full p-4 rounded-lg font-ui text-slate-800 dark:text-white placeholder:text-slate-400"
                                placeholder="correo@ejemplo.com"
                                type="email"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 font-ui">Servicio de Interés</label>
                                <select
                                    className="form-input-custom w-full p-4 rounded-lg font-ui text-slate-800 dark:text-white appearance-none cursor-pointer"
                                    defaultValue=""
                                >
                                    <option disabled value="">Seleccionar servicio</option>
                                    <option>Nacionalidad Española (Sefardí)</option>
                                    <option>Nacionalidad Portuguesa (Sefardí)</option>
                                    <option>Golden Visa / Inversión</option>
                                    <option>Ley de Memoria Democrática</option>
                                    <option>Visa Nómada Digital</option>
                                    <option>Residencia No Lucrativa</option>
                                    <option>Inversiones en Europa</option>
                                    <option>Automatización de Procesos</option>
                                    <option>Otro</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 font-ui">¿Cómo nos encontró?</label>
                                <select
                                    className="form-input-custom w-full p-4 rounded-lg font-ui text-slate-800 dark:text-white appearance-none cursor-pointer"
                                    defaultValue=""
                                >
                                    <option disabled value="">Seleccionar</option>
                                    <option>Redes sociales</option>
                                    <option>Google</option>
                                    <option>Referido</option>
                                    <option>Evento</option>
                                    <option>Otro</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 font-ui">Mensaje</label>
                            <textarea
                                className="form-input-custom w-full p-4 rounded-lg font-ui text-slate-800 dark:text-white placeholder:text-slate-400 resize-none"
                                placeholder="Cuéntenos brevemente sobre su caso o necesidad..."
                                rows={4}
                            ></textarea>
                        </div>

                        <button
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-sm transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-primary/20 uppercase tracking-widest text-sm font-ui"
                            type="submit"
                        >
                            Enviar Solicitud
                        </button>
                        <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-ui">
                            Al enviar, acepta nuestra política de tratamiento de datos personales.
                        </p>
                    </form>
                </div>
            </div>
        </main>
    );
}
