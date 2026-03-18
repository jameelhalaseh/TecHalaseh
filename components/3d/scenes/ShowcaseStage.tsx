"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgressRef } from "@/hooks/useScrollProgress";
import { isSceneVisible, getSceneProgress } from "@/lib/sceneConfig";
import { SERVICES, TECH_SKILLS } from "@/lib/constants";

/**
 * Scene 4: The Showcase — circular platform with holographic service cards and skill constellation.
 * Scroll: 55% → 75%
 */
export default function ShowcaseStage() {
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useScrollProgressRef();
  const cardsGroupRef = useRef<THREE.Group>(null);

  // Service card positions in a semicircle around avatar
  const cardPositions = useMemo(() => {
    return SERVICES.map((service, i) => {
      const angle = -Math.PI * 0.4 + (i / (SERVICES.length - 1)) * Math.PI * 0.8;
      return {
        ...service,
        x: Math.sin(angle) * 3,
        y: 1.5 + (i % 2) * 0.3,
        z: -Math.cos(angle) * 3,
        rotY: -angle,
      };
    });
  }, []);

  // Skill constellation data
  const skillStars = useMemo(() => {
    const stars: Array<{
      name: string;
      position: THREE.Vector3;
      color: string;
      level: number;
    }> = [];
    const categories = Object.values(TECH_SKILLS);
    categories.forEach((cat, catIdx) => {
      const catAngle = (catIdx / categories.length) * Math.PI * 2;
      const catRadius = 2.5;
      const cx = Math.cos(catAngle) * catRadius;
      const cz = Math.sin(catAngle) * catRadius;

      cat.items.forEach((item, itemIdx) => {
        const itemAngle =
          catAngle + ((itemIdx - cat.items.length / 2) / cat.items.length) * 0.8;
        const r = catRadius + 0.5 + itemIdx * 0.3;
        stars.push({
          name: item.name,
          position: new THREE.Vector3(
            Math.cos(itemAngle) * r,
            3.5 + (itemIdx % 3) * 0.4,
            Math.sin(itemAngle) * r,
          ),
          color: cat.color,
          level: item.level,
        });
      });
    });
    return stars;
  }, []);

  useFrame((state) => {
    const progress = scrollRef.current;
    if (!groupRef.current) return;

    const visible = isSceneVisible(progress, "showcase", 0.03);
    groupRef.current.visible = visible;
    if (!visible) return;

    const time = state.clock.elapsedTime;
    const sceneP = getSceneProgress(progress, "showcase");

    // Animate cards — gentle float
    if (cardsGroupRef.current) {
      cardsGroupRef.current.children.forEach((card, i) => {
        card.position.y =
          cardPositions[i].y + Math.sin(time * 0.6 + i * 1.2) * 0.08;
        card.rotation.y =
          cardPositions[i].rotY + Math.sin(time * 0.3 + i) * 0.03;
      });
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Circular platform */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4, 64]} />
        <meshStandardMaterial
          color="#0A0A12"
          metalness={0.6}
          roughness={0.3}
          emissive="#0A84FF"
          emissiveIntensity={0.02}
        />
      </mesh>

      {/* Platform edge ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.9, 4.0, 64]} />
        <meshBasicMaterial color="#0A84FF" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.0, 3.02, 64]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.15} />
      </mesh>

      {/* Service hologram cards */}
      <group ref={cardsGroupRef}>
        {cardPositions.map((card, i) => (
          <group
            key={card.id}
            position={[card.x, card.y, card.z]}
            rotation={[0, card.rotY, 0]}
          >
            {/* Card body */}
            <mesh>
              <boxGeometry args={[0.9, 0.6, 0.02]} />
              <meshStandardMaterial
                color="#111119"
                metalness={0.5}
                roughness={0.3}
                emissive={card.accent}
                emissiveIntensity={0.1}
                transparent
                opacity={0.85}
              />
            </mesh>
            {/* Card border glow */}
            <mesh position={[0, 0, 0.011]}>
              <planeGeometry args={[0.92, 0.62]} />
              <meshBasicMaterial
                color={card.accent}
                transparent
                opacity={0.05}
              />
            </mesh>
            {/* Icon area */}
            <mesh position={[0, 0.12, 0.015]}>
              <circleGeometry args={[0.08, 16]} />
              <meshBasicMaterial
                color={card.accent}
                transparent
                opacity={0.6}
              />
            </mesh>
            {/* Card glow */}
            <pointLight
              position={[0, 0, 0.5]}
              color={card.accent}
              intensity={0.15}
              distance={2}
            />
          </group>
        ))}
      </group>

      {/* Skill constellation (above avatar) */}
      {skillStars.map((star, i) => (
        <mesh key={i} position={star.position.toArray()}>
          <sphereGeometry args={[0.03 + star.level * 0.008, 8, 8]} />
          <meshBasicMaterial
            color={star.color}
            transparent
            opacity={0.6 + star.level * 0.08}
          />
        </mesh>
      ))}

      {/* Connecting lines within skill categories */}
      <SkillLines skillStars={skillStars} />

      {/* Platform accent lines radiating outward */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 2,
              0.01,
              Math.sin(angle) * 2,
            ]}
            rotation={[-Math.PI / 2, 0, angle]}
          >
            <planeGeometry args={[0.003, 2]} />
            <meshBasicMaterial color="#0A84FF" transparent opacity={0.1} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Separate component to render skill constellation connecting lines */
function SkillLines({
  skillStars,
}: {
  skillStars: Array<{ name: string; position: THREE.Vector3; color: string; level: number }>;
}) {
  const lines = useMemo(() => {
    const result: THREE.Line[] = [];
    const categories = Object.values(TECH_SKILLS);
    categories.forEach((cat) => {
      const catStars = skillStars.filter((s) => s.color === cat.color);
      if (catStars.length < 2) return;
      const points = catStars.map((s) => s.position);
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: cat.color,
        transparent: true,
        opacity: 0.15,
      });
      result.push(new THREE.Line(geom, mat));
    });
    return result;
  }, [skillStars]);

  return (
    <>
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </>
  );
}
