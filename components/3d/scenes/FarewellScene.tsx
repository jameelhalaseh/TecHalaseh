"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgressRef } from "@/hooks/useScrollProgress";
import { isSceneVisible, getSceneProgress } from "@/lib/sceneConfig";

/**
 * Scene 6: Farewell — clean phases: Metrics → CV (centered) → Contact.
 * Only shows objects relevant to current phase. No clutter.
 */
export default function FarewellScene() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useScrollProgressRef();
  const docRef = useRef<THREE.Group>(null);
  const docGroupRef = useRef<THREE.Group>(null);
  const particlesGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const progress = scrollRef.current;
    if (!groupRef.current) return;

    const visible = isSceneVisible(progress, "farewell", 0.01);
    groupRef.current.visible = visible;
    if (!visible) return;

    const time = state.clock.elapsedTime;
    const sceneP = getSceneProgress(progress, "farewell");

    // Phase breakdown within farewell scene:
    // 0.0 - 0.35: Metrics (clean dark bg + subtle particles only)
    // 0.35 - 0.65: CV download (document centered, floating)
    // 0.65 - 1.0: Contact form (clean bg, no document)

    // CV document visibility
    if (docGroupRef.current) {
      const cvVisible = sceneP > 0.3 && sceneP < 0.7;
      const cvOpacity = cvVisible
        ? Math.min(1, (sceneP - 0.3) * 10) * Math.min(1, (0.7 - sceneP) * 10)
        : 0;

      docGroupRef.current.visible = cvOpacity > 0.01;
      // Apply opacity to document materials
      docGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.transparent = true;
          child.material.opacity = cvOpacity;
        }
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
          child.material.opacity = cvOpacity * 0.5;
        }
      });
    }

    // Animate floating document — CENTERED
    if (docRef.current && docGroupRef.current?.visible) {
      docRef.current.rotation.y = time * 0.25;
      docRef.current.position.y = 1.3 + Math.sin(time * 0.6) * 0.04;
    }

    // Animate subtle particles
    if (particlesGroupRef.current) {
      particlesGroupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.position.y += Math.sin(time * 0.3 + i) * 0.0005;
        }
      });
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Minimal ambient lighting */}
      <pointLight position={[-2, 3, 2]} color="#0A84FF" intensity={0.15} distance={10} />
      <pointLight position={[2, 3, 2]} color="#8B5CF6" intensity={0.1} distance={10} />

      {/* CV Document — CENTERED, behind text overlay */}
      <group ref={docGroupRef}>
        <group ref={docRef} position={[0, 1.3, -0.5]}>
          {/* Document body */}
          <mesh>
            <boxGeometry args={[0.5, 0.65, 0.01]} />
            <meshStandardMaterial
              color="#F0F0F5"
              emissive="#0A84FF"
              emissiveIntensity={0.08}
              metalness={0.1}
              roughness={0.8}
            />
          </mesh>
          {/* Text lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <mesh key={i} position={[-0.02, 0.25 - i * 0.05, 0.006]}>
              <planeGeometry args={[0.35 - (i % 3) * 0.06, 0.008]} />
              <meshBasicMaterial color="#6B6B80" transparent opacity={0.5} />
            </mesh>
          ))}
          {/* Header bar */}
          <mesh position={[0, 0.28, 0.006]}>
            <planeGeometry args={[0.4, 0.02]} />
            <meshBasicMaterial color="#0A84FF" transparent opacity={0.4} />
          </mesh>
          {/* Document glow */}
          <pointLight position={[0, 0, 0.5]} color="#0A84FF" intensity={0.3} distance={3} />
        </group>
      </group>

      {/* Clean floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#06060B" metalness={0.2} roughness={0.9} />
      </mesh>

      {/* Very subtle particles */}
      <group ref={particlesGroupRef}>
        {Array.from({ length: 15 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 8,
              0.5 + Math.random() * 3,
              (Math.random() - 0.5) * 6,
            ]}
          >
            <sphereGeometry args={[0.005, 4, 4]} />
            <meshBasicMaterial
              color={["#0A84FF", "#8B5CF6", "#00D4AA"][i % 3]}
              transparent
              opacity={0.2}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
