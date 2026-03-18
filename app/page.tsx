"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { SCROLL_HEIGHT_VH } from "@/lib/sceneConfig";
import Navbar from "@/components/ui/Navbar";
import SceneIndicator from "@/components/ui/SceneIndicator";
import LoadingScreen from "@/components/ui/LoadingScreen";
import HeroOverlay from "@/components/overlays/HeroOverlay";
import ProjectOverlay from "@/components/overlays/ProjectOverlay";
import ProcessOverlay from "@/components/overlays/ProcessOverlay";
import ServiceOverlay from "@/components/overlays/ServiceOverlay";
import TrifectaOverlay from "@/components/overlays/TrifectaOverlay";
import MetricsOverlay from "@/components/overlays/MetricsOverlay";
import CVOverlay from "@/components/overlays/CVOverlay";
import ContactOverlay from "@/components/overlays/ContactOverlay";

// Dynamic import for the 3D scene to enable code splitting
const SceneManager = dynamic(
  () => import("@/components/3d/SceneManager"),
  { ssr: false },
);

export default function CinematicPortfolio() {
  const [loaded, setLoaded] = useState(false);
  useSmoothScroll();

  // Console easter egg
  useEffect(() => {
    const styles = [
      "color:#0A84FF; font-size: 14px; font-weight: bold;",
      "color:#0A84FF",
      "color:#8B5CF6",
      "color:#8B5CF6",
      "color:#00D4AA",
      "color:#00D4AA",
    ];
    console.log(
      `%c████████╗███████╗ ██████╗██╗  ██╗ █████╗ ██╗      █████╗ ███████╗███████╗██╗  ██╗
%c╚══██╔══╝██╔════╝██╔════╝██║  ██║██╔══██╗██║     ██╔══██╗██╔════╝██╔════╝██║  ██║
%c   ██║   █████╗  ██║     ███████║███████║██║     ███████║███████╗█████╗  ███████║
%c   ██║   ██╔══╝  ██║     ██╔══██║██╔══██║██║     ██╔══██║╚════██║██╔══╝  ██╔══██║
%c   ██║   ███████╗╚██████╗██║  ██║██║  ██║███████╗██║  ██║███████║███████╗██║  ██║
%c   ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝

Hey there, fellow developer! 👋
Curious about the code behind this experience?
→ https://github.com/jameelhalaseh/techalaseh-portfolio`,
      ...styles,
    );
  }, []);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {/* Loading screen */}
      {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}

      {/* Scroll container — creates the long scrollable document */}
      <div style={{ height: `${SCROLL_HEIGHT_VH}vh` }}>
        {/* Fixed viewport — canvas + overlays */}
        <div className="fixed inset-0">
          {/* Three.js Canvas */}
          <Canvas
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              alpha: false,
            }}
            dpr={[1, 1.5]}
            camera={{ position: [0, 1.5, 6], fov: 50, near: 0.1, far: 100 }}
            style={{ background: "#06060B" }}
          >
            <SceneManager />
          </Canvas>

          {/* HTML Overlay Layer */}
          <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 10 }}>
            <HeroOverlay />
            <ProjectOverlay />
            <ProcessOverlay />
            <ServiceOverlay />
            <TrifectaOverlay />
            <MetricsOverlay />
            <CVOverlay />
            <ContactOverlay />
          </div>

          {/* UI Layer */}
          <Navbar />
          <SceneIndicator />
        </div>
      </div>
    </>
  );
}
