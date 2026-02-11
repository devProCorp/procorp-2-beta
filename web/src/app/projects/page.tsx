'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const services = [
    {
        id: '01',
        title: 'NACIONALIDAD ESPAÑOLA POR ORIGEN SEFARDÍ',
        description: 'España',
        detail: 'Prueba genealógica y gestión integral',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHfyFVGpCbjP10XYbdgBEzkqI6Dug3VrNa4neeD-e1hKg-zAoiH2qGpgD4Dg20JyS18r4vkAqq5hOjMEchNoai4KiB_SRIC2soV1o3bcfN2A4myEoWZD49rCE_cxc3ks51rv_mB5dAW0c2KtPcMnscJ4QsUGYjtmXJOhMqIklhVIJY8dOdU9SX14_dk6ItO87xz2CCMdPhLwUEafYiS0UPlm8AMsyzMoPAie3g-14QEZ2CtZfJpeOCRrrwqJZ2uMbrZ4IwRXIlTQY',
        slug: 'nacionalidad-espanola-sefardi',
    },
    {
        id: '02',
        title: 'NACIONALIDAD PORTUGUESA POR ORIGEN SEFARDÍ',
        description: 'Portugal',
        detail: 'Certificado de comunidad y pasaporte',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAZ4Ki7iKrGBdLR_b0gujcyOc9djET-yN84zqDeYcI5T51Dg_WibImUU0vM362HpyaELNqntpnTqmObieZG3vSQuvHiqm9GzYCuCnyuyyObsJV2lQ97YBy21nwx3BaZCf_FPrSf538D7HdAXr6kaiUX14DmmZ5CB9GHrgLkQTwRtynGmmLjnoD86K8p3Bj_5ZC822GtozBX2qj21jhFFNZJGTizxE6xFqTw2HaQyQRCCWLnyTTV3Ie3MI-ciWf-foAxN-bqtvb2H8',
        slug: 'nacionalidad-portuguesa-sefardi',
    },
    {
        id: '03',
        title: 'GOLDEN VISA & INVERSIÓN EN ESPAÑA',
        description: 'España',
        detail: 'Residencia por inversión desde €500.000',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQoZCmCm1WSQCBQLbgYoozTOOnpnvBe4ykHJg5VBwK8qv8N20lkv7CY7Q6Ot8IZeIjDjPtbpq9O4qtTJRq5sVukoyOPrT41iwxwgysk5pluJgMHLvRXU4LAUc_Km6mdmApIiE5Qr2BP-sEKOAVzqvB2g55WDT2m07flvzRWeaGjnRWl2vaaeE8L9qA7LN8MYZxS7wcqievWI7_F8Vu1FXXiqcs2WZ2ICy0tZKiJlJj1xelA4AYo4U7PHjk2qJzaKucLXA-n2QFpoU',
        slug: 'golden-visa-inversion',
    },
    {
        id: '04',
        title: 'LEY DE MEMORIA DEMOCRÁTICA',
        description: 'España',
        detail: 'Nacionalidad para descendientes de españoles',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlsPLQx3rTZZCt2VRYGRuAlgtUS_a3ZMuLn6xDdKqx6haqQP8Gm5cf7RIBdKJ5iyRdJKwavhSL3rAXiUOU7vj3nNvwBEu6ve3i1C0vUUAVEuFeJQtDfR-EM6qNbCYqkdt2ZV5qRb039Ud3DMokxQw-Ks6NYQNV5CK_Ki-OqNknXorxHVS1_Vfak6puPl_aOAI56ISdygEjm2Ey3PKbyUbsb7cHfCMZIPQZ7A7xMpADYuD8GVWjgh26ToSTxBd_mwAWeW_-cufiGM',
        slug: 'ley-memoria-democratica',
    },
    {
        id: '05',
        title: 'VISA NÓMADA DIGITAL',
        description: 'España',
        detail: 'Residencia para trabajadores remotos',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpyQq2K2sN9ZzwgAstfFGSLSVizhxBZnVgGC_0MI8Y11PYzgbESdJhu6XabcGW_aE6M0U9bMEPZt1ggvnmEZK5nWW3BxYMBMg15UnVxOU_hLGX-evLgJb0b1Xeu23pms63mGEwa2WzDAiAavinU_toPqM3T1MmFLFcqc_rNVHOosAj9wOm12dg967RwyVNSbTR_l6B89KPYLe1KNQY_XctguHOP32nSKJfXwaPX9weHoBirwEV5_bYv_8eQUA4iyaivkjicOKGBN4',
        slug: 'visa-nomada-digital',
    },
];

export default function ProjectsIndex() {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="pt-32 pb-20 px-6 min-h-screen bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="mb-20">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 uppercase font-display text-neutral-dark dark:text-white">
                        Servicios<span className="text-primary">.</span>
                    </h1>
                    <p className="max-w-xl text-lg text-neutral-gray dark:text-white/70 font-light leading-relaxed font-ui">
                        Soluciones legales, migratorias y de inversión para tu camino hacia la ciudadanía europea y el crecimiento corporativo.
                    </p>
                </header>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-6 border-y border-neutral-dark/10 dark:border-white/10 mb-12 gap-6">
                    <div className="flex flex-wrap gap-8 font-ui text-[11px] font-semibold tracking-[0.2em] uppercase">
                        <button className="text-primary border-b-2 border-primary pb-1">Todos</button>
                        <button className="text-neutral-gray dark:text-white/60 hover:text-primary transition-colors pb-1">Ciudadanía</button>
                        <button className="text-neutral-gray dark:text-white/60 hover:text-primary transition-colors pb-1">Residencia</button>
                        <button className="text-neutral-gray dark:text-white/60 hover:text-primary transition-colors pb-1">Inversión</button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-[10px] font-ui tracking-widest opacity-50 uppercase text-neutral-gray dark:text-white">{services.length} servicios disponibles</span>
                    </div>
                </div>

                {/* Service List */}
                <div className="space-y-0 relative">
                    {services.map((service) => (
                        <Link href={`/projects/${service.slug}`} key={service.id} className="block">
                            <div className="project-row group relative border-b border-neutral-dark/5 dark:border-white/5 py-12 flex items-center cursor-pointer overflow-hidden">
                                {/* Hover Preview Image */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-32 hidden lg:block project-image-preview pointer-events-none">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        alt={service.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                        src={service.image}
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row items-baseline w-full lg:pl-64">
                                    <span className="project-number text-primary font-display font-bold text-lg md:text-xl w-16">{service.id}</span>
                                    <div className="project-details flex flex-col md:flex-row md:items-center justify-between w-full">
                                        <h2 className="font-ui font-bold text-2xl md:text-4xl tracking-tight uppercase group-hover:text-primary transition-colors text-neutral-dark dark:text-white">
                                            {service.title}
                                        </h2>
                                        <div className="font-ui font-light text-sm md:text-lg tracking-wide opacity-60 mt-2 md:mt-0 text-neutral-dark dark:text-white">
                                            {service.description} <span className="mx-3 text-primary">&mdash;</span> {service.detail}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer Meta */}
                <div className="mt-20 flex flex-col md:flex-row items-center justify-between text-[10px] font-ui tracking-[0.3em] uppercase opacity-40 text-neutral-dark dark:text-white">
                    <div className="mb-4 md:mb-0">PRO CORP / CORPORATE DEVELOPMENT</div>
                    <div className="flex space-x-8">
                        <a className="hover:text-primary transition-colors" href="#">Política de Privacidad</a>
                        <a className="hover:text-primary transition-colors" href="#">Tratamiento de Datos</a>
                        <a className="hover:text-primary transition-colors" href="#">Términos Legales</a>
                    </div>
                </div>
            </div>

            {/* Floating Back to Top */}
            <div className={`fixed bottom-10 right-10 flex flex-col items-center space-y-4 transition-opacity duration-300 z-40 ${showBackToTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="w-px h-24 bg-primary/30"></div>
                <button
                    onClick={scrollToTop}
                    className="bg-primary text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
                >
                    <span className="material-symbols-outlined">arrow_upward</span>
                </button>
            </div>

            {/* Background Decoration */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-5">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[160px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-[160px]"></div>
            </div>
        </main>
    );
}
