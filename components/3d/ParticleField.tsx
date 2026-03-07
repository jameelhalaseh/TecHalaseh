"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*  ParticleField                                                             */
/*  ~150 instanced floating particles distributed within a sphere. Each       */
/*  particle has independent motion (amplitude, frequency, phase) and one     */
/*  of three accent colors. Uses a single InstancedMesh for performance.      */
/* -------------------------------------------------------------------------- */

const PARTICLE_COUNT = 150;
const SPHERE_RADIUS = 8;

/* accent palette */
const COLORS = [
  new THREE.Color("#0A84FF"), // blue
  new THREE.Color("#00D4AA"), // cyan
  new THREE.Color("#8B5CF6"), // purple
];

interface ParticleData {
  origin: THREE.Vector3;
  amplitude: THREE.Vector3;
  frequency: THREE.Vector3;
  phase: THREE.Vector3;
  scale: number;
  color: THREE.Color;
}

function randomInSphere(radius: number): THREE.Vector3 {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = radius * Math.cbrt(Math.random());
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  );
}

export default function ParticleField() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  /* Pre-compute per-particle motion data */
  const particles = useMemo<ParticleData[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      origin: randomInSphere(SPHERE_RADIUS),
      amplitude: new THREE.Vector3(
        0.15 + Math.random() * 0.45,
        0.15 + Math.random() * 0.45,
        0.15 + Math.random() * 0.45,
      ),
      frequency: new THREE.Vector3(
        0.3 + Math.random() * 0.9,
        0.3 + Math.random() * 0.9,
        0.3 + Math.random() * 0.9,
      ),
      phase: new THREE.Vector3(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ),
      scale: 0.03 + Math.random() * 0.05,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }, []);

  /* Scratch object reused each frame */
  const dummy = useMemo(() => new THREE.Object3D(), []);

  /* Apply per-instance colours once on mount */
  useEffect(() => {
    if (!meshRef.current) return;
    const tempColor = new THREE.Color();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      tempColor.copy(particles[i].color);
      meshRef.current.setColorAt(i, tempColor);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [particles]);

  /* Animate positions & scale each frame */
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];

      dummy.position.set(
        p.origin.x +
          Math.sin(t * p.frequency.x + p.phase.x) * p.amplitude.x,
        p.origin.y +
          Math.sin(t * p.frequency.y + p.phase.y) * p.amplitude.y,
        p.origin.z +
          Math.sin(t * p.frequency.z + p.phase.z) * p.amplitude.z,
      );

      /* gentle scale pulsing */
      const s = p.scale * (1 + Math.sin(t * 1.5 + p.phase.x) * 0.3);
      dummy.scale.setScalar(s);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.85} />
    </instancedMesh>
  );
}
