"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import HeroLaptop from "@/components/3d/HeroLaptop";
import ParticleField from "@/components/3d/ParticleField";

interface HeroSceneProps {
  scrollProgress: number;
}

export default function HeroScene({ scrollProgress }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 4.5], fov: 50 }}
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
      <fog attach="fog" args={["#0A0A0F", 10, 25]} />

      {/* Stronger lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-3, 2, 4]} intensity={0.8} color="#0A84FF" />
      <pointLight position={[3, -2, 3]} intensity={0.5} color="#8B5CF6" />
      <pointLight position={[0, 3, 2]} intensity={0.4} color="#00D4AA" />

      <Suspense fallback={null}>
        <HeroLaptop scrollProgress={scrollProgress} />
        <ParticleField />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
