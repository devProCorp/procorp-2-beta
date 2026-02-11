'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProjectDetail() {
    const params = useParams();
    const slug = params.slug;

    return (
        <main className="min-h-screen bg-background-light dark:bg-background-dark pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <Link href="/projects" className="text-sm font-ui uppercase tracking-widest text-neutral-gray dark:text-gray-400 hover:text-primary transition-colors">
                        ← Back to Index
                    </Link>
                </div>

                <header className="mb-20">
                    <span className="text-primary font-bold text-xs uppercase tracking-[0.8em] font-display block mb-6">Case Study / 2024</span>
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 uppercase font-display text-neutral-dark dark:text-white leading-[0.9]">
                        {slug ? slug.toString().replace(/-/g, ' ') : 'Project Title'}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-neutral-dark/10 dark:border-white/10 pt-12 mt-12">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Client</h3>
                            <p className="font-ui text-lg text-neutral-dark dark:text-white">Nexus Logistics</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Services</h3>
                            <p className="font-ui text-lg text-neutral-dark dark:text-white">Strategy, Automation</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Location</h3>
                            <p className="font-ui text-lg text-neutral-dark dark:text-white">Hamburg, DE</p>
                        </div>
                    </div>
                </header>

                <div className="space-y-24">
                    {/* Hero Image */}
                    <div className="w-full h-[60vh] bg-neutral-200 dark:bg-neutral-800 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-neutral-400 font-ui text-sm uppercase tracking-widest">
                            Project Hero Image
                        </div>
                    </div>

                    {/* Content Block */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-8 md:col-start-3">
                            <h3 className="text-2xl md:text-3xl font-display font-medium leading-relaxed text-neutral-dark dark:text-white mb-8">
                                Challenge
                            </h3>
                            <p className="font-ui text-lg text-neutral-gray dark:text-gray-400 leading-relaxed mb-12">
                                In an era of rampant logistical entropy, the client required a complete structural overhaul of their supply chain mechanisms. Our directive was clear: eliminate redundancy through high-level algorithmic intervention.
                            </p>
                            <h3 className="text-2xl md:text-3xl font-display font-medium leading-relaxed text-neutral-dark dark:text-white mb-8">
                                Solution
                            </h3>
                            <p className="font-ui text-lg text-neutral-gray dark:text-gray-400 leading-relaxed">
                                By deploying our proprietary 'Stratos' neural engine, we mapped over 4 million data points to construct a predictive model of inventory flow. The result is not just efficiency; it is the mathematical certainty of execution. A 40% reduction in operational friction was achieved within the first quarter.
                            </p>
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="aspect-[4/5] bg-neutral-200 dark:bg-neutral-800"></div>
                        <div className="aspect-[4/5] bg-neutral-200 dark:bg-neutral-800"></div>
                    </div>
                </div>

                {/* Next Project */}
                <div className="mt-32 pt-20 border-t border-neutral-dark/10 dark:border-white/10 text-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-gray dark:text-gray-500 mb-4 block">Next Case Study</span>
                    <Link href="/projects" className="text-4xl md:text-6xl font-display font-bold uppercase text-neutral-dark dark:text-white hover:text-primary transition-colors">
                        Stratos Fintech
                    </Link>
                </div>
            </div>
        </main>
    );
}
