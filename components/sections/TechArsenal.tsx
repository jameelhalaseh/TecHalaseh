"use client";

import { useState, useMemo, useCallback, type MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { TECH_SKILLS } from "@/lib/constants";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type CategoryKey = keyof typeof TECH_SKILLS;

interface PlottedNode {
  id: string;
  name: string;
  level: number;
  category: CategoryKey;
  color: string;
  cx: number;
  cy: number;
  r: number;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const CATEGORIES = Object.keys(TECH_SKILLS) as CategoryKey[];

/** Cluster center positions (percentage of viewBox 0-1000) */
const CLUSTER_CENTERS: Record<CategoryKey, { x: number; y: number }> = {
  frontend: { x: 200, y: 200 },
  backend: { x: 780, y: 200 },
  security: { x: 180, y: 750 },
  aiml: { x: 500, y: 780 },
  devops: { x: 820, y: 720 },
};

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  frontend: "Frontend",
  backend: "Backend",
  security: "Security",
  aiml: "AI / ML",
  devops: "DevOps",
};

/* -------------------------------------------------------------------------- */
/*  Deterministic positioning                                                  */
/* -------------------------------------------------------------------------- */

function buildNodes(): PlottedNode[] {
  const nodes: PlottedNode[] = [];

  for (const cat of CATEGORIES) {
    const { color, items } = TECH_SKILLS[cat];
    const center = CLUSTER_CENTERS[cat];

    items.forEach((item, i) => {
      // Spread items in a circle around the cluster center
      const angle = (Math.PI * 2 * i) / items.length - Math.PI / 2;
      const spread = 60 + items.length * 8;
      const cx = center.x + Math.cos(angle) * spread;
      const cy = center.y + Math.sin(angle) * spread;
      const r = 4 + item.level * 1.4; // radius 5.4 to 11

      nodes.push({
        id: `${cat}-${item.name}`,
        name: item.name,
        level: item.level,
        category: cat,
        color,
        cx: Math.round(cx),
        cy: Math.round(cy),
        r: Math.round(r * 10) / 10,
      });
    });
  }

  return nodes;
}

/** Build intra-category connection lines */
function buildEdges(nodes: PlottedNode[]) {
  const edges: { x1: number; y1: number; x2: number; y2: number; color: string; category: CategoryKey }[] = [];

  for (const cat of CATEGORIES) {
    const catNodes = nodes.filter((n) => n.category === cat);
    for (let i = 0; i < catNodes.length; i++) {
      for (let j = i + 1; j < catNodes.length; j++) {
        edges.push({
          x1: catNodes[i].cx,
          y1: catNodes[i].cy,
          x2: catNodes[j].cx,
          y2: catNodes[j].cy,
          color: catNodes[i].color,
          category: cat,
        });
      }
    }
  }

  return edges;
}

/* -------------------------------------------------------------------------- */
/*  Tooltip                                                                    */
/* -------------------------------------------------------------------------- */

function Tooltip({ node, svgRect }: { node: PlottedNode; svgRect: DOMRect | null }) {
  if (!svgRect) return null;

  // Convert SVG coords to percentage for positioning
  const leftPct = (node.cx / 1000) * 100;
  const topPct = (node.cy / 1000) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full"
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        marginTop: -16,
      }}
    >
      <div className="rounded-xl bg-surface/95 backdrop-blur-xl border border-white/10 px-4 py-3 shadow-2xl min-w-[140px]">
        <p className="text-sm font-semibold text-text-primary mb-2">{node.name}</p>
        {/* Skill bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: node.color }}
              initial={{ width: 0 }}
              animate={{ width: `${(node.level / 5) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <span className="text-[10px] text-text-secondary font-medium tabular-nums">
            {node.level}/5
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Breathing animation keyframes (CSS)                                        */
/* -------------------------------------------------------------------------- */

const breathingCSS = `
@keyframes constellation-breathe {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(1.5px, -1px); }
  66% { transform: translate(-1px, 1.5px); }
}
`;

/* -------------------------------------------------------------------------- */
/*  TechArsenal Section                                                        */
/* -------------------------------------------------------------------------- */

export default function TechArsenal() {
  const t = useTranslations("techArsenal");
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">("all");
  const [hoveredNode, setHoveredNode] = useState<PlottedNode | null>(null);
  const [svgRect, setSvgRect] = useState<DOMRect | null>(null);

  const nodes = useMemo(() => buildNodes(), []);
  const edges = useMemo(() => buildEdges(nodes), [nodes]);

  const handleSvgRef = useCallback((el: SVGSVGElement | null) => {
    if (el) {
      setSvgRect(el.getBoundingClientRect());
    }
  }, []);

  const handleNodeEnter = useCallback(
    (node: PlottedNode, e: MouseEvent<SVGCircleElement>) => {
      const svg = e.currentTarget.closest("svg");
      if (svg) setSvgRect(svg.getBoundingClientRect());
      setHoveredNode(node);
    },
    [],
  );

  const handleNodeLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  const isActive = useCallback(
    (cat: CategoryKey) => activeCategory === "all" || activeCategory === cat,
    [activeCategory],
  );

  return (
    <section id="skills" className="relative px-6 py-32 md:px-12 lg:px-20">
      <style>{breathingCSS}</style>

      <div className="mx-auto max-w-6xl">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-text-primary">
            {t("title")}
          </h2>
          <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple" />
        </motion.div>

        {/* Category filter buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300",
              "border border-white/10",
              activeCategory === "all"
                ? "bg-accent-blue text-white border-accent-blue"
                : "bg-white/5 text-text-secondary hover:text-text-primary hover:border-white/20",
            )}
          >
            {t("all")}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300",
                "border",
                activeCategory === cat
                  ? "text-white"
                  : "bg-white/5 text-text-secondary border-white/10 hover:text-text-primary hover:border-white/20",
              )}
              style={
                activeCategory === cat
                  ? { backgroundColor: TECH_SKILLS[cat].color, borderColor: TECH_SKILLS[cat].color }
                  : undefined
              }
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </motion.div>

        {/* Constellation SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[16/9] min-h-[500px] rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden"
        >
          <svg
            ref={handleSvgRef}
            viewBox="0 0 1000 1000"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Edges / constellation lines */}
            {edges.map((edge, i) => (
              <line
                key={`edge-${i}`}
                x1={edge.x1}
                y1={edge.y1}
                x2={edge.x2}
                y2={edge.y2}
                stroke={edge.color}
                strokeWidth="1"
                strokeOpacity={isActive(edge.category) ? 0.15 : 0.03}
                className="transition-[stroke-opacity] duration-500"
              />
            ))}

            {/* Category labels (faint) */}
            {CATEGORIES.map((cat) => {
              const center = CLUSTER_CENTERS[cat];
              return (
                <text
                  key={`label-${cat}`}
                  x={center.x}
                  y={center.y - 90}
                  textAnchor="middle"
                  fill={TECH_SKILLS[cat].color}
                  fontSize="24"
                  fontWeight="600"
                  opacity={isActive(cat) ? 0.35 : 0.08}
                  className="transition-opacity duration-500 pointer-events-none select-none"
                >
                  {CATEGORY_LABELS[cat]}
                </text>
              );
            })}

            {/* Nodes */}
            {nodes.map((node, i) => {
              const active = isActive(node.category);
              return (
                <motion.circle
                  key={node.id}
                  cx={node.cx}
                  cy={node.cy}
                  r={node.r}
                  fill={node.color}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: active ? 0.85 : 0.15 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.03,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="cursor-pointer transition-opacity duration-500"
                  style={{
                    transformOrigin: `${node.cx}px ${node.cy}px`,
                    animation: `constellation-breathe ${3 + (i % 3)}s ease-in-out infinite`,
                    animationDelay: `${(i * 0.2) % 2}s`,
                    opacity: active ? 0.85 : 0.15,
                  }}
                  onMouseEnter={(e) => handleNodeEnter(node, e)}
                  onMouseLeave={handleNodeLeave}
                  whileHover={{ scale: 1.6 }}
                />
              );
            })}
          </svg>

          {/* Tooltip overlay */}
          {hoveredNode && <Tooltip node={hoveredNode} svgRect={svgRect} />}
        </motion.div>
      </div>
    </section>
  );
}
