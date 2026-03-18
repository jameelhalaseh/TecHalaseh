"use client";

import { Suspense } from "react";
import CameraRig from "./CameraRig";
import Avatar from "./Avatar";
import Lighting from "./effects/Lighting";
import GreetingScene from "./scenes/GreetingScene";
import CommandCenter from "./scenes/CommandCenter";
import MindSpace from "./scenes/MindSpace";
import ShowcaseStage from "./scenes/ShowcaseStage";
import TrifectaScene from "./scenes/TrifectaScene";
import FarewellScene from "./scenes/FarewellScene";

/**
 * Orchestrates the entire 3D world.
 * All scenes are always mounted (for smooth transitions) but manage their own visibility.
 */
export default function SceneManager() {
  return (
    <>
      <CameraRig />
      <Lighting />

      {/* Global fog */}
      <fog attach="fog" args={["#06060B", 8, 30]} />

      <Suspense fallback={null}>
        <Avatar />
        <GreetingScene />
        <CommandCenter />
        <MindSpace />
        <ShowcaseStage />
        <TrifectaScene />
        <FarewellScene />
      </Suspense>
    </>
  );
}
