"use client";

import { useEffect, useRef, useCallback } from "react";
import Matter from "matter-js";

interface AntiGravityOptions {
  bounciness?: number;
  friction?: number;
  frictionAir?: number;
  wallThickness?: number;
}

interface PhysicsBody {
  body: Matter.Body;
  element: HTMLElement;
}

export function useAntiGravity(
  containerRef: React.RefObject<HTMLElement | null>,
  options: AntiGravityOptions = {}
) {
  const {
    bounciness = 0.8,
    friction = 0.05,
    frictionAir = 0.01,
    wallThickness = 50,
  } = options;

  const engineRef = useRef<Matter.Engine | null>(null);
  const renderLoopRef = useRef<number | null>(null);
  const bodiesRef = useRef<PhysicsBody[]>([]);
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
  const wallsRef = useRef<Matter.Body[]>([]);

  // Initialize engine
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0, scale: 0.001 },
    });
    engineRef.current = engine;

    // Create boundary walls
    const { width, height } = container.getBoundingClientRect();
    const wt = wallThickness;

    const walls = [
      // top
      Matter.Bodies.rectangle(width / 2, -wt / 2, width + wt * 2, wt, { isStatic: true }),
      // bottom
      Matter.Bodies.rectangle(width / 2, height + wt / 2, width + wt * 2, wt, { isStatic: true }),
      // left
      Matter.Bodies.rectangle(-wt / 2, height / 2, wt, height + wt * 2, { isStatic: true }),
      // right
      Matter.Bodies.rectangle(width + wt / 2, height / 2, wt, height + wt * 2, { isStatic: true }),
    ];
    wallsRef.current = walls;
    Matter.Composite.add(engine.world, walls);

    // Mouse constraint for drag-and-throw
    const mouse = Matter.Mouse.create(container);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    mouseConstraintRef.current = mouseConstraint;
    Matter.Composite.add(engine.world, mouseConstraint);

    // Physics + DOM sync loop
    const loop = () => {
      Matter.Engine.update(engine, 1000 / 60);

      for (const { body, element } of bodiesRef.current) {
        const x = body.position.x - element.offsetWidth / 2;
        const y = body.position.y - element.offsetHeight / 2;
        const angle = body.angle;
        element.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`;
        element.style.position = "absolute";
        element.style.left = "0";
        element.style.top = "0";
      }

      renderLoopRef.current = requestAnimationFrame(loop);
    };
    renderLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (renderLoopRef.current) {
        cancelAnimationFrame(renderLoopRef.current);
      }
      Matter.Engine.clear(engine);
      bodiesRef.current = [];
    };
  }, [containerRef, wallThickness]);

  const addBody = useCallback(
    (element: HTMLElement, initialVelocity?: { x: number; y: number }) => {
      const engine = engineRef.current;
      if (!engine) return null;

      const rect = element.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return null;

      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;

      const body = Matter.Bodies.rectangle(x, y, rect.width, rect.height, {
        restitution: bounciness,
        friction,
        frictionAir,
        chamfer: { radius: 4 },
      });

      if (initialVelocity) {
        Matter.Body.setVelocity(body, initialVelocity);
      }

      Matter.Composite.add(engine.world, body);
      bodiesRef.current.push({ body, element });

      return body;
    },
    [containerRef, bounciness, friction, frictionAir]
  );

  const removeBody = useCallback((body: Matter.Body) => {
    const engine = engineRef.current;
    if (!engine) return;

    Matter.Composite.remove(engine.world, body);
    bodiesRef.current = bodiesRef.current.filter((b) => b.body !== body);
  }, []);

  const applyForce = useCallback(
    (body: Matter.Body, force: { x: number; y: number }) => {
      Matter.Body.applyForce(body, body.position, force);
    },
    []
  );

  return {
    engineRef,
    addBody,
    removeBody,
    applyForce,
    bodies: bodiesRef,
  };
}
