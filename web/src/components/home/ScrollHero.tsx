'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ScrollHero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [frames, setFrames] = useState<string[]>([]);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loaded, setLoaded] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // 1. Load the manifest of frames
    useEffect(() => {
        fetch('/hero-frames/manifest.json')
            .then(res => res.json())
            .then((data: string[]) => {
                setFrames(data);
                // Preload images
                const imgs: HTMLImageElement[] = [];
                let loadedCount = 0;

                data.forEach((frame) => {
                    const img = new Image();
                    img.src = `/hero-frames/${frame}`;
                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount === data.length) {
                            setLoaded(true);
                        }
                    };
                    imgs.push(img);
                });
                setImages(imgs);
            })
            .catch(err => {
                console.error("Failed to load frame manifest", err);
                // Fallback logic if needed, but we assume extraction worked
            });
    }, []);

    // 2. Render frame based on scroll position
    useEffect(() => {
        if (!loaded || !images.length || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions to match window or image aspect ratio
        // Ideally we do this on resize too
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        const renderFrame = () => {
            const progress = scrollYProgress.get();
            // Map 0-1 progress to frame index
            const frameIndex = Math.min(
                Math.floor(progress * (images.length - 1)),
                images.length - 1
            );

            const img = images[frameIndex];
            if (img) {
                // Draw image "cover" style
                const hRatio = canvas.width / img.width;
                const vRatio = canvas.height / img.height;
                const ratio = Math.max(hRatio, vRatio);
                const centerShift_x = (canvas.width - img.width * ratio) / 2;
                const centerShift_y = (canvas.height - img.height * ratio) / 2;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(
                    img,
                    0, 0, img.width, img.height,
                    centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
                );
            }
            requestAnimationFrame(renderFrame);
        };

        const unsubscribe = scrollYProgress.on("change", () => {
            // We can trigger render here or use rAF loop for smoother updates
        });

        // Start render loop
        const loop = () => {
            renderFrame();
            requestAnimationFrame(loop);
        };
        const animId = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            cancelAnimationFrame(animId);
            unsubscribe();
        };

    }, [loaded, images, scrollYProgress]);

    // Opacity fade out as user scrolls past
    const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

    return (
        <section ref={containerRef} className="relative h-[400vh] w-full bg-background-dark">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <motion.div
                    style={{ opacity }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Canvas for Frame Sequence */}
                    {frames.length > 0 ? (
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full block"
                        />
                    ) : (
                        /* Initial Flash / Fallback while loading or if failed */
                        <div className="w-full h-full bg-black relative">
                            <img
                                src="/hero-fallback.webp"
                                alt="Hero Loader"
                                className="w-full h-full object-cover opacity-50"
                            />
                        </div>
                    )}
                </motion.div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center mix-blend-difference pointer-events-none">
                    <span className="text-white/60 text-xs uppercase tracking-[0.4em] mb-4 font-display">Scroll to Explore</span>
                    <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent"></div>
                </div>
            </div>
        </section>
    );
};

export default ScrollHero;
