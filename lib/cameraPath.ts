import * as THREE from "three";

export interface CameraKeyframe {
  progress: number;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

/**
 * Camera keyframes along the scroll journey.
 * Positions define where the camera is, targets define where it looks.
 */
export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  // Scene 1: Greeting — wide shot pulling in
  { progress: 0.0, position: [0, 1.5, 6], target: [0, 1, 0], fov: 50 },
  { progress: 0.08, position: [0.5, 1.4, 4], target: [0, 1.2, 0], fov: 45 },
  { progress: 0.15, position: [1.5, 1.3, 3.5], target: [0, 1, 0], fov: 42 },

  // Scene 2: Command Center — orbit around desk
  { progress: 0.18, position: [3, 2, 4], target: [0, 0.8, 0], fov: 50 },
  { progress: 0.22, position: [2.5, 1.5, 2.5], target: [-1, 1.2, -1], fov: 40 },
  { progress: 0.27, position: [0, 1.5, 2.5], target: [1, 1.2, -1], fov: 40 },
  { progress: 0.32, position: [-2, 1.5, 2.5], target: [-1, 1.2, -2], fov: 40 },
  { progress: 0.37, position: [-2.5, 1.5, 3], target: [0.5, 1.2, -1], fov: 40 },
  { progress: 0.40, position: [0, 2.5, 5], target: [0, 0.8, 0], fov: 50 },

  // Scene 3: Mind Space — first-person flythrough
  { progress: 0.42, position: [0, 1.5, 0], target: [0, 1.5, -5], fov: 60 },
  { progress: 0.45, position: [0, 1.5, -4], target: [-2, 2, -8], fov: 55 },
  { progress: 0.48, position: [-2, 2, -8], target: [2, 1, -12], fov: 55 },
  { progress: 0.51, position: [2, 1, -12], target: [0, 2, -16], fov: 55 },
  { progress: 0.54, position: [0, 2, -16], target: [0, 1.5, -20], fov: 55 },
  { progress: 0.55, position: [0, 1.5, -8], target: [0, 1.5, 0], fov: 60 },

  // Scene 4: Showcase — circle around platform
  { progress: 0.57, position: [0, 2, 6], target: [0, 1, 0], fov: 50 },
  { progress: 0.62, position: [4, 1.8, 3], target: [0, 1.2, 0], fov: 45 },
  { progress: 0.67, position: [3, 2.5, -2], target: [0, 1.5, 0], fov: 45 },
  { progress: 0.72, position: [0, 3, -3], target: [0, 1, 0], fov: 50 },
  { progress: 0.75, position: [0, 2, 5], target: [0, 1, 0], fov: 48 },

  // Scene 5: Trifecta — centered dramatic shots
  { progress: 0.77, position: [2, 1.5, 4], target: [0, 1.2, 0], fov: 45 },
  { progress: 0.81, position: [-2, 1.5, 4], target: [0, 1.2, 0], fov: 45 },
  { progress: 0.85, position: [0, 1.8, 3.5], target: [0, 1.5, 0], fov: 42 },
  { progress: 0.88, position: [0, 1.5, 5], target: [0, 1.3, 0], fov: 48 },

  // Scene 6: Farewell — close up then pull back
  { progress: 0.90, position: [0, 1.5, 3], target: [0, 1.2, 0], fov: 40 },
  { progress: 0.95, position: [0.5, 1.4, 2.5], target: [0, 1.3, 0], fov: 38 },
  { progress: 1.0, position: [0, 1.5, 4], target: [0, 1.2, 0], fov: 45 },
];

/** Interpolate camera state at a given scroll progress */
export function interpolateCamera(progress: number): {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
} {
  const keyframes = CAMERA_KEYFRAMES;
  const p = Math.max(0, Math.min(1, progress));

  // Find surrounding keyframes
  let startIdx = 0;
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (p >= keyframes[i].progress && p <= keyframes[i + 1].progress) {
      startIdx = i;
      break;
    }
    if (i === keyframes.length - 2) {
      startIdx = keyframes.length - 2;
    }
  }

  const kf0 = keyframes[startIdx];
  const kf1 = keyframes[startIdx + 1];

  const range = kf1.progress - kf0.progress;
  const t = range > 0 ? (p - kf0.progress) / range : 0;

  // Smooth step for cinematic feel
  const smooth = t * t * (3 - 2 * t);

  const position = new THREE.Vector3(
    THREE.MathUtils.lerp(kf0.position[0], kf1.position[0], smooth),
    THREE.MathUtils.lerp(kf0.position[1], kf1.position[1], smooth),
    THREE.MathUtils.lerp(kf0.position[2], kf1.position[2], smooth),
  );

  const target = new THREE.Vector3(
    THREE.MathUtils.lerp(kf0.target[0], kf1.target[0], smooth),
    THREE.MathUtils.lerp(kf0.target[1], kf1.target[1], smooth),
    THREE.MathUtils.lerp(kf0.target[2], kf1.target[2], smooth),
  );

  const fov = THREE.MathUtils.lerp(kf0.fov, kf1.fov, smooth);

  return { position, target, fov };
}
