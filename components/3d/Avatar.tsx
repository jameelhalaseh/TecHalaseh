"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgressRef } from "@/hooks/useScrollProgress";
import { getActiveScene, getSceneProgress } from "@/lib/sceneConfig";

/**
 * Procedural avatar with scene-specific poses and smooth visibility transitions.
 */
export default function Avatar() {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const scrollRef = useScrollProgressRef();
  const { pointer } = useThree();
  const opacityRef = useRef(1);

  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#4a4a7e",
        metalness: 0.5,
        roughness: 0.3,
        emissive: "#0A84FF",
        emissiveIntensity: 0.25,
        transparent: true,
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
        transparent: true,
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
        transparent: true,
      }),
    [],
  );

  useFrame((state) => {
    if (!groupRef.current || !headRef.current) return;

    const progress = scrollRef.current;
    const scene = getActiveScene(progress);
    const sceneP = getSceneProgress(progress, scene);
    const time = state.clock.elapsedTime;

    // Determine target opacity — fade out smoothly for mind and farewell
    let targetOpacity = 1;
    if (scene === "mind") {
      // Fade out as we enter mind (first 15%), fade back in at exit (last 15%)
      if (sceneP < 0.15) targetOpacity = 1 - sceneP / 0.15;
      else if (sceneP > 0.85) targetOpacity = (sceneP - 0.85) / 0.15;
      else targetOpacity = 0;
    } else if (scene === "farewell") {
      // Fully hidden during farewell — clean scenes for metrics, CV, contact
      targetOpacity = 0;
    }

    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, 0.08);
    const op = opacityRef.current;

    // Apply opacity to all materials
    bodyMat.opacity = op;
    headMat.opacity = op;
    accentMat.opacity = op;
    groupRef.current.visible = op > 0.01;

    if (op <= 0.01) return;

    // Idle breathing
    const breathOffset = Math.sin(time * 1.5) * 0.02;

    // Head tracking — follow pointer
    const targetRotX = -pointer.y * 0.3;
    const targetRotY = pointer.x * 0.4;
    headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.05);
    headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.05);

    // Scene-specific poses
    if (scene === "greeting") {
      groupRef.current.position.y = breathOffset;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.03);
    } else if (scene === "projects") {
      // Seated at desk — lower Y, slight lean
      groupRef.current.position.y = -0.35 + breathOffset;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0.1, 0.03);
    } else if (scene === "showcase") {
      // Standing on platform, rotating toward active service panel
      groupRef.current.position.y = breathOffset;
      const serviceIdx = Math.min(4, Math.floor(Math.max(0, sceneP - 0.08) / 0.16));
      const angles = [-0.6, -0.3, 0, 0.3, 0.6];
      const targetRot = sceneP < 0.08 ? 0 : angles[serviceIdx];
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRot,
        0.04,
      );
    } else if (scene === "trifecta") {
      groupRef.current.position.y = breathOffset;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.03);
    } else if (scene === "farewell") {
      // Off to the side for contact
      groupRef.current.position.y = breathOffset;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 2.5, 0.03);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -0.5, 0.03);
    }

    // Reset x position when not in farewell
    if (scene !== "farewell") {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.05);
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
        {/* Eyes */}
        <mesh position={[-0.05, 0.02, 0.14]} material={accentMat}>
          <sphereGeometry args={[0.02, 8, 8]} />
        </mesh>
        <mesh position={[0.05, 0.02, 0.14]} material={accentMat}>
          <sphereGeometry args={[0.02, 8, 8]} />
        </mesh>
        {/* Visor line */}
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

      {/* Core glow ring */}
      <mesh position={[0, 0.95, 0]} rotation={[Math.PI / 2, 0, 0]} material={accentMat}>
        <torusGeometry args={[0.15, 0.008, 8, 32]} />
      </mesh>

      {/* Ground shadow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 32]} />
        <meshBasicMaterial color="#0A84FF" transparent opacity={0.04} />
      </mesh>
    </group>
  );
}
