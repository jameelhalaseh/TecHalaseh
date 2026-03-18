"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgressRef } from "@/hooks/useScrollProgress";
import { isSceneVisible, getSceneProgress } from "@/lib/sceneConfig";
import { SERVICES } from "@/lib/constants";

/**
 * Scene 4: Showcase — circular platform with holographic service panels.
 * Avatar turns to each panel. Active panel glows, others dim.
 */
export default function ShowcaseStage() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useScrollProgressRef();
  const cardsGroupRef = useRef<THREE.Group>(null);

  const cardPositions = useMemo(() => {
    return SERVICES.map((service, i) => {
      const angle = -Math.PI * 0.4 + (i / (SERVICES.length - 1)) * Math.PI * 0.8;
      return {
        ...service,
        x: Math.sin(angle) * 3,
        y: 1.5 + (i % 2) * 0.2,
        z: -Math.cos(angle) * 3,
        rotY: -angle,
        angle,
      };
    });
  }, []);

  useFrame((state) => {
    const progress = scrollRef.current;
    if (!groupRef.current) return;

    const visible = isSceneVisible(progress, "showcase", 0.01);
    groupRef.current.visible = visible;
    if (!visible) return;

    const time = state.clock.elapsedTime;
    const sceneP = getSceneProgress(progress, "showcase");

    // Determine active service: 0.08-0.88 maps to 5 services
    const serviceZone = Math.max(0, sceneP - 0.08) / 0.80; // 0→1 across service range
    const activeService = Math.min(4, Math.floor(serviceZone * 5));
    const allLit = sceneP > 0.88;

    if (cardsGroupRef.current) {
      cardsGroupRef.current.children.forEach((card, i) => {
        const isFocused = i === activeService || allLit;
        const baseY = cardPositions[i].y;

        // Float animation
        card.position.y = baseY + Math.sin(time * 0.5 + i * 1.2) * 0.04;
        card.rotation.y = cardPositions[i].rotY + Math.sin(time * 0.2 + i) * 0.02;

        // Scale: focused panels are larger
        const targetScale = isFocused ? 1.15 : 0.85;
        card.scale.x = THREE.MathUtils.lerp(card.scale.x, targetScale, 0.06);
        card.scale.y = THREE.MathUtils.lerp(card.scale.y, targetScale, 0.06);
        card.scale.z = THREE.MathUtils.lerp(card.scale.z, targetScale, 0.06);
      });
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Platform */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4, 64]} />
        <meshStandardMaterial color="#0A0A12" metalness={0.6} roughness={0.3} emissive="#0A84FF" emissiveIntensity={0.02} />
      </mesh>

      {/* Platform rings */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.9, 4.0, 64]} />
        <meshBasicMaterial color="#0A84FF" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.0, 3.02, 64]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.15} />
      </mesh>

      {/* Service hologram panels */}
      <group ref={cardsGroupRef}>
        {cardPositions.map((card, i) => (
          <group
            key={card.id}
            position={[card.x, card.y, card.z]}
            rotation={[0, card.rotY, 0]}
          >
            {/* Panel body — larger for readability */}
            <mesh>
              <boxGeometry args={[1.1, 0.75, 0.02]} />
              <meshStandardMaterial
                color="#111119"
                metalness={0.5}
                roughness={0.3}
                emissive={card.accent}
                emissiveIntensity={0.12}
                transparent
                opacity={0.9}
              />
            </mesh>
            {/* Panel border glow */}
            <mesh position={[0, 0, 0.011]}>
              <planeGeometry args={[1.12, 0.77]} />
              <meshBasicMaterial color={card.accent} transparent opacity={0.06} />
            </mesh>
            {/* Service icon area */}
            <mesh position={[0, 0.15, 0.015]}>
              <circleGeometry args={[0.1, 16]} />
              <meshBasicMaterial color={card.accent} transparent opacity={0.5} />
            </mesh>
            {/* Title line placeholder */}
            <mesh position={[0, -0.02, 0.015]}>
              <planeGeometry args={[0.6, 0.03]} />
              <meshBasicMaterial color={card.accent} transparent opacity={0.2} />
            </mesh>
            {/* Description lines */}
            {[0, 1].map((j) => (
              <mesh key={j} position={[0, -0.1 - j * 0.05, 0.015]}>
                <planeGeometry args={[0.7 - j * 0.1, 0.015]} />
                <meshBasicMaterial color="#A0A0B0" transparent opacity={0.1} />
              </mesh>
            ))}
            {/* Panel glow */}
            <pointLight position={[0, 0, 0.6]} color={card.accent} intensity={0.2} distance={2.5} />
          </group>
        ))}
      </group>

      {/* Platform accent lines */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 2, 0.01, Math.sin(angle) * 2]} rotation={[-Math.PI / 2, 0, angle]}>
            <planeGeometry args={[0.003, 2]} />
            <meshBasicMaterial color="#0A84FF" transparent opacity={0.1} />
          </mesh>
        );
      })}
    </group>
  );
}
