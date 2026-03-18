"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgressRef } from "@/hooks/useScrollProgress";
import { getActiveScene, getSceneProgress } from "@/lib/sceneConfig";

/**
 * Placeholder avatar — a stylized humanoid figure.
 * Replace with useGLTF + useAnimations when the real scanned model is ready.
 * The model URL is controlled by AVATAR_MODEL_URL in lib/constants.ts.
 */
export default function Avatar() {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const scrollRef = useScrollProgressRef();
  const { pointer } = useThree();

  // Avatar materials
  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#4a4a7e",
        metalness: 0.5,
        roughness: 0.3,
        emissive: "#0A84FF",
        emissiveIntensity: 0.25,
      }),
    [],
  );

  const headMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#5a5a8e",
        metalness: 0.4,
        roughness: 0.3,
        emissive: "#0A84FF",
        emissiveIntensity: 0.3,
      }),
    [],
  );

  const accentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0A84FF",
        emissive: "#0A84FF",
        emissiveIntensity: 1.0,
        metalness: 0.8,
        roughness: 0.2,
      }),
    [],
  );

  useFrame((state) => {
    if (!groupRef.current || !headRef.current) return;

    const progress = scrollRef.current;
    const scene = getActiveScene(progress);
    const sceneP = getSceneProgress(progress, scene);
    const time = state.clock.elapsedTime;

    // Idle breathing animation
    groupRef.current.position.y = Math.sin(time * 1.5) * 0.02;

    // Head tracking — follow pointer
    const targetRotX = -pointer.y * 0.3;
    const targetRotY = pointer.x * 0.4;
    headRef.current.rotation.x = THREE.MathUtils.lerp(
      headRef.current.rotation.x,
      targetRotX,
      0.05,
    );
    headRef.current.rotation.y = THREE.MathUtils.lerp(
      headRef.current.rotation.y,
      targetRotY,
      0.05,
    );

    // Scene-specific visibility — hide in mind (first-person) and farewell (form focus)
    const hidden = scene === "mind" || scene === "farewell";
    groupRef.current.visible = !hidden;

    // Scene-specific pose adjustments
    if (scene === "greeting") {
      // Standing pose with subtle wave at start
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        0,
        0.03,
      );
    } else if (scene === "projects") {
      // Seated-ish pose, slight lean
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        0.2,
        0.03,
      );
    } else if (scene === "showcase") {
      // Presenting pose — slight rotation
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        -0.15 + sceneP * 0.3,
        0.03,
      );
    } else if (scene === "trifecta") {
      // Centered, powerful
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        0,
        0.03,
      );
    } else if (scene === "farewell") {
      // Relaxed, facing camera
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        0,
        0.03,
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Body — torso capsule */}
      <mesh position={[0, 0.85, 0]} material={bodyMat} castShadow>
        <capsuleGeometry args={[0.22, 0.55, 8, 16]} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.22, 0]} material={bodyMat}>
        <cylinderGeometry args={[0.06, 0.08, 0.12, 8]} />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 1.45, 0]} material={headMat} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
        {/* Eyes — accent glow */}
        <mesh position={[-0.05, 0.02, 0.14]} material={accentMat}>
          <sphereGeometry args={[0.02, 8, 8]} />
        </mesh>
        <mesh position={[0.05, 0.02, 0.14]} material={accentMat}>
          <sphereGeometry args={[0.02, 8, 8]} />
        </mesh>
        {/* Visor / accent line across face */}
        <mesh position={[0, 0.02, 0.145]} material={accentMat}>
          <boxGeometry args={[0.2, 0.015, 0.01]} />
        </mesh>
      </mesh>

      {/* Shoulders */}
      <mesh position={[-0.3, 1.08, 0]} material={bodyMat}>
        <sphereGeometry args={[0.08, 8, 8]} />
      </mesh>
      <mesh position={[0.3, 1.08, 0]} material={bodyMat}>
        <sphereGeometry args={[0.08, 8, 8]} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.32, 0.82, 0.05]} rotation={[0.15, 0, 0.1]} material={bodyMat}>
        <capsuleGeometry args={[0.045, 0.35, 4, 8]} />
      </mesh>
      <mesh position={[0.32, 0.82, 0.05]} rotation={[0.15, 0, -0.1]} material={bodyMat}>
        <capsuleGeometry args={[0.045, 0.35, 4, 8]} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.1, 0.32, 0]} material={bodyMat}>
        <capsuleGeometry args={[0.06, 0.4, 4, 8]} />
      </mesh>
      <mesh position={[0.1, 0.32, 0]} material={bodyMat}>
        <capsuleGeometry args={[0.06, 0.4, 4, 8]} />
      </mesh>

      {/* Accent ring at chest — "core" glow */}
      <mesh position={[0, 0.95, 0]} rotation={[Math.PI / 2, 0, 0]} material={accentMat}>
        <torusGeometry args={[0.15, 0.008, 8, 32]} />
      </mesh>

      {/* Ground shadow/glow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 32]} />
        <meshBasicMaterial color="#0A84FF" transparent opacity={0.04} />
      </mesh>
    </group>
  );
}
