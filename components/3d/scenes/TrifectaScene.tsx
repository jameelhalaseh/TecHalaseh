"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgressRef } from "@/hooks/useScrollProgress";
import { isSceneVisible, getSceneProgress } from "@/lib/sceneConfig";

/**
 * Scene 5: The Trifecta — three pillars (Shield, Laptop, Brain) reveal.
 * Scroll: 75% → 88%
 */
export default function TrifectaScene() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useScrollProgressRef();
  const shieldRef = useRef<THREE.Group>(null);
  const laptopRef = useRef<THREE.Group>(null);
  const brainRef = useRef<THREE.Group>(null);

  // Orbiting particles for each pillar
  const particleRings = useMemo(() => {
    return [
      { color: "#00D4AA", count: 20, radius: 0.6 },
      { color: "#0A84FF", count: 20, radius: 0.6 },
      { color: "#8B5CF6", count: 20, radius: 0.6 },
    ];
  }, []);

  useFrame((state) => {
    const progress = scrollRef.current;
    if (!groupRef.current) return;

    const visible = isSceneVisible(progress, "trifecta", 0.03);
    groupRef.current.visible = visible;
    if (!visible) return;

    const sceneP = getSceneProgress(progress, "trifecta");
    const time = state.clock.elapsedTime;

    // Phase-based reveals
    const shieldPhase = Math.max(0, Math.min(1, sceneP * 4)); // 0-25% of scene
    const laptopPhase = Math.max(0, Math.min(1, (sceneP - 0.25) * 4)); // 25-50%
    const brainPhase = Math.max(0, Math.min(1, (sceneP - 0.5) * 4)); // 50-75%
    const allPhase = Math.max(0, Math.min(1, (sceneP - 0.75) * 4)); // 75-100%

    // Animate shield
    if (shieldRef.current) {
      const scale = shieldPhase;
      shieldRef.current.scale.setScalar(scale);
      shieldRef.current.rotation.y = time * 0.5;
      shieldRef.current.position.set(
        allPhase > 0 ? -1.5 : 0.8,
        1.2,
        allPhase > 0 ? 0.5 : 0,
      );
    }

    // Animate laptop
    if (laptopRef.current) {
      const scale = laptopPhase;
      laptopRef.current.scale.setScalar(scale);
      laptopRef.current.rotation.y = -time * 0.3;
      laptopRef.current.position.set(
        allPhase > 0 ? 0 : -0.8,
        allPhase > 0 ? 1.0 : 1.2,
        allPhase > 0 ? 1.5 : 0,
      );
    }

    // Animate brain
    if (brainRef.current) {
      const scale = brainPhase;
      brainRef.current.scale.setScalar(scale);
      brainRef.current.rotation.y = time * 0.7;
      brainRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      brainRef.current.position.set(
        allPhase > 0 ? 1.5 : 0,
        allPhase > 0 ? 1.4 : 1.8,
        allPhase > 0 ? 0.5 : 0,
      );
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Three spotlights */}
      <spotLight
        position={[-2, 5, 2]}
        angle={0.4}
        penumbra={0.8}
        intensity={1}
        color="#00D4AA"
        distance={10}
      />
      <spotLight
        position={[0, 5, 2]}
        angle={0.4}
        penumbra={0.8}
        intensity={1}
        color="#0A84FF"
        distance={10}
      />
      <spotLight
        position={[2, 5, 2]}
        angle={0.4}
        penumbra={0.8}
        intensity={1}
        color="#8B5CF6"
        distance={10}
      />

      {/* Shield — cybersecurity */}
      <group ref={shieldRef}>
        <mesh>
          <cylinderGeometry args={[0, 0.4, 0.5, 6]} />
          <meshStandardMaterial
            color="#00D4AA"
            emissive="#00D4AA"
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Shield inner */}
        <mesh position={[0, 0, 0.01]}>
          <cylinderGeometry args={[0, 0.3, 0.4, 6]} />
          <meshStandardMaterial
            color="#111119"
            emissive="#00D4AA"
            emissiveIntensity={0.2}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        {/* Orbiting particles */}
        {Array.from({ length: particleRings[0].count }).map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.015, 4, 4]} />
            <meshBasicMaterial color="#00D4AA" transparent opacity={0.7} />
          </mesh>
        ))}
      </group>

      {/* Laptop — development */}
      <group ref={laptopRef}>
        {/* Base */}
        <mesh position={[0, -0.05, 0]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.5, 0.02, 0.35]} />
          <meshStandardMaterial
            color="#1A1A2E"
            metalness={0.7}
            roughness={0.2}
            emissive="#0A84FF"
            emissiveIntensity={0.1}
          />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0.15, -0.15]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.48, 0.3, 0.01]} />
          <meshStandardMaterial
            color="#0A84FF"
            emissive="#0A84FF"
            emissiveIntensity={0.3}
            metalness={0.5}
            roughness={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Keyboard dots */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh
            key={i}
            position={[-0.15 + i * 0.06, -0.035, -0.05 + (i % 2) * 0.06]}
          >
            <boxGeometry args={[0.04, 0.005, 0.04]} />
            <meshBasicMaterial color="#0A84FF" transparent opacity={0.3} />
          </mesh>
        ))}
      </group>

      {/* Brain — AI */}
      <group ref={brainRef}>
        <mesh>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial
            color="#8B5CF6"
            emissive="#8B5CF6"
            emissiveIntensity={0.4}
            metalness={0.6}
            roughness={0.3}
            wireframe
          />
        </mesh>
        {/* Inner core */}
        <mesh>
          <icosahedronGeometry args={[0.15, 0]} />
          <meshBasicMaterial
            color="#8B5CF6"
            transparent
            opacity={0.6}
          />
        </mesh>
        {/* Neural sparks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const theta = (i / 12) * Math.PI * 2;
          const phi = Math.acos(2 * (i / 12) - 1);
          return (
            <mesh
              key={i}
              position={[
                Math.sin(phi) * Math.cos(theta) * 0.35,
                Math.sin(phi) * Math.sin(theta) * 0.35,
                Math.cos(phi) * 0.35,
              ]}
            >
              <sphereGeometry args={[0.02, 4, 4]} />
              <meshBasicMaterial color="#8B5CF6" transparent opacity={0.8} />
            </mesh>
          );
        })}
      </group>

      {/* Ground */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial
          color="#06060B"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
}
