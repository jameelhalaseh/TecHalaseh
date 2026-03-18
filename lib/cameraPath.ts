import * as THREE from "three";

export interface CameraKeyframe {
  progress: number;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

/**
 * Camera keyframes along the scroll journey.
 * Structured around per-monitor, per-step, and per-service zoom stops.
 */
export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  // ── Scene 1: Greeting (0 → 0.08) ──
  { progress: 0.0, position: [0, 1.5, 6], target: [0, 1, 0], fov: 50 },
  { progress: 0.04, position: [0.3, 1.4, 4.5], target: [0, 1.2, 0], fov: 46 },
  { progress: 0.08, position: [1, 1.3, 3.5], target: [0, 1, 0], fov: 42 },

  // ── Scene 2: Projects (0.08 → 0.28) ── Per-monitor zoom stops
  // Establishing shot — wide view of desk
  { progress: 0.09, position: [2, 2.2, 3.5], target: [0, 0.8, -1], fov: 50 },
  { progress: 0.11, position: [0, 1.8, 2], target: [0, 1.2, -1.5], fov: 45 },

  // Monitor 1 — GAIBE (far left: [-2, 1.4, -1.5])
  { progress: 0.13, position: [-1.2, 1.5, -0.2], target: [-2, 1.4, -1.5], fov: 36 },
  { progress: 0.15, position: [-1.2, 1.5, -0.2], target: [-2, 1.4, -1.5], fov: 36 },

  // Monitor 2 — RM Tools (mid left: [-0.7, 1.4, -2])
  { progress: 0.17, position: [-0.2, 1.5, -0.7], target: [-0.7, 1.4, -2], fov: 36 },
  { progress: 0.19, position: [-0.2, 1.5, -0.7], target: [-0.7, 1.4, -2], fov: 36 },

  // Monitor 3 — RAG Collector (mid right: [0.7, 1.4, -2])
  { progress: 0.21, position: [0.2, 1.5, -0.7], target: [0.7, 1.4, -2], fov: 36 },
  { progress: 0.23, position: [0.2, 1.5, -0.7], target: [0.7, 1.4, -2], fov: 36 },

  // Monitor 4 — AI Pipeline (far right: [2, 1.4, -1.5])
  { progress: 0.25, position: [1.2, 1.5, -0.2], target: [2, 1.4, -1.5], fov: 36 },
  { progress: 0.26, position: [1.2, 1.5, -0.2], target: [2, 1.4, -1.5], fov: 36 },

  // Pull back to full desk
  { progress: 0.28, position: [0, 2.5, 4.5], target: [0, 0.8, -1], fov: 50 },

  // ── Scene 3: Mind (0.28 → 0.44) ── Zoom into head, steps, zoom out
  // Approach avatar head
  { progress: 0.29, position: [0, 1.5, 2.5], target: [0, 1.45, 0], fov: 45 },
  // Into the head — tight zoom
  { progress: 0.30, position: [0, 1.5, 0.5], target: [0, 1.5, -3], fov: 60 },
  // Inside mind — flythrough along Z
  { progress: 0.32, position: [0, 1.5, -2], target: [0, 1.5, -6], fov: 55 },
  { progress: 0.34, position: [-0.5, 1.8, -5], target: [0, 1.5, -9], fov: 55 },
  { progress: 0.36, position: [0.5, 1.3, -8], target: [0, 1.5, -12], fov: 55 },
  { progress: 0.38, position: [-0.3, 1.7, -11], target: [0, 1.5, -15], fov: 55 },
  { progress: 0.40, position: [0.3, 1.4, -14], target: [0, 1.5, -19], fov: 55 },
  // Zoom back out of head
  { progress: 0.42, position: [0, 1.5, -5], target: [0, 1.5, 0], fov: 60 },
  { progress: 0.44, position: [0, 1.5, 2.5], target: [0, 1.45, 0], fov: 45 },

  // ── Scene 4: Showcase (0.44 → 0.66) ── Transition + per-service stops
  // Transition: platform materializes
  { progress: 0.46, position: [0, 2, 5.5], target: [0, 1, 0], fov: 50 },

  // Service 1 — avatar facing panel at angle -0.4*PI (leftmost)
  { progress: 0.48, position: [3.5, 1.8, 2], target: [-2.5, 1.5, -1.5], fov: 42 },
  { progress: 0.50, position: [3.5, 1.8, 2], target: [-2.5, 1.5, -1.5], fov: 42 },

  // Service 2 — AI
  { progress: 0.52, position: [2, 1.8, 3.5], target: [-1, 1.5, -2.5], fov: 42 },
  { progress: 0.53, position: [2, 1.8, 3.5], target: [-1, 1.5, -2.5], fov: 42 },

  // Service 3 — Security (center)
  { progress: 0.55, position: [0, 1.8, 4], target: [0, 1.5, -3], fov: 42 },
  { progress: 0.56, position: [0, 1.8, 4], target: [0, 1.5, -3], fov: 42 },

  // Service 4 — Cloud
  { progress: 0.58, position: [-2, 1.8, 3.5], target: [1, 1.5, -2.5], fov: 42 },
  { progress: 0.59, position: [-2, 1.8, 3.5], target: [1, 1.5, -2.5], fov: 42 },

  // Service 5 — Consulting
  { progress: 0.61, position: [-3.5, 1.8, 2], target: [2.5, 1.5, -1.5], fov: 42 },
  { progress: 0.62, position: [-3.5, 1.8, 2], target: [2.5, 1.5, -1.5], fov: 42 },

  // Credentials + all panels lit, pull back
  { progress: 0.64, position: [0, 2.5, 5], target: [0, 1.5, 0], fov: 48 },
  { progress: 0.66, position: [0, 2, 5], target: [0, 1.2, 0], fov: 48 },

  // ── Scene 5: Trifecta (0.66 → 0.82) ── Dramatic pillar reveals
  // Shield reveal (left)
  { progress: 0.68, position: [2, 1.5, 3.5], target: [-1, 1.2, 0], fov: 44 },
  { progress: 0.70, position: [2, 1.5, 3.5], target: [-1, 1.2, 0], fov: 44 },

  // Laptop reveal (top center)
  { progress: 0.72, position: [-1, 2, 4], target: [0, 1.5, 0], fov: 44 },
  { progress: 0.74, position: [-1, 2, 4], target: [0, 1.5, 0], fov: 44 },

  // Brain reveal (right)
  { progress: 0.75, position: [-2, 1.5, 3.5], target: [1, 1.4, 0], fov: 44 },
  { progress: 0.76, position: [-2, 1.5, 3.5], target: [1, 1.4, 0], fov: 44 },

  // All three + closing statement — centered wide shot
  { progress: 0.78, position: [0, 1.8, 4.5], target: [0, 1.3, 0], fov: 46 },
  { progress: 0.82, position: [0, 1.8, 4.5], target: [0, 1.3, 0], fov: 46 },

  // ── Scene 6: Farewell (0.82 → 1.0) ── Metrics → CV → Contact
  // Clean scene: metrics
  { progress: 0.84, position: [0, 1.5, 4], target: [0, 1.2, 0], fov: 45 },
  { progress: 0.88, position: [0, 1.5, 4], target: [0, 1.2, 0], fov: 45 },

  // CV document centered
  { progress: 0.90, position: [0, 1.5, 3], target: [0, 1.3, 0], fov: 40 },
  { progress: 0.94, position: [0, 1.5, 3], target: [0, 1.3, 0], fov: 40 },

  // Contact
  { progress: 0.96, position: [0.5, 1.4, 3.5], target: [0, 1.2, 0], fov: 42 },
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
