'use client';

import React from 'react';
import Link from 'next/link';

const VisualDivider = () => {
    return (
        <section className="relative h-[60vh] w-full bg-neutral-dark overflow-hidden">
            <div className="absolute inset-0 bg-neutral-900">
                <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-black opacity-50"></div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center px-8">
                    <h2 className="text-white text-4xl md:text-6xl font-bold mb-8 font-display tracking-tight">
                        ¿Listo para dar el siguiente paso?
                    </h2>
                    <Link href="/contact" className="inline-block bg-primary text-white px-12 py-5 rounded-sm font-bold uppercase tracking-widest hover:bg-red-700 transition-all transform hover:scale-105 font-ui shadow-lg hover:shadow-primary/50">
                        Agenda tu Consulta
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default VisualDivider;
