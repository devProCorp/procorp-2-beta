'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Node {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  opacity: number;
  pulsePhase: number;
  pulseSpeed: number;
  activated: number; // 0-1 how "activated" by mouse
}

const NODE_COUNT = 90;
const CONNECTION_DISTANCE = 200;
const MOUSE_RADIUS = 350;
const MOUSE_FORCE = 0.6;
const RETURN_FORCE = 0.008;
const FRICTION = 0.92;
const PRIMARY_R = 206;
const PRIMARY_G = 16;
const PRIMARY_B = 38;

export default function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const prevMouseRef = useRef({ x: -9999, y: -9999 });
  const mouseVelRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);
  const dprRef = useRef(1);

  const initNodes = useCallback((w: number, h: number) => {
    const nodes: Node[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      nodes.push({
        x, y,
        originX: x,
        originY: y,
        vx: 0,
        vy: 0,
        radius: 0,
        baseRadius: 1.2 + Math.random() * 2.5,
        opacity: 0.2 + Math.random() * 0.4,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.015,
        activated: 0,
      });
    }
    nodesRef.current = nodes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodesRef.current.length === 0) {
        initNodes(rect.width, rect.height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current = { x, y, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { ...mouseRef.current, active: false };
    };

    // Listen on window so it tracks even when mouse moves fast
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mouseenter', () => { mouseRef.current.active = true; });

    let time = 0;

    const animate = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      time++;

      // Calculate mouse velocity
      mouseVelRef.current = {
        x: mouse.x - prevMouseRef.current.x,
        y: mouse.y - prevMouseRef.current.y,
      };
      prevMouseRef.current = { x: mouse.x, y: mouse.y };
      const mouseSpeed = Math.sqrt(mouseVelRef.current.x ** 2 + mouseVelRef.current.y ** 2);

      // Update nodes
      for (const node of nodes) {
        node.pulsePhase += node.pulseSpeed;
        node.radius = node.baseRadius + Math.sin(node.pulsePhase) * 0.6;

        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (mouse.active && dist < MOUSE_RADIUS && dist > 0) {
          const proximity = 1 - dist / MOUSE_RADIUS;
          const speedMultiplier = 1 + Math.min(mouseSpeed * 0.05, 3);

          // Strong repulsion - nodes scatter away from cursor
          const force = proximity * proximity * MOUSE_FORCE * speedMultiplier;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;

          // Push nodes in mouse direction for "wake" effect
          node.vx += mouseVelRef.current.x * proximity * 0.04;
          node.vy += mouseVelRef.current.y * proximity * 0.04;

          // Activate node
          node.activated = Math.min(1, node.activated + proximity * 0.3);
        } else {
          // Decay activation
          node.activated *= 0.96;
        }

        // Return to origin with spring
        const returnDx = node.originX - node.x;
        const returnDy = node.originY - node.y;
        node.vx += returnDx * RETURN_FORCE;
        node.vy += returnDy * RETURN_FORCE;

        // Apply velocity with friction
        node.vx *= FRICTION;
        node.vy *= FRICTION;

        // Clamp velocity to prevent erratic nodes
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > 8) {
          node.vx = (node.vx / speed) * 8;
          node.vy = (node.vy / speed) * 8;
        }

        node.x += node.vx;
        node.y += node.vy;

        // Keep within bounds
        if (node.x < -50) node.x = w + 50;
        if (node.x > w + 50) node.x = -50;
        if (node.y < -50) node.y = h + 50;
        if (node.y > h + 50) node.y = -50;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const distAlpha = (1 - dist / CONNECTION_DISTANCE);
            const activation = Math.max(nodes[i].activated, nodes[j].activated);

            // Base: very subtle. Mouse proximity: bright
            const baseAlpha = distAlpha * 0.08;
            const activeAlpha = distAlpha * activation * 0.7;
            const alpha = baseAlpha + activeAlpha;

            if (alpha < 0.01) continue;

            // Line width scales with activation
            const lw = 0.3 + activation * 2;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = activation > 0.3
              ? `rgba(255,${80 + (1 - activation) * 120},${80 + (1 - activation) * 120},${alpha})`
              : `rgba(${PRIMARY_R},${PRIMARY_G},${PRIMARY_B},${alpha})`;
            ctx.lineWidth = lw;
            ctx.stroke();

            // Traveling pulse on activated connections
            if (activation > 0.2) {
              const speed = 0.015 + activation * 0.03;
              const pulsePos = ((time * speed + i * 0.1) % 1);
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * pulsePos;
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * pulsePos;

              const pulseGrad = ctx.createRadialGradient(px, py, 0, px, py, 4 + activation * 4);
              pulseGrad.addColorStop(0, `rgba(255,180,180,${activation * 0.9})`);
              pulseGrad.addColorStop(1, 'rgba(0,0,0,0)');
              ctx.beginPath();
              ctx.arc(px, py, 4 + activation * 4, 0, Math.PI * 2);
              ctx.fillStyle = pulseGrad;
              ctx.fill();
            }
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const a = node.activated;

        // Outer glow ring when activated
        if (a > 0.1) {
          const glowR = node.radius * (6 + a * 12);
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowR);
          gradient.addColorStop(0, `rgba(${PRIMARY_R},${PRIMARY_G},${PRIMARY_B},${a * 0.5})`);
          gradient.addColorStop(0.4, `rgba(${PRIMARY_R},${PRIMARY_G},${PRIMARY_B},${a * 0.15})`);
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Core node
        const r = node.radius + a * 4;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);

        if (a > 0.2) {
          // Activated: white-hot center, red rim
          const innerGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r);
          innerGrad.addColorStop(0, `rgba(255,${200 + a * 55},${200 + a * 55},${0.9 + a * 0.1})`);
          innerGrad.addColorStop(0.6, `rgba(${PRIMARY_R},${PRIMARY_G},${PRIMARY_B},${0.8})`);
          innerGrad.addColorStop(1, `rgba(${PRIMARY_R},${PRIMARY_G},${PRIMARY_B},${0.3})`);
          ctx.fillStyle = innerGrad;
        } else {
          // Idle: dim red
          ctx.fillStyle = `rgba(${PRIMARY_R},${PRIMARY_G},${PRIMARY_B},${node.opacity * 0.4 + a * 0.5})`;
        }
        ctx.fill();
      }

      // Cursor attractor glow
      if (mouse.active && mouse.x > 0 && mouse.y > 0) {
        const intensity = Math.min(0.15 + mouseSpeed * 0.003, 0.3);
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_RADIUS * 0.5);
        gradient.addColorStop(0, `rgba(${PRIMARY_R},${PRIMARY_G},${PRIMARY_B},${intensity})`);
        gradient.addColorStop(0.3, `rgba(${PRIMARY_R},${PRIMARY_G},${PRIMARY_B},${intensity * 0.4})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [initNodes]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-[2] pointer-events-auto"
    />
  );
}
