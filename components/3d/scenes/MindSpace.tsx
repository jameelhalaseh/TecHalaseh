"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgressRef } from "@/hooks/useScrollProgress";
import { isSceneVisible, getSceneProgress } from "@/lib/sceneConfig";
import { PROCESS_STEPS } from "@/lib/constants";

const NODE_COUNT = 60;
const CONNECTION_COUNT = 80;

/**
 * Scene 3: The Mind — abstract neural network void. First-person flythrough.
 * Scroll: 40% → 55%
 */
export default function MindSpace() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useScrollProgressRef();
  const nodesRef = useRef<THREE.InstancedMesh>(null);

  // Generate neural network nodes in a tube along the z-axis
  const nodeData = useMemo(() => {
    const data = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const z = -(i / NODE_COUNT) * 25;
      const angle = (i / NODE_COUNT) * Math.PI * 6 + Math.random() * 0.5;
      const radius = 1.5 + Math.random() * 2.5;
      data.push({
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius + 1.5,
          z,
        ),
        scale: 0.02 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2,
        color: new THREE.Color(
          ["#0A84FF", "#00D4AA", "#8B5CF6", "#FF6B35"][Math.floor(Math.random() * 4)],
        ),
      });
    }
    return data;
  }, []);

  // Process step positions along the z-axis
  const stepPositions = useMemo(() => {
    return PROCESS_STEPS.map((step, i) => {
      const z = -3 - i * 4;
      return {
        ...step,
        position: new THREE.Vector3(0, 1.5, z),
      };
    });
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Connection lines geometry
  const connectionGeom = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < CONNECTION_COUNT; i++) {
      const a = nodeData[Math.floor(Math.random() * NODE_COUNT)];
      const b = nodeData[Math.floor(Math.random() * NODE_COUNT)];
      if (a && b) {
        points.push(a.position.clone(), b.position.clone());
      }
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [nodeData]);

  useFrame((state) => {
    const progress = scrollRef.current;
    if (!groupRef.current) return;

    const visible = isSceneVisible(progress, "mind", 0.03);
    groupRef.current.visible = visible;
    if (!visible || !nodesRef.current) return;

    const time = state.clock.elapsedTime;
    const sceneP = getSceneProgress(progress, "mind");

    // Animate nodes — pulsing and gentle drift
    for (let i = 0; i < NODE_COUNT; i++) {
      const d = nodeData[i];
      const pulse = 0.7 + Math.sin(time * 3 + d.phase) * 0.3;
      dummy.position.copy(d.position);
      dummy.position.x += Math.sin(time * 0.5 + d.phase) * 0.2;
      dummy.position.y += Math.cos(time * 0.3 + d.phase) * 0.15;
      dummy.scale.setScalar(d.scale * pulse);
      dummy.updateMatrix();
      nodesRef.current.setMatrixAt(i, dummy.matrix);
      nodesRef.current.setColorAt(i, d.color);
    }
    nodesRef.current.instanceMatrix.needsUpdate = true;
    if (nodesRef.current.instanceColor) {
      nodesRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Neural network nodes */}
      <instancedMesh ref={nodesRef} args={[undefined, undefined, NODE_COUNT]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshBasicMaterial transparent opacity={0.9} />
      </instancedMesh>

      {/* Connection lines between nodes */}
      <lineSegments geometry={connectionGeom}>
        <lineBasicMaterial
          color="#0A84FF"
          transparent
          opacity={0.08}
        />
      </lineSegments>

      {/* Process step nodes — larger, brighter */}
      {stepPositions.map((step, i) => (
        <group key={step.id} position={step.position.toArray()}>
          {/* Main node sphere */}
          <mesh>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial
              color={["#0A84FF", "#00D4AA", "#8B5CF6", "#FF6B35", "#0A84FF"][i]}
              transparent
              opacity={0.7}
            />
          </mesh>
          {/* Glow ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.006, 8, 32]} />
            <meshBasicMaterial
              color={["#0A84FF", "#00D4AA", "#8B5CF6", "#FF6B35", "#0A84FF"][i]}
              transparent
              opacity={0.4}
            />
          </mesh>
          {/* Sub-nodes for each step */}
          {step.nodes.map((_, j) => {
            const angle = (j / step.nodes.length) * Math.PI * 2;
            return (
              <mesh
                key={j}
                position={[Math.cos(angle) * 0.4, Math.sin(angle) * 0.4, 0]}
              >
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshBasicMaterial
                  color={["#0A84FF", "#00D4AA", "#8B5CF6", "#FF6B35", "#0A84FF"][i]}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            );
          })}
          {/* Point light */}
          <pointLight
            color={["#0A84FF", "#00D4AA", "#8B5CF6", "#FF6B35", "#0A84FF"][i]}
            intensity={0.5}
            distance={4}
          />
        </group>
      ))}

      {/* Data stream particles flowing along Z */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 4 + 1.5,
            -Math.random() * 20,
          ]}
        >
          <boxGeometry args={[0.01, 0.01, 0.15]} />
          <meshBasicMaterial
            color={["#0A84FF", "#00D4AA", "#8B5CF6"][i % 3]}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}
