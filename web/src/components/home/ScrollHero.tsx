'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const ScrollHero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [frames, setFrames] = useState<string[]>([]);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loaded, setLoaded] = useState(false);
    const { t } = useLanguage();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    useEffect(() => {
        fetch('/hero-frames/manifest.json')
            .then(res => res.json())
            .then((data: string[]) => {
                setFrames(data);
                const imgs: HTMLImageElement[] = [];
                let loadedCount = 0;
                data.forEach((frame) => {
                    const img = new Image();
                    img.src = `/hero-frames/${frame}`;
                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount === data.length) setLoaded(true);
                    };
                    imgs.push(img);
                });
                setImages(imgs);
            })
            .catch(err => console.error("Failed to load frame manifest", err));
    }, []);

    useEffect(() => {
        if (!loaded || !images.length || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        const renderFrame = () => {
            const progress = scrollYProgress.get();
            const frameIndex = Math.min(Math.floor(progress * (images.length - 1)), images.length - 1);
            const img = images[frameIndex];
            if (img) {
                const hRatio = canvas.width / img.width;
                const vRatio = canvas.height / img.height;
                const ratio = Math.max(hRatio, vRatio);
                const cx = (canvas.width - img.width * ratio) / 2;
                const cy = (canvas.height - img.height * ratio) / 2;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
            }
            requestAnimationFrame(renderFrame);
        };

        const unsubscribe = scrollYProgress.on("change", () => { });
        const animId = requestAnimationFrame(function loop() { renderFrame(); requestAnimationFrame(loop); });

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            cancelAnimationFrame(animId);
            unsubscribe();
        };
    }, [loaded, images, scrollYProgress]);

    const opacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);
    const overlayOpacity = useTransform(scrollYProgress, [0, 0.05, 0.75, 0.85], [0.1, 0.45, 0.45, 0]);
    const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

    const titleOpacity = useTransform(scrollYProgress, [0, 0.05, 0.2, 0.25], [0, 1, 1, 0]);
    const titleY = useTransform(scrollYProgress, [0, 0.05, 0.2, 0.25], [40, 0, 0, -40]);
    const manifestoOpacity = useTransform(scrollYProgress, [0.25, 0.3, 0.45, 0.5], [0, 1, 1, 0]);
    const manifestoY = useTransform(scrollYProgress, [0.25, 0.3, 0.45, 0.5], [40, 0, 0, -40]);
    const featuresOpacity = useTransform(scrollYProgress, [0.5, 0.55, 0.7, 0.75], [0, 1, 1, 0]);
    const featuresY = useTransform(scrollYProgress, [0.5, 0.55, 0.7, 0.75], [40, 0, 0, -40]);

    return (
        <section ref={containerRef} className="relative h-[500vh] w-full bg-background-dark">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <motion.div style={{ opacity }} className="absolute inset-0 w-full h-full">
                    {frames.length > 0 ? (
                        <canvas ref={canvasRef} className="w-full h-full block" />
                    ) : (
                        <div className="w-full h-full bg-black relative">
                            <img src="/hero-fallback.webp" alt="Hero Loader" className="w-full h-full object-cover opacity-50" />
                        </div>
                    )}
                </motion.div>

                <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-black z-10 pointer-events-none" />

                {/* PHASE 1: Title */}
                <motion.div style={{ opacity: titleOpacity, y: titleY }} className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-8">
                    <div className="text-center max-w-5xl">
                        <span className="text-primary text-sm font-bold uppercase tracking-widest mb-6 block font-ui">
                            {t('hero.label')}
                        </span>
                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] tracking-tighter font-display">
                            {t('hero.title.1')} <span className="text-primary italic">{t('hero.title.accent1')}</span> <br />
                            {t('hero.title.2')} <span className="text-primary">{t('hero.title.accent2')}</span> <br />
                            <span className="text-white/80">{t('hero.title.3')}</span>
                        </h1>
                    </div>
                </motion.div>

                {/* PHASE 2: Manifesto */}
                <motion.div style={{ opacity: manifestoOpacity, y: manifestoY }} className="absolute inset-0 z-20 flex items-center pointer-events-none px-8 md:px-16 lg:px-24">
                    <div className="w-full md:w-1/2 lg:w-5/12">
                        <span className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-6 block font-ui">
                            {t('hero.manifesto.label')}
                        </span>
                        <p className="text-xl md:text-2xl lg:text-3xl font-light text-white/90 leading-relaxed font-ui mb-8">
                            {t('hero.manifesto.text')}
                        </p>
                        <p className="text-base md:text-lg text-white/50 leading-relaxed font-ui">
                            {t('hero.manifesto.sub')}
                        </p>
                    </div>
                </motion.div>

                {/* PHASE 3: Features */}
                <motion.div style={{ opacity: featuresOpacity, y: featuresY }} className="absolute inset-0 z-20 flex items-center justify-center md:justify-end pointer-events-none px-8 md:px-16 lg:px-24">
                    <div className="w-full md:w-1/2 lg:w-5/12 space-y-10">
                        <div className="border-l-2 border-primary/40 pl-6">
                            <span className="text-3xl font-bold text-primary font-display">01</span>
                            <h3 className="text-lg font-bold uppercase tracking-wide text-white mt-2 font-display">{t('hero.f1.title')}</h3>
                            <p className="text-white/50 text-sm mt-2 font-ui leading-relaxed">{t('hero.f1.desc')}</p>
                        </div>
                        <div className="border-l-2 border-primary/40 pl-6">
                            <span className="text-3xl font-bold text-primary font-display">02</span>
                            <h3 className="text-lg font-bold uppercase tracking-wide text-white mt-2 font-display">{t('hero.f2.title')}</h3>
                            <p className="text-white/50 text-sm mt-2 font-ui leading-relaxed">{t('hero.f2.desc')}</p>
                        </div>
                        <div className="border-l-2 border-primary/40 pl-6">
                            <span className="text-3xl font-bold text-primary font-display">03</span>
                            <h3 className="text-lg font-bold uppercase tracking-wide text-white mt-2 font-display">{t('hero.f3.title')}</h3>
                            <p className="text-white/50 text-sm mt-2 font-ui leading-relaxed">{t('hero.f3.desc')}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div style={{ opacity: scrollIndicatorOpacity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none mix-blend-difference">
                    <span className="text-white text-xs uppercase tracking-[0.4em] mb-4 font-display">{t('hero.scroll')}</span>
                    <div className="w-px h-16 bg-gradient-to-b from-white to-transparent"></div>
                </motion.div>
            </div>
        </section>
    );
};

export default ScrollHero;
