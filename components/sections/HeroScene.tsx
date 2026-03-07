"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import HeroLaptop from "@/components/3d/HeroLaptop";
import ParticleField from "@/components/3d/ParticleField";

/* -------------------------------------------------------------------------- */
/*  HeroScene                                                                 */
/*  Wraps the R3F Canvas + 3D children. This file is dynamically imported     */
/*  with ssr:false by Hero.tsx so Three.js never runs on the server.          */
/* -------------------------------------------------------------------------- */

interface HeroSceneProps {
  scrollProgress: number;
}

export default function HeroScene({ scrollProgress }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    >
      {/* Depth fog matching the background colour */}
      <fog attach="fog" args={["#0A0A0F", 8, 20]} />

      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight
        position={[-3, 2, 4]}
        intensity={0.5}
        color="#0A84FF"
      />
      <pointLight
        position={[3, -2, 3]}
        intensity={0.3}
        color="#8B5CF6"
      />

      <Suspense fallback={null}>
        <HeroLaptop scrollProgress={scrollProgress} />
        <ParticleField />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
