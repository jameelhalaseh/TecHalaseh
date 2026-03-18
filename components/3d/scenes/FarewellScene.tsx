"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgressRef } from "@/hooks/useScrollProgress";
import { isSceneVisible, getSceneProgress } from "@/lib/sceneConfig";

/**
 * Scene 6: The Farewell — warm, inviting space with CV document and contact.
 * Scroll: 88% → 100%
 */
export default function FarewellScene() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useScrollProgressRef();
  const docRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const progress = scrollRef.current;
    if (!groupRef.current) return;

    const visible = isSceneVisible(progress, "farewell", 0.03);
    groupRef.current.visible = visible;
    if (!visible) return;

    const time = state.clock.elapsedTime;
    const sceneP = getSceneProgress(progress, "farewell");

    // Rotate floating document
    if (docRef.current) {
      docRef.current.rotation.y = time * 0.3;
      docRef.current.position.y = 1.2 + Math.sin(time * 0.8) * 0.05;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Warm ambient lighting */}
      <pointLight position={[-2, 3, 1]} color="#FF6B35" intensity={0.3} distance={8} />
      <pointLight position={[2, 2, 2]} color="#0A84FF" intensity={0.2} distance={8} />

      {/* Floating CV document */}
      <group ref={docRef} position={[1.2, 1.2, -0.5]}>
        {/* Document body */}
        <mesh>
          <boxGeometry args={[0.4, 0.55, 0.01]} />
          <meshStandardMaterial
            color="#F0F0F5"
            emissive="#0A84FF"
            emissiveIntensity={0.05}
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
        {/* Text lines on document */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[-0.02, 0.2 - i * 0.06, 0.006]}>
            <planeGeometry args={[0.3 - (i % 3) * 0.05, 0.01]} />
            <meshBasicMaterial color="#6B6B80" transparent opacity={0.5} />
          </mesh>
        ))}
        {/* Document glow */}
        <pointLight position={[0, 0, 0.3]} color="#0A84FF" intensity={0.2} distance={2} />
      </group>

      {/* Background elements — subtle bookshelf */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={i}
          position={[-2.5 + i * 0.25, 2.2, -3]}
        >
          <boxGeometry args={[0.15, 0.3 + Math.random() * 0.2, 0.12]} />
          <meshStandardMaterial
            color={["#1A1A2E", "#111119", "#1A1A2E", "#2A2A3E", "#111119"][i]}
            roughness={0.8}
          />
        </mesh>
      ))}

      {/* Shelf */}
      <mesh position={[-2.25, 2.0, -3]}>
        <boxGeometry args={[1.5, 0.03, 0.2]} />
        <meshStandardMaterial color="#1A1A2E" roughness={0.6} />
      </mesh>

      {/* Warm floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial
          color="#0A0A12"
          metalness={0.2}
          roughness={0.8}
          emissive="#FF6B35"
          emissiveIntensity={0.01}
        />
      </mesh>

      {/* Soft particle motes */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 6,
            0.5 + Math.random() * 3,
            (Math.random() - 0.5) * 4,
          ]}
        >
          <sphereGeometry args={[0.006, 4, 4]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#FF6B35" : "#0A84FF"}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}
