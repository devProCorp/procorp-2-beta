'use client';

import { useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 192;
const FRAME_PATH = '/hero-frames/frame-';
const FPS = 24;
const START_FRAME = 20; // skip white-bg frames

export default function WorkflowAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const frameRef = useRef(START_FRAME);
  const directionRef = useRef<1 | -1>(1);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let loaded = 0;

    for (let i = START_FRAME; i < TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.onload = () => {
        if (cancelled) return;
        imagesRef.current[i] = img;
        loaded++;
        if (loaded >= 30 && !ready) setReady(true);
      };
      img.onerror = () => { loaded++; };
      img.src = `${FRAME_PATH}${String(i).padStart(4, '0')}.jpg`;
    }

    return () => { cancelled = true; };
  }, [ready]);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = rect.width * dpr;
    const h = rect.height * dpr;

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    const imgRatio = img.width / img.height;
    const canvasRatio = w / h;
    let sw = img.width, sh = img.height, sx = 0, sy = 0;
    if (imgRatio > canvasRatio) {
      sw = img.height * canvasRatio;
      sx = (img.width - sw) / 2;
    } else {
      sh = img.width / canvasRatio;
      sy = (img.height - sh) / 2;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  };

  useEffect(() => {
    if (!ready) return;

    drawFrame(frameRef.current);

    intervalRef.current = setInterval(() => {
      const next = frameRef.current + directionRef.current;

      if (next >= TOTAL_FRAMES - 1) {
        directionRef.current = -1;
      } else if (next <= START_FRAME) {
        directionRef.current = 1;
      }

      frameRef.current = frameRef.current + directionRef.current;
      drawFrame(frameRef.current);
    }, 1000 / FPS);

    return () => clearInterval(intervalRef.current);
  }, [ready]);

  return (
    <div className="relative w-full aspect-video max-h-[480px] rounded-2xl overflow-hidden border border-surface-border bg-surface-dark shadow-2xl group">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* Edge vignette */}
      <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_60px_rgba(0,0,0,0.6)]" />

      {/* Loading state */}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
