"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgressRef } from "@/hooks/useScrollProgress";
import { getActiveScene } from "@/lib/sceneConfig";

/**
 * Dynamic lighting system that shifts based on the current scene.
 */
export default function Lighting() {
  const scrollRef = useScrollProgressRef();
  const spotRef = useRef<THREE.SpotLight>(null);
  const blueRef = useRef<THREE.PointLight>(null);
  const cyanRef = useRef<THREE.PointLight>(null);
  const purpleRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const scene = getActiveScene(scrollRef.current);

    // Adjust light intensities per scene
    if (blueRef.current && cyanRef.current && purpleRef.current && spotRef.current) {
      let blueI = 0.5,
        cyanI = 0.3,
        purpleI = 0.3,
        spotI = 1.5;

      switch (scene) {
        case "greeting":
          blueI = 0.6;
          cyanI = 0.2;
          purpleI = 0.2;
          spotI = 2;
          break;
        case "projects":
          blueI = 0.8;
          cyanI = 0.5;
          purpleI = 0.3;
          spotI = 1.2;
          break;
        case "mind":
          blueI = 0.4;
          cyanI = 0.3;
          purpleI = 0.8;
          spotI = 0.5;
          break;
        case "showcase":
          blueI = 0.6;
          cyanI = 0.7;
          purpleI = 0.5;
          spotI = 1.5;
          break;
        case "trifecta":
          blueI = 0.5;
          cyanI = 0.8;
          purpleI = 0.8;
          spotI = 2;
          break;
        case "farewell":
          blueI = 0.4;
          cyanI = 0.3;
          purpleI = 0.2;
          spotI = 1.8;
          break;
      }

      blueRef.current.intensity = THREE.MathUtils.lerp(
        blueRef.current.intensity,
        blueI,
        0.03,
      );
      cyanRef.current.intensity = THREE.MathUtils.lerp(
        cyanRef.current.intensity,
        cyanI,
        0.03,
      );
      purpleRef.current.intensity = THREE.MathUtils.lerp(
        purpleRef.current.intensity,
        purpleI,
        0.03,
      );
      spotRef.current.intensity = THREE.MathUtils.lerp(
        spotRef.current.intensity,
        spotI,
        0.03,
      );
    }
  });

  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.2} color="#1a1a2e" />

      {/* Key spotlight from above-behind */}
      <spotLight
        ref={spotRef}
        position={[0, 8, 2]}
        angle={0.5}
        penumbra={0.8}
        intensity={2}
        color="#F0F0F5"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Colored point lights for accent */}
      <pointLight
        ref={blueRef}
        position={[-3, 2, 3]}
        intensity={0.5}
        color="#0A84FF"
        distance={12}
      />
      <pointLight
        ref={cyanRef}
        position={[3, 1.5, 2]}
        intensity={0.3}
        color="#00D4AA"
        distance={12}
      />
      <pointLight
        ref={purpleRef}
        position={[0, 3, -3]}
        intensity={0.3}
        color="#8B5CF6"
        distance={12}
      />

      {/* Subtle rim light behind avatar */}
      <pointLight
        position={[0, 2, -2]}
        intensity={0.6}
        color="#0A84FF"
        distance={8}
      />

      {/* Front fill light for avatar */}
      <pointLight
        position={[0, 1.5, 2.5]}
        intensity={0.8}
        color="#F0F0F5"
        distance={6}
      />
    </>
  );
}
