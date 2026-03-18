"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgressRef } from "@/hooks/useScrollProgress";
import { isSceneVisible, getSceneProgress } from "@/lib/sceneConfig";

const PARTICLE_COUNT = 200;

/**
 * Scene 1: The Greeting — dark void with fog, particles, and spotlight on avatar.
 * Scroll: 0% → 15%
 */
export default function GreetingScene() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useScrollProgressRef();
  const particlesRef = useRef<THREE.InstancedMesh>(null);

  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      data.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          Math.random() * 8,
          (Math.random() - 0.5) * 20,
        ),
        speed: 0.1 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        scale: 0.01 + Math.random() * 0.03,
        color: new THREE.Color(
          ["#0A84FF", "#00D4AA", "#8B5CF6"][Math.floor(Math.random() * 3)],
        ),
      });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const progress = scrollRef.current;
    if (!groupRef.current) return;

    const visible = isSceneVisible(progress, "greeting", 0.05);
    groupRef.current.visible = visible;
    if (!visible || !particlesRef.current) return;

    const time = state.clock.elapsedTime;
    const sceneP = getSceneProgress(progress, "greeting");

    // Animate particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const d = particleData[i];
      dummy.position.set(
        d.position.x + Math.sin(time * d.speed + d.phase) * 0.5,
        d.position.y + Math.sin(time * d.speed * 0.5 + d.phase) * 0.3,
        d.position.z + Math.cos(time * d.speed + d.phase) * 0.5,
      );

      const pulse = 0.8 + Math.sin(time * 2 + d.phase) * 0.2;
      dummy.scale.setScalar(d.scale * pulse);
      dummy.updateMatrix();
      particlesRef.current.setMatrixAt(i, dummy.matrix);
      particlesRef.current.setColorAt(i, d.color);
    }
    particlesRef.current.instanceMatrix.needsUpdate = true;
    if (particlesRef.current.instanceColor) {
      particlesRef.current.instanceColor.needsUpdate = true;
    }

    // Fade scene opacity based on exit progress
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
        const opacity = sceneP < 0.8 ? 1 : 1 - (sceneP - 0.8) / 0.2;
        if ("opacity" in child.material) {
          child.material.opacity = opacity;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Ground grid */}
      <gridHelper
        args={[40, 80, "#0A84FF", "#111119"]}
        position={[0, 0, 0]}
        material-transparent
        material-opacity={0.15}
      />

      {/* Floating particles */}
      <instancedMesh
        ref={particlesRef}
        args={[undefined, undefined, PARTICLE_COUNT]}
      >
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial transparent opacity={0.8} />
      </instancedMesh>

      {/* Subtle aurora / nebula glow in background */}
      <mesh position={[0, 5, -15]} rotation={[0, 0, 0]}>
        <planeGeometry args={[30, 10]} />
        <meshBasicMaterial
          color="#0A84FF"
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[5, 6, -18]}>
        <planeGeometry args={[20, 8]} />
        <meshBasicMaterial
          color="#8B5CF6"
          transparent
          opacity={0.025}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Volumetric spotlight cone (visual) */}
      <mesh position={[0, 4, 0]}>
        <coneGeometry args={[2.5, 7, 32, 1, true]} />
        <meshBasicMaterial
          color="#F0F0F5"
          transparent
          opacity={0.006}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
