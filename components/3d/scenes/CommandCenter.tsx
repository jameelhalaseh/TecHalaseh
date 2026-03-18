"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useScrollProgressRef } from "@/hooks/useScrollProgress";
import { isSceneVisible, getSceneProgress } from "@/lib/sceneConfig";
import { PROJECTS, type Project } from "@/lib/constants";

/**
 * Scene 2: The Command Center — desk with floating holographic monitors.
 * Project details render directly ON each monitor screen using drei Html.
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

    const time = state.clock.elapsedTime;

    // Animate monitors — gentle float
    if (monitorsRef.current) {
      monitorsRef.current.children.forEach((child, i) => {
        if (monitorPositions[i]) {
          child.position.y =
            monitorPositions[i].pos[1] + Math.sin(time * 0.8 + i * 1.5) * 0.05;
        }
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

      {/* Holographic monitors with project content ON screen */}
      <group ref={monitorsRef}>
        {monitorPositions.map((mon, i) => (
          <group key={i} position={mon.pos} rotation={[0, mon.rot, 0]}>
            {/* Screen frame */}
            <mesh>
              <boxGeometry args={[1.2, 0.8, 0.02]} />
              <meshStandardMaterial
                color="#0A0A12"
                metalness={0.8}
                roughness={0.2}
                emissive={mon.color}
                emissiveIntensity={0.05}
              />
            </mesh>

            {/* Screen surface — dark background glow */}
            <mesh position={[0, 0, 0.012]}>
              <planeGeometry args={[1.1, 0.7]} />
              <meshBasicMaterial
                color={mon.color}
                transparent
                opacity={0.08}
              />
            </mesh>

            {/* Scan lines for holographic feel */}
            {Array.from({ length: 10 }).map((_, j) => (
              <mesh key={j} position={[0, -0.3 + j * 0.065, 0.014]}>
                <planeGeometry args={[1.08, 0.002]} />
                <meshBasicMaterial
                  color={mon.color}
                  transparent
                  opacity={0.06}
                />
              </mesh>
            ))}

            {/* Screen glow halo */}
            <pointLight
              position={[0, 0, 0.4]}
              color={mon.color}
              intensity={0.3}
              distance={2}
            />

            {/* Project details rendered as HTML on the screen */}
            {PROJECTS[i] && (
              <Html
                position={[0, 0, 0.02]}
                transform
                occlude={false}
                distanceFactor={1.2}
                style={{ pointerEvents: "none" }}
              >
                <MonitorContent project={PROJECTS[i]} color={mon.color} />
              </Html>
            )}
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

/**
 * HTML content rendered directly on a 3D monitor screen.
 */
function MonitorContent({ project, color }: { project: Project; color: string }) {
  return (
    <div
      style={{
        width: 280,
        padding: "16px 20px",
        fontFamily: "var(--font-body), 'Plus Jakarta Sans', system-ui, sans-serif",
        color: "#F0F0F5",
        background: "rgba(6, 6, 11, 0.85)",
        borderRadius: 12,
        border: `1px solid ${color}30`,
        backdropFilter: "blur(8px)",
        userSelect: "none",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontFamily: "var(--font-display), 'Space Grotesk', system-ui, sans-serif",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.3,
          color: "#F0F0F5",
          marginBottom: 8,
        }}
      >
        {project.title}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: 10,
          lineHeight: 1.5,
          color: "#A0A0B0",
          letterSpacing: "0.01em",
          marginBottom: 10,
        }}
      >
        {project.description}
      </div>

      {/* Tech tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {project.tech.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
              fontSize: 8,
              padding: "2px 8px",
              borderRadius: 6,
              background: `${color}18`,
              border: `1px solid ${color}35`,
              color: color,
              letterSpacing: "0.02em",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Stat line */}
      <div
        style={{
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 6px ${color}80`,
          }}
        />
        <span
          style={{
            fontSize: 9,
            color: "#6B6B80",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          {project.stat}
        </span>
      </div>
    </div>
  );
}
