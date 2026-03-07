"use client";

import { useEffect, useRef, useState } from "react";

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<TrailPoint[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    // Only render on non-touch / desktop devices
    const touchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(max-width: 768px)").matches;

    setIsTouch(touchDevice);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maxPoints = 50;
    const maxAge = 1;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
      });

      if (pointsRef.current.length > maxPoints) {
        pointsRef.current.shift();
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Age and remove old points
      pointsRef.current = pointsRef.current.filter((p) => {
        p.age += dt;
        return p.age < maxAge;
      });

      const points = pointsRef.current;
      if (points.length < 2) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // Draw trail
      for (let i = 1; i < points.length; i++) {
        const p = points[i];
        const prev = points[i - 1];
        const life = 1 - p.age / maxAge;

        // Blue to purple gradient based on position in trail
        const t = i / points.length;
        const r = Math.round(100 + t * 128);
        const g = Math.round(50 * (1 - t));
        const b = Math.round(200 + t * 55);

        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${life * 0.7})`;
        ctx.lineWidth = life * 3 + 1;
        ctx.lineCap = "round";
        ctx.stroke();

        // Glow effect
        if (life > 0.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, life * 6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${life * 0.3})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    />
  );
}
