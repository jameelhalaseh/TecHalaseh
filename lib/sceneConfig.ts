/* Scene scroll ranges — each scene occupies a portion of the 0→1 scroll progress */

export interface SceneRange {
  id: string;
  start: number;
  end: number;
}

export const SCENE_RANGES: SceneRange[] = [
  { id: "greeting", start: 0, end: 0.08 },
  { id: "projects", start: 0.08, end: 0.28 },
  { id: "mind", start: 0.28, end: 0.44 },
  { id: "showcase", start: 0.44, end: 0.66 },
  { id: "trifecta", start: 0.66, end: 0.82 },
  { id: "farewell", start: 0.82, end: 1.0 },
];

/** Total scroll height in viewport units */
export const SCROLL_HEIGHT_VH = 5500;

/** Get which scene is active at a given scroll progress */
export function getActiveScene(progress: number): string {
  for (const scene of SCENE_RANGES) {
    if (progress >= scene.start && progress <= scene.end) {
      return scene.id;
    }
  }
  return "farewell";
}

/** Get normalized progress within a scene (0→1) */
export function getSceneProgress(progress: number, sceneId: string): number {
  const scene = SCENE_RANGES.find((s) => s.id === sceneId);
  if (!scene) return 0;
  const raw = (progress - scene.start) / (scene.end - scene.start);
  return Math.max(0, Math.min(1, raw));
}

/** Check if a scene is visible (with fade margins) */
export function isSceneVisible(progress: number, sceneId: string, margin = 0.02): boolean {
  const scene = SCENE_RANGES.find((s) => s.id === sceneId);
  if (!scene) return false;
  return progress >= scene.start - margin && progress <= scene.end + margin;
}
