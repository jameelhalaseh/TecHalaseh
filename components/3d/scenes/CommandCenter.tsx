"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useScrollProgressRef } from "@/hooks/useScrollProgress";
import { isSceneVisible, getSceneProgress } from "@/lib/sceneConfig";
import { PROJECTS, type Project } from "@/lib/constants";

/**
 * Scene 2: Command Center — desk with 4 monitors, camera zooms into each one.
 * Monitors show UI mockup textures. Per-monitor scroll stops.
 */
export default function CommandCenter() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useScrollProgressRef();
  const monitorsRef = useRef<THREE.Group>(null);
  const [showHtml, setShowHtml] = useState(false);
  const [activeMonitor, setActiveMonitor] = useState(-1);
  const prevVisibleRef = useRef(false);
  const prevMonitorRef = useRef(-1);

  const monitorPositions = useMemo(
    () => [
      { pos: [-2, 1.4, -1.5] as [number, number, number], rot: 0.4, color: "#8B5CF6" },
      { pos: [-0.7, 1.4, -2] as [number, number, number], rot: 0.15, color: "#0A84FF" },
      { pos: [0.7, 1.4, -2] as [number, number, number], rot: -0.15, color: "#00D4AA" },
      { pos: [2, 1.4, -1.5] as [number, number, number], rot: -0.4, color: "#FF6B35" },
    ],
    [],
  );

  // Monitor UI mockup colors for canvas texture
  const monitorStyles = useMemo(
    () => [
      { bg: "#1a1025", bars: ["#8B5CF6", "#6D28D9", "#A78BFA"], type: "chat" },
      { bg: "#0a1628", bars: ["#0A84FF", "#3B82F6", "#60A5FA"], type: "dashboard" },
      { bg: "#0a1a1a", bars: ["#00D4AA", "#10B981", "#6EE7B7"], type: "browser" },
      { bg: "#1a120a", bars: ["#FF6B35", "#F59E0B", "#FBBF24"], type: "workflow" },
    ],
    [],
  );

  useFrame((state) => {
    const progress = scrollRef.current;
    if (!groupRef.current) return;

    const visible = isSceneVisible(progress, "projects", 0.01);
    groupRef.current.visible = visible;
    if (prevVisibleRef.current !== visible) {
      prevVisibleRef.current = visible;
      setShowHtml(visible);
    }
    if (!visible) return;

    const sceneP = getSceneProgress(progress, "projects");
    const time = state.clock.elapsedTime;

    // Determine which monitor is focused based on scroll progress
    // sceneP: 0-0.15 = establishing, 0.15-0.35 = mon0, 0.35-0.55 = mon1, 0.55-0.75 = mon2, 0.75-0.9 = mon3, 0.9-1.0 = pullback
    let newActive = -1;
    if (sceneP >= 0.15 && sceneP < 0.35) newActive = 0;
    else if (sceneP >= 0.35 && sceneP < 0.55) newActive = 1;
    else if (sceneP >= 0.55 && sceneP < 0.75) newActive = 2;
    else if (sceneP >= 0.75 && sceneP < 0.9) newActive = 3;

    if (prevMonitorRef.current !== newActive) {
      prevMonitorRef.current = newActive;
      setActiveMonitor(newActive);
    }

    // Animate monitors — gentle float + focus glow
    if (monitorsRef.current) {
      monitorsRef.current.children.forEach((child, i) => {
        if (monitorPositions[i]) {
          child.position.y = monitorPositions[i].pos[1] + Math.sin(time * 0.8 + i * 1.5) * 0.03;
          // Scale up the focused monitor
          const isFocused = i === newActive;
          const targetScale = isFocused ? 1.05 : 1;
          child.scale.x = THREE.MathUtils.lerp(child.scale.x, targetScale, 0.06);
          child.scale.y = THREE.MathUtils.lerp(child.scale.y, targetScale, 0.06);
          child.scale.z = THREE.MathUtils.lerp(child.scale.z, targetScale, 0.06);
        }
      });
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Desk surface */}
      <mesh position={[0, 0.65, -1]} receiveShadow>
        <boxGeometry args={[4, 0.06, 1.5]} />
        <meshStandardMaterial color="#111119" metalness={0.5} roughness={0.3} emissive="#0A84FF" emissiveIntensity={0.02} />
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

      {/* Chair */}
      <mesh position={[0, 0.5, 0.5]}>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial color="#111119" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.85, 0.75]}>
        <boxGeometry args={[0.5, 0.7, 0.06]} />
        <meshStandardMaterial color="#111119" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Monitors */}
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
                emissiveIntensity={activeMonitor === i ? 0.15 : 0.05}
              />
            </mesh>

            {/* Screen surface — UI mockup texture */}
            <mesh position={[0, 0, 0.012]}>
              <planeGeometry args={[1.1, 0.7]} />
              <meshBasicMaterial color={monitorStyles[i].bg} />
            </mesh>

            {/* UI mockup elements on screen */}
            <MonitorUI type={monitorStyles[i].type} color={mon.color} bars={monitorStyles[i].bars} />

            {/* Scan lines */}
            {Array.from({ length: 8 }).map((_, j) => (
              <mesh key={j} position={[0, -0.28 + j * 0.08, 0.014]}>
                <planeGeometry args={[1.08, 0.001]} />
                <meshBasicMaterial color={mon.color} transparent opacity={0.04} />
              </mesh>
            ))}

            {/* Screen glow */}
            <pointLight
              position={[0, 0, 0.5]}
              color={mon.color}
              intensity={activeMonitor === i ? 0.6 : 0.2}
              distance={2.5}
            />

            {/* Project HTML content — only on focused monitor */}
            {showHtml && PROJECTS[i] && activeMonitor === i && (
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

      {/* Ambient particles */}
      {Array.from({ length: 25 }).map((_, i) => (
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

/** Simple UI mockup elements rendered as 3D planes on the monitor screen */
function MonitorUI({ type, color, bars }: { type: string; color: string; bars: string[] }) {
  const baseZ = 0.013;

  if (type === "chat") {
    // Chat bubbles layout (GAIBE)
    return (
      <group>
        {/* Top bar */}
        <mesh position={[0, 0.3, baseZ]}>
          <planeGeometry args={[1.0, 0.04]} />
          <meshBasicMaterial color={bars[0]} transparent opacity={0.4} />
        </mesh>
        {/* Chat bubbles */}
        {[-0.12, 0.0, 0.12].map((y, i) => (
          <mesh key={i} position={[i % 2 === 0 ? -0.15 : 0.15, y, baseZ]}>
            <planeGeometry args={[0.5 + (i % 2) * 0.15, 0.08]} />
            <meshBasicMaterial color={bars[i % bars.length]} transparent opacity={0.2 + i * 0.05} />
          </mesh>
        ))}
        {/* Input bar */}
        <mesh position={[0, -0.28, baseZ]}>
          <planeGeometry args={[0.9, 0.04]} />
          <meshBasicMaterial color={bars[2]} transparent opacity={0.15} />
        </mesh>
      </group>
    );
  }

  if (type === "dashboard") {
    // Dashboard with cards (RM Tools)
    return (
      <group>
        {/* Header */}
        <mesh position={[0, 0.3, baseZ]}>
          <planeGeometry args={[1.0, 0.03]} />
          <meshBasicMaterial color={bars[0]} transparent opacity={0.5} />
        </mesh>
        {/* Cards grid */}
        {[
          [-0.3, 0.12], [0.3, 0.12],
          [-0.3, -0.08], [0.3, -0.08],
        ].map(([x, y], i) => (
          <mesh key={i} position={[x, y, baseZ]}>
            <planeGeometry args={[0.4, 0.14]} />
            <meshBasicMaterial color={bars[i % bars.length]} transparent opacity={0.12 + i * 0.03} />
          </mesh>
        ))}
        {/* Chart area */}
        <mesh position={[0, -0.24, baseZ]}>
          <planeGeometry args={[0.9, 0.06]} />
          <meshBasicMaterial color={bars[1]} transparent opacity={0.1} />
        </mesh>
      </group>
    );
  }

  if (type === "browser") {
    // Browser with extension popup (RAG Collector)
    return (
      <group>
        {/* Browser chrome */}
        <mesh position={[0, 0.31, baseZ]}>
          <planeGeometry args={[1.0, 0.06]} />
          <meshBasicMaterial color="#1a2a2a" transparent opacity={0.6} />
        </mesh>
        {/* URL bar */}
        <mesh position={[0.1, 0.31, baseZ + 0.001]}>
          <planeGeometry args={[0.6, 0.02]} />
          <meshBasicMaterial color={bars[0]} transparent opacity={0.3} />
        </mesh>
        {/* Extension popup */}
        <mesh position={[0.3, 0.1, baseZ]}>
          <planeGeometry args={[0.35, 0.3]} />
          <meshBasicMaterial color={bars[0]} transparent opacity={0.15} />
        </mesh>
        {/* Content lines */}
        {[-0.05, -0.15, -0.25].map((y, i) => (
          <mesh key={i} position={[-0.1, y, baseZ]}>
            <planeGeometry args={[0.5, 0.02]} />
            <meshBasicMaterial color={bars[1]} transparent opacity={0.08} />
          </mesh>
        ))}
      </group>
    );
  }

  // Workflow diagram (AI Pipeline)
  return (
    <group>
      {/* Nodes */}
      {[
        [-0.35, 0.15], [-0.1, 0.15], [0.15, 0.15], [0.4, 0.15],
        [-0.2, -0.1], [0.05, -0.1], [0.3, -0.1],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, baseZ]}>
          <planeGeometry args={[0.15, 0.1]} />
          <meshBasicMaterial color={bars[i % bars.length]} transparent opacity={0.2 + i * 0.02} />
        </mesh>
      ))}
      {/* Connection lines */}
      {[
        [-0.22, 0.15], [0.02, 0.15], [0.28, 0.15],
        [-0.1, 0.02], [0.15, 0.02],
      ].map(([x, y], i) => (
        <mesh key={`l${i}`} position={[x, y, baseZ]}>
          <planeGeometry args={[0.08, 0.003]} />
          <meshBasicMaterial color={bars[0]} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/** HTML content for focused monitor — large, readable */
function MonitorContent({ project, color }: { project: Project; color: string }) {
  return (
    <div
      style={{
        width: 320,
        padding: "20px 24px",
        fontFamily: "var(--font-body), 'Plus Jakarta Sans', system-ui, sans-serif",
        color: "#F0F0F5",
        background: "rgba(6, 6, 11, 0.9)",
        borderRadius: 16,
        border: `1px solid ${color}40`,
        backdropFilter: "blur(12px)",
        boxShadow: `0 0 40px ${color}20`,
        userSelect: "none",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display), 'Space Grotesk', system-ui, sans-serif",
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.3,
          color: "#F0F0F5",
          marginBottom: 10,
        }}
      >
        {project.title}
      </div>

      <div
        style={{
          fontSize: 11,
          lineHeight: 1.6,
          color: "#A0A0B0",
          letterSpacing: "0.01em",
          marginBottom: 12,
        }}
      >
        {project.description}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {project.tech.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
              fontSize: 9,
              padding: "3px 10px",
              borderRadius: 8,
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

      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 8px ${color}80`,
          }}
        />
        <span
          style={{
            fontSize: 10,
            color: color,
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          {project.stat}
        </span>
      </div>
    </div>
  );
}
