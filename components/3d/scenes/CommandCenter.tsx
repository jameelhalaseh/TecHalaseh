"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgressRef } from "@/hooks/useScrollProgress";
import { isSceneVisible, getSceneProgress } from "@/lib/sceneConfig";
import { PROJECTS } from "@/lib/constants";

/**
 * Scene 2: The Command Center — desk with floating holographic monitors.
 * Scroll: 15% → 40%
 */
export default function CommandCenter() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useScrollProgressRef();
  const monitorsRef = useRef<THREE.Group>(null);

  const monitorPositions = useMemo(
    () => [
      { pos: [-2, 1.4, -1.5] as [number, number, number], rot: 0.4, color: "#8B5CF6" },
      { pos: [-0.7, 1.4, -2] as [number, number, number], rot: 0.15, color: "#0A84FF" },
      { pos: [0.7, 1.4, -2] as [number, number, number], rot: -0.15, color: "#00D4AA" },
      { pos: [2, 1.4, -1.5] as [number, number, number], rot: -0.4, color: "#FF6B35" },
    ],
    [],
  );

  useFrame((state) => {
    const progress = scrollRef.current;
    if (!groupRef.current) return;

    const visible = isSceneVisible(progress, "projects", 0.05);
    groupRef.current.visible = visible;
    if (!visible) return;

    const sceneP = getSceneProgress(progress, "projects");
    const time = state.clock.elapsedTime;

    // Fade in the desk environment
    const fadeIn = Math.min(1, sceneP * 4);
    const fadeOut = sceneP > 0.9 ? 1 - (sceneP - 0.9) / 0.1 : 1;
    const opacity = fadeIn * fadeOut;

    // Animate monitors — gentle float
    if (monitorsRef.current) {
      monitorsRef.current.children.forEach((child, i) => {
        child.position.y =
          monitorPositions[i].pos[1] + Math.sin(time * 0.8 + i * 1.5) * 0.05;
      });
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Desk surface */}
      <mesh position={[0, 0.65, -1]} receiveShadow>
        <boxGeometry args={[4, 0.06, 1.5]} />
        <meshStandardMaterial
          color="#111119"
          metalness={0.5}
          roughness={0.3}
          emissive="#0A84FF"
          emissiveIntensity={0.02}
        />
      </mesh>

      {/* Desk legs */}
      {[-1.8, 1.8].map((x) => (
        <mesh key={x} position={[x, 0.32, -1]}>
          <boxGeometry args={[0.06, 0.65, 0.06]} />
          <meshStandardMaterial color="#0A0A12" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Desk accent strip */}
      <mesh position={[0, 0.68, -0.26]}>
        <boxGeometry args={[3.8, 0.008, 0.01]} />
        <meshBasicMaterial color="#0A84FF" transparent opacity={0.6} />
      </mesh>

      {/* Chair (simplified) */}
      <mesh position={[0, 0.5, 0.5]}>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial color="#111119" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.85, 0.75]}>
        <boxGeometry args={[0.5, 0.7, 0.06]} />
        <meshStandardMaterial color="#111119" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Holographic monitors */}
      <group ref={monitorsRef}>
        {monitorPositions.map((mon, i) => (
          <group key={i} position={mon.pos} rotation={[0, mon.rot, 0]}>
            {/* Screen frame */}
            <mesh>
              <boxGeometry args={[1.1, 0.7, 0.02]} />
              <meshStandardMaterial
                color="#0A0A12"
                metalness={0.8}
                roughness={0.2}
                emissive={mon.color}
                emissiveIntensity={0.05}
              />
            </mesh>
            {/* Screen surface — emissive glow */}
            <mesh position={[0, 0, 0.012]}>
              <planeGeometry args={[1.0, 0.6]} />
              <meshBasicMaterial
                color={mon.color}
                transparent
                opacity={0.15}
              />
            </mesh>
            {/* Screen scan line effect */}
            {Array.from({ length: 8 }).map((_, j) => (
              <mesh key={j} position={[0, -0.25 + j * 0.07, 0.015]}>
                <planeGeometry args={[0.95, 0.003]} />
                <meshBasicMaterial
                  color={mon.color}
                  transparent
                  opacity={0.1}
                />
              </mesh>
            ))}
            {/* Screen glow halo */}
            <pointLight
              position={[0, 0, 0.3]}
              color={mon.color}
              intensity={0.3}
              distance={2}
            />
            {/* Project label (3D text placeholder) */}
            <mesh position={[0, -0.42, 0.02]}>
              <planeGeometry args={[0.8, 0.06]} />
              <meshBasicMaterial
                color={mon.color}
                transparent
                opacity={0.3}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Room accent lines */}
      {[-3, 3].map((x) => (
        <mesh key={x} position={[x, 1.5, -3]}>
          <boxGeometry args={[0.005, 3, 0.005]} />
          <meshBasicMaterial color="#0A84FF" transparent opacity={0.2} />
        </mesh>
      ))}

      {/* Floor accent ring */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.52, 64]} />
        <meshBasicMaterial color="#0A84FF" transparent opacity={0.1} />
      </mesh>

      {/* Ambient particles for the room */}
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 8,
            Math.random() * 3,
            (Math.random() - 0.5) * 6 - 1,
          ]}
        >
          <sphereGeometry args={[0.008, 4, 4]} />
          <meshBasicMaterial
            color={["#0A84FF", "#00D4AA", "#8B5CF6"][i % 3]}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}
