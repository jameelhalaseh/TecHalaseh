"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*  HeroLaptop                                                                */
/*  A procedural 3D laptop built from primitives. Floats, bobs, and follows   */
/*  the cursor. scrollProgress (0-1) tilts it forward & speeds rotation.      */
/* -------------------------------------------------------------------------- */

interface HeroLaptopProps {
  scrollProgress: number;
}

export default function HeroLaptop({ scrollProgress }: HeroLaptopProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const screenGroupRef = useRef<THREE.Group>(null!);
  const { pointer } = useThree();

  /* ------- materials (memoised so they're only created once) ------- */
  const baseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1a2e"),
        metalness: 0.8,
        roughness: 0.2,
      }),
    [],
  );

  const screenFrameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1a2e"),
        metalness: 0.8,
        roughness: 0.2,
      }),
    [],
  );

  const screenGlowMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0a2a1a"),
        emissive: new THREE.Color("#00D4AA"),
        emissiveIntensity: 0.6,
        metalness: 0.1,
        roughness: 0.9,
      }),
    [],
  );

  const hingeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#2a2a3e"),
        metalness: 0.9,
        roughness: 0.3,
      }),
    [],
  );

  const keyboardMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#111122"),
        metalness: 0.5,
        roughness: 0.6,
      }),
    [],
  );

  /* ------- animation loop ------- */
  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;

    /* Floating bob & lateral drift */
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.12;
    groupRef.current.position.x = Math.cos(t * 0.5) * 0.06;

    /* Base Y-axis rotation, sped up by scroll */
    const rotationSpeed = 0.1 + scrollProgress * 0.25;
    groupRef.current.rotation.y += rotationSpeed * state.clock.getDelta();

    /* Cursor-tracking tilt (eased) */
    const targetTiltX = -pointer.y * 0.15;
    const targetTiltZ = pointer.x * 0.1;
    groupRef.current.rotation.x +=
      (targetTiltX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.z +=
      (targetTiltZ - groupRef.current.rotation.z) * 0.05;

    /* Scroll tilts the whole laptop forward */
    if (screenGroupRef.current) {
      const scrollTilt = -scrollProgress * 0.4; // tilt lid forward on scroll
      screenGroupRef.current.rotation.x =
        -((100 * Math.PI) / 180) + scrollTilt;
    }

    /* Pulse the screen glow */
    screenGlowMaterial.emissiveIntensity =
      0.5 + Math.sin(t * 2) * 0.15 + Math.sin(t * 5.3) * 0.08;
  });

  /* ------- hinge angle (100 degrees open) ------- */
  const lidAngle = -(100 * Math.PI) / 180;

  return (
    <group ref={groupRef} scale={0.75} position={[0, 0, 0]}>
      {/* ---- Base / bottom half ---- */}
      <mesh material={baseMaterial} castShadow receiveShadow>
        <boxGeometry args={[3, 0.15, 2]} />
      </mesh>

      {/* Keyboard surface inset */}
      <mesh
        material={keyboardMaterial}
        position={[0, 0.076, -0.05]}
        receiveShadow
      >
        <boxGeometry args={[2.6, 0.01, 1.5]} />
      </mesh>

      {/* Trackpad */}
      <mesh material={hingeMaterial} position={[0, 0.076, 0.55]} receiveShadow>
        <boxGeometry args={[0.8, 0.005, 0.45]} />
      </mesh>

      {/* ---- Hinge ---- */}
      <mesh material={hingeMaterial} position={[0, 0.075, -0.98]}>
        <cylinderGeometry args={[0.04, 0.04, 2.6, 12]} />
        <primitive object={hingeMaterial} attach="material" />
      </mesh>

      {/* ---- Screen / lid (pivots at the hinge) ---- */}
      <group
        ref={screenGroupRef}
        position={[0, 0.075, -1.0]}
        rotation={[lidAngle, 0, 0]}
      >
        {/* Screen bezel / frame */}
        <mesh
          material={screenFrameMaterial}
          position={[0, 0.95, -0.025]}
          castShadow
        >
          <boxGeometry args={[2.9, 1.9, 0.06]} />
        </mesh>

        {/* Glowing screen face */}
        <mesh material={screenGlowMaterial} position={[0, 0.95, 0.01]}>
          <planeGeometry args={[2.6, 1.6]} />
        </mesh>

        {/* Screen code lines (decorative bars) */}
        {[0.45, 0.25, 0.05, -0.15, -0.35, -0.55].map((yOff, i) => (
          <mesh
            key={i}
            position={[-0.5 + (i % 3) * 0.15, 0.95 + yOff, 0.015]}
          >
            <planeGeometry args={[0.8 + (i % 4) * 0.2, 0.04]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#0A84FF" : "#00D4AA"}
              transparent
              opacity={0.25 + (i % 3) * 0.12}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
