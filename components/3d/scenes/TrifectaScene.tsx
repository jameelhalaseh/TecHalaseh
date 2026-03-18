"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgressRef } from "@/hooks/useScrollProgress";
import { isSceneVisible, getSceneProgress } from "@/lib/sceneConfig";

/**
 * Scene 5: The Trifecta — Shield, Laptop, Brain pillars with phased reveals.
 * Objects appear one by one and STAY visible. Shield uses proper extruded shape.
 */
export default function TrifectaScene() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useScrollProgressRef();
  const shieldRef = useRef<THREE.Group>(null);
  const laptopRef = useRef<THREE.Group>(null);
  const brainRef = useRef<THREE.Group>(null);

  // Create shield shape geometry
  const shieldGeom = useMemo(() => {
    const shape = new THREE.Shape();
    // Shield: rounded top, pointed bottom
    shape.moveTo(0, -0.35);
    shape.lineTo(-0.22, -0.05);
    shape.lineTo(-0.25, 0.1);
    shape.quadraticCurveTo(-0.25, 0.3, -0.15, 0.35);
    shape.quadraticCurveTo(0, 0.42, 0.15, 0.35);
    shape.quadraticCurveTo(0.25, 0.3, 0.25, 0.1);
    shape.lineTo(0.22, -0.05);
    shape.lineTo(0, -0.35);

    const extrudeSettings = {
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 3,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // Inner shield shape (smaller)
  const shieldInnerGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.25);
    shape.lineTo(-0.15, -0.02);
    shape.lineTo(-0.17, 0.08);
    shape.quadraticCurveTo(-0.17, 0.22, -0.1, 0.25);
    shape.quadraticCurveTo(0, 0.3, 0.1, 0.25);
    shape.quadraticCurveTo(0.17, 0.22, 0.17, 0.08);
    shape.lineTo(0.15, -0.02);
    shape.lineTo(0, -0.25);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.02,
      bevelEnabled: false,
    });
  }, []);

  useFrame((state) => {
    const progress = scrollRef.current;
    if (!groupRef.current) return;

    const visible = isSceneVisible(progress, "trifecta", 0.01);
    groupRef.current.visible = visible;
    if (!visible) return;

    const sceneP = getSceneProgress(progress, "trifecta");
    const time = state.clock.elapsedTime;

    // Phase-based reveals — objects scale in and STAY
    const shieldPhase = Math.min(1, sceneP * 4); // 0-25%: shield appears
    const laptopPhase = Math.min(1, Math.max(0, (sceneP - 0.2) * 4)); // 20-45%: laptop appears
    const brainPhase = Math.min(1, Math.max(0, (sceneP - 0.4) * 4)); // 40-65%: brain appears
    const allVisible = sceneP > 0.6;

    // Shield — LEFT of avatar
    if (shieldRef.current) {
      const s = shieldPhase * shieldPhase; // Ease-in
      shieldRef.current.scale.setScalar(s);
      shieldRef.current.rotation.y = time * 0.4;
      // Position: always left, slight adjustment when all visible
      shieldRef.current.position.set(
        -1.5,
        1.2 + Math.sin(time * 0.7) * 0.03,
        allVisible ? 0.5 : 0.3,
      );
    }

    // Laptop — TOP CENTER (above avatar)
    if (laptopRef.current) {
      const s = laptopPhase * laptopPhase;
      laptopRef.current.scale.setScalar(s);
      laptopRef.current.rotation.y = -time * 0.25;
      laptopRef.current.position.set(
        0,
        1.8 + Math.sin(time * 0.6 + 1) * 0.03,
        allVisible ? 1.2 : 0.8,
      );
    }

    // Brain — RIGHT of avatar
    if (brainRef.current) {
      const s = brainPhase * brainPhase;
      brainRef.current.scale.setScalar(s);
      brainRef.current.rotation.y = time * 0.6;
      brainRef.current.rotation.x = Math.sin(time * 0.4) * 0.1;
      brainRef.current.position.set(
        1.5,
        1.4 + Math.sin(time * 0.8 + 2) * 0.03,
        allVisible ? 0.5 : 0.3,
      );
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Three spotlights */}
      <spotLight position={[-2, 5, 2]} angle={0.4} penumbra={0.8} intensity={1.2} color="#00D4AA" distance={10} />
      <spotLight position={[0, 5, 2]} angle={0.4} penumbra={0.8} intensity={1.2} color="#0A84FF" distance={10} />
      <spotLight position={[2, 5, 2]} angle={0.4} penumbra={0.8} intensity={1.2} color="#8B5CF6" distance={10} />

      {/* ── SHIELD — Cybersecurity ── */}
      <group ref={shieldRef}>
        {/* Main shield body */}
        <mesh geometry={shieldGeom} rotation={[0, 0, 0]}>
          <meshStandardMaterial
            color="#00D4AA"
            emissive="#00D4AA"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.15}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Inner shield detail */}
        <mesh geometry={shieldInnerGeom} position={[0, 0, 0.02]}>
          <meshStandardMaterial
            color="#111119"
            emissive="#00D4AA"
            emissiveIntensity={0.3}
            metalness={0.6}
            roughness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Checkmark on shield */}
        <mesh position={[0, 0.05, 0.05]}>
          <boxGeometry args={[0.12, 0.02, 0.01]} />
          <meshBasicMaterial color="#00D4AA" />
        </mesh>
        {/* Orbiting particles */}
        {Array.from({ length: 16 }).map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.012, 4, 4]} />
            <meshBasicMaterial color="#00D4AA" transparent opacity={0.7} />
          </mesh>
        ))}
        {/* Shield glow */}
        <pointLight position={[0, 0, 0.3]} color="#00D4AA" intensity={0.8} distance={3} />
      </group>

      {/* ── LAPTOP — Development ── */}
      <group ref={laptopRef}>
        {/* Base */}
        <mesh position={[0, -0.05, 0]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.5, 0.02, 0.35]} />
          <meshStandardMaterial color="#1A1A2E" metalness={0.7} roughness={0.2} emissive="#0A84FF" emissiveIntensity={0.1} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0.15, -0.15]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.48, 0.3, 0.01]} />
          <meshStandardMaterial color="#0A84FF" emissive="#0A84FF" emissiveIntensity={0.35} metalness={0.5} roughness={0.3} transparent opacity={0.85} />
        </mesh>
        {/* Code lines on screen */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} position={[-0.08 + (i % 2) * 0.03, 0.2 - i * 0.04, -0.135]} rotation={[0.3, 0, 0]}>
            <planeGeometry args={[0.2 + (i % 3) * 0.06, 0.008]} />
            <meshBasicMaterial color="#60A5FA" transparent opacity={0.4} />
          </mesh>
        ))}
        {/* Keyboard dots */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={`k${i}`} position={[-0.15 + i * 0.06, -0.035, -0.05 + (i % 2) * 0.06]}>
            <boxGeometry args={[0.04, 0.005, 0.04]} />
            <meshBasicMaterial color="#0A84FF" transparent opacity={0.3} />
          </mesh>
        ))}
        <pointLight position={[0, 0.1, 0]} color="#0A84FF" intensity={0.6} distance={3} />
      </group>

      {/* ── BRAIN — AI ── */}
      <group ref={brainRef}>
        {/* Wireframe outer */}
        <mesh>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={0.5} metalness={0.6} roughness={0.3} wireframe />
        </mesh>
        {/* Inner core */}
        <mesh>
          <icosahedronGeometry args={[0.15, 0]} />
          <meshBasicMaterial color="#8B5CF6" transparent opacity={0.6} />
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
        <pointLight position={[0, 0, 0.3]} color="#8B5CF6" intensity={0.6} distance={3} />
      </group>

      {/* Ground */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial color="#06060B" metalness={0.3} roughness={0.7} />
      </mesh>
    </group>
  );
}
