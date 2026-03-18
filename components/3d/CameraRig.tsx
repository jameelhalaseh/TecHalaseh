"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScrollProgressRef } from "@/hooks/useScrollProgress";
import { interpolateCamera } from "@/lib/cameraPath";
import * as THREE from "three";

/**
 * Scroll-driven camera that follows keyframed positions along the scroll journey.
 * Uses smooth lerping for cinematic movement.
 */
export default function CameraRig() {
  const scrollRef = useScrollProgressRef();
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 1.5, 6));
  const targetLookAt = useRef(new THREE.Vector3(0, 1, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 1, 0));

  useFrame((_, delta) => {
    const progress = scrollRef.current;
    const keyframe = interpolateCamera(progress);

    // Smooth lerp toward target — gives cinematic lag
    const lerpFactor = 1 - Math.pow(0.001, delta);

    targetPos.current.copy(keyframe.position);
    targetLookAt.current.copy(keyframe.target);

    camera.position.lerp(targetPos.current, lerpFactor);
    currentLookAt.current.lerp(targetLookAt.current, lerpFactor);
    camera.lookAt(currentLookAt.current);

    // Smoothly adjust FOV
    if ("fov" in camera && camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, keyframe.fov, lerpFactor);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
