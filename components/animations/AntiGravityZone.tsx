"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Matter from "matter-js";

interface AntiGravityZoneProps {
  children: ReactNode;
  gravity?: "zero" | "reversed";
  interactive?: boolean;
  className?: string;
  bounciness?: number;
  friction?: number;
}

export default function AntiGravityZone({
  children,
  gravity = "zero",
  interactive = true,
  className,
  bounciness = 0.8,
  friction = 0.05,
}: AntiGravityZoneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const gravityY = gravity === "zero" ? 0 : -1;

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: gravityY, scale: 0.001 },
    });
    engineRef.current = engine;

    const { width, height } = container.getBoundingClientRect();
    const wt = 50; // wall thickness

    // Boundary walls
    const walls = [
      Matter.Bodies.rectangle(width / 2, -wt / 2, width + wt * 2, wt, { isStatic: true }),
      Matter.Bodies.rectangle(width / 2, height + wt / 2, width + wt * 2, wt, { isStatic: true }),
      Matter.Bodies.rectangle(-wt / 2, height / 2, wt, height + wt * 2, { isStatic: true }),
      Matter.Bodies.rectangle(width + wt / 2, height / 2, wt, height + wt * 2, { isStatic: true }),
    ];
    Matter.Composite.add(engine.world, walls);

    // Mouse constraint for drag interaction
    if (interactive) {
      const mouse = Matter.Mouse.create(container);
      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.2,
          render: { visible: false },
        },
      });
      Matter.Composite.add(engine.world, mouseConstraint);

      // Prevent page scroll when interacting with the zone
      container.addEventListener("wheel", (e) => e.preventDefault(), { passive: false });
    }

    // Find child elements to turn into physics bodies
    const childElements = container.querySelectorAll<HTMLElement>("[data-physics-body]");
    const bodyMap: { body: Matter.Body; element: HTMLElement }[] = [];

    childElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;

      const isCircle = el.dataset.physicsShape === "circle";

      const body = isCircle
        ? Matter.Bodies.circle(x, y, Math.max(rect.width, rect.height) / 2, {
            restitution: bounciness,
            friction,
            frictionAir: 0.01,
          })
        : Matter.Bodies.rectangle(x, y, rect.width, rect.height, {
            restitution: bounciness,
            friction,
            frictionAir: 0.01,
            chamfer: { radius: 4 },
          });

      // Give floating bodies a small random initial velocity
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      });

      Matter.Composite.add(engine.world, body);
      bodyMap.push({ body, element: el });
    });

    // Animation loop: sync DOM to physics
    const loop = () => {
      Matter.Engine.update(engine, 1000 / 60);

      for (const { body, element } of bodyMap) {
        const x = body.position.x - element.offsetWidth / 2;
        const y = body.position.y - element.offsetHeight / 2;
        const angle = body.angle;
        element.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`;
        element.style.position = "absolute";
        element.style.left = "0";
        element.style.top = "0";
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      Matter.Engine.clear(engine);
    };
  }, [gravity, interactive, bounciness, friction]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {children}
    </div>
  );
}
