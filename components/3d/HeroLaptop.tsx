"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface HeroLaptopProps {
  scrollProgress: number;
}

export default function HeroLaptop({ scrollProgress }: HeroLaptopProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const screenGroupRef = useRef<THREE.Group>(null!);
  const { pointer } = useThree();

  const baseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#2d2d42"),
        metalness: 0.85,
        roughness: 0.15,
      }),
    [],
  );

  const screenFrameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#222238"),
        metalness: 0.9,
        roughness: 0.1,
      }),
    [],
  );

  const screenGlowMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0a3a2a"),
        emissive: new THREE.Color("#00D4AA"),
        emissiveIntensity: 0.8,
        metalness: 0.0,
        roughness: 1.0,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const hingeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#3a3a52"),
        metalness: 0.9,
        roughness: 0.2,
      }),
    [],
  );

  const keyboardMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1a30"),
        metalness: 0.6,
        roughness: 0.5,
      }),
    [],
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;

    groupRef.current.position.y = Math.sin(t * 0.8) * 0.12;
    groupRef.current.position.x = Math.cos(t * 0.5) * 0.06;

    const rotationSpeed = 0.06 + scrollProgress * 0.15;
    groupRef.current.rotation.y += rotationSpeed * state.clock.getDelta();

    const targetTiltX = -pointer.y * 0.15;
    const targetTiltZ = pointer.x * 0.1;
    groupRef.current.rotation.x +=
      (targetTiltX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.z +=
      (targetTiltZ - groupRef.current.rotation.z) * 0.05;

    if (screenGroupRef.current) {
      const scrollTilt = -scrollProgress * 0.4;
      screenGroupRef.current.rotation.x =
        -((80 * Math.PI) / 180) + scrollTilt;
    }

    screenGlowMaterial.emissiveIntensity =
      0.7 + Math.sin(t * 2) * 0.15 + Math.sin(t * 5.3) * 0.08;
  });

  const lidAngle = -(80 * Math.PI) / 180;

  return (
    <group ref={groupRef} scale={0.85} position={[0, -0.8, 0]}>
      {/* Base / bottom half */}
      <mesh material={baseMaterial} castShadow receiveShadow>
        <boxGeometry args={[3, 0.15, 2]} />
      </mesh>

      {/* Keyboard surface inset */}
      <mesh material={keyboardMaterial} position={[0, 0.076, -0.05]} receiveShadow>
        <boxGeometry args={[2.6, 0.01, 1.5]} />
      </mesh>

      {/* Trackpad */}
      <mesh material={hingeMaterial} position={[0, 0.076, 0.55]} receiveShadow>
        <boxGeometry args={[0.8, 0.005, 0.45]} />
      </mesh>

      {/* Hinge */}
      <mesh material={hingeMaterial} position={[0, 0.075, -0.98]}>
        <cylinderGeometry args={[0.04, 0.04, 2.6, 12]} />
      </mesh>

      {/* Screen / lid */}
      <group ref={screenGroupRef} position={[0, 0.075, -1.0]} rotation={[lidAngle, 0, 0]}>
        {/* Screen bezel / frame */}
        <mesh material={screenFrameMaterial} position={[0, 0.95, -0.025]} castShadow>
          <boxGeometry args={[2.9, 1.9, 0.06]} />
        </mesh>

        {/* Glowing screen face */}
        <mesh material={screenGlowMaterial} position={[0, 0.95, 0.01]}>
          <planeGeometry args={[2.6, 1.6]} />
        </mesh>

        {/* Screen code lines (decorative bars) */}
        {[0.45, 0.25, 0.05, -0.15, -0.35, -0.55].map((yOff, i) => (
          <mesh key={i} position={[-0.5 + (i % 3) * 0.15, 0.95 + yOff, 0.015]}>
            <planeGeometry args={[0.8 + (i % 4) * 0.2, 0.04]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#0A84FF" : "#00D4AA"}
              transparent
              opacity={0.4 + (i % 3) * 0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* Extra glow rim around screen */}
        <mesh position={[0, 0.95, 0.005]}>
          <planeGeometry args={[2.7, 1.7]} />
          <meshBasicMaterial color="#00D4AA" transparent opacity={0.04} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Subtle edge glow on the base */}
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.1, 2.1]} />
        <meshBasicMaterial color="#0A84FF" transparent opacity={0.03} />
      </mesh>
    </group>
  );
}
