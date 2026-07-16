"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type Simulation,
  type SimulationNodeDatum,
} from "d3-force";
import { useChartTheme } from "@/hooks/use-chart-theme";
import { DECISION_CHART_COLORS } from "@/lib/chart-colors";
import { DECISION_LABELS } from "@/lib/labels";
import type { DecisionLevel } from "@/types/evaluation";
import type { EvaluationGraphData, EvaluationGraphNode } from "@/lib/queries/evaluation-graph";

const DECISION_ORDER: DecisionLevel[] = ["hell_yes", "qualified_yes", "yellow_flag", "soft_no", "hard_no"];

interface SimNode extends SimulationNodeDatum, EvaluationGraphNode {
  degree: number;
}

interface Transform {
  x: number;
  y: number;
  k: number;
}

interface Emphasis {
  connectedNodeIds: Set<string>;
  connectedLinkKeys: Set<number>;
}

// Virtual simulation space — larger than the visible viewBox so nodes have
// room to spread out; the computed fit-transform below scales/centers the
// resulting layout to whatever the visible viewBox actually is.
const SIM_WIDTH = 1400;
const SIM_HEIGHT = 900;
const VIEW_WIDTH = 900;
const VIEW_HEIGHT = 560;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 4;
const DRAG_THRESHOLD_PX = 4;
const DRAG_ALPHA_TARGET = 0.3;
const DOUBLE_CLICK_MS = 300;
const HUB_COLOR = "var(--muted-foreground)";

function nodeColor(node: SimNode, theme: "light" | "dark"): string {
  if (node.kind === "evaluation") {
    return node.decision ? DECISION_CHART_COLORS[node.decision][theme] : HUB_COLOR;
  }
  return HUB_COLOR;
}

function nodeRadius(degree: number): number {
  return Math.min(20, 4 + Math.sqrt(degree) * 2.2);
}

function clampZoom(k: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, k));
}

/** Computes the transform that centers and scales a simulation's node
 * bounding box to fit inside the visible viewBox, with padding. */
function fitTransform(simNodes: SimNode[]): Transform {
  const xs = simNodes.map((n) => n.x ?? 0);
  const ys = simNodes.map((n) => n.y ?? 0);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const graphWidth = Math.max(1, maxX - minX);
  const graphHeight = Math.max(1, maxY - minY);
  const padding = 50;

  const k = Math.min(
    (VIEW_WIDTH - padding * 2) / graphWidth,
    (VIEW_HEIGHT - padding * 2) / graphHeight,
    1.4
  );
  const x = VIEW_WIDTH / 2 - k * ((minX + maxX) / 2);
  const y = VIEW_HEIGHT / 2 - k * ((minY + maxY) / 2);
  return { x, y, k };
}

/** A stable, centered guess transform for the nominal simulation canvas,
 * shown while the simulation is still animating into its settled layout. */
function guessTransform(): Transform {
  const k = Math.min(VIEW_WIDTH / SIM_WIDTH, VIEW_HEIGHT / SIM_HEIGHT);
  return {
    k,
    x: VIEW_WIDTH / 2 - k * (SIM_WIDTH / 2),
    y: VIEW_HEIGHT / 2 - k * (SIM_HEIGHT / 2),
  };
}

/** Converts a pointer event's screen coordinates into simulation space,
 * accounting for the SVG's rendered size (vs. its viewBox) and the current
 * pan/zoom transform. */
function screenToSimCoords(
  clientX: number,
  clientY: number,
  svg: SVGSVGElement,
  transform: Transform
): { x: number; y: number } {
  const rect = svg.getBoundingClientRect();
  const viewX = ((clientX - rect.left) / rect.width) * VIEW_WIDTH;
  const viewY = ((clientY - rect.top) / rect.height) * VIEW_HEIGHT;
  return { x: (viewX - transform.x) / transform.k, y: (viewY - transform.y) / transform.k };
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-7 w-7 items-center justify-center rounded border border-border bg-card text-sm text-muted-foreground hover:border-primary hover:text-primary"
    >
      {children}
    </button>
  );
}

export function EvaluationGraphView({ nodes, links }: EvaluationGraphData) {
  const router = useRouter();
  const theme = useChartTheme();
  const [positions, setPositions] = useState<SimNode[] | null>(null);
  const [initialTransform, setInitialTransform] = useState<Transform>(guessTransform());
  const [transform, setTransform] = useState<Transform>(guessTransform());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const panOrigin = useRef<{ x: number; y: number } | null>(null);
  const draggingNodeId = useRef<string | null>(null);
  const pointerDownAt = useRef<{ x: number; y: number } | null>(null);
  const didDrag = useRef(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastClickNodeId = useRef<string | null>(null);
  const hasFitRef = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<Simulation<SimNode, undefined> | null>(null);
  const transformRef = useRef(transform);

  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setTransform((t) => ({ ...t, k: clampZoom(t.k - e.deltaY * 0.001) }));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const degree = new Map<string, number>();
    for (const l of links) {
      degree.set(l.source, (degree.get(l.source) ?? 0) + 1);
      degree.set(l.target, (degree.get(l.target) ?? 0) + 1);
    }
    const simNodes: SimNode[] = nodes.map((n) => ({ ...n, degree: degree.get(n.id) ?? 0 }));
    const simLinks = links.map((l) => ({ ...l }));

    hasFitRef.current = false;
    // Rebuilding the d3-force simulation for new nodes/links requires
    // resetting layout state (positions, transform) synchronously so the
    // simulation and the rendered graph start from the same frame.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPositions(simNodes);
    setInitialTransform(guessTransform());
    setTransform(guessTransform());

    const simulation = forceSimulation(simNodes)
      .force("charge", forceManyBody().strength(-260))
      .force(
        "link",
        forceLink(simLinks)
          .id((d) => (d as SimNode).id)
          .distance(60)
      )
      .force("center", forceCenter(SIM_WIDTH / 2, SIM_HEIGHT / 2))
      .force(
        "collide",
        forceCollide((d) => nodeRadius((d as SimNode).degree) + 6)
      );

    simulationRef.current = simulation;

    simulation.on("tick", () => {
      setPositions([...simNodes]);
    });

    simulation.on("end", () => {
      if (hasFitRef.current) return;
      hasFitRef.current = true;
      const fit = fitTransform(simNodes);
      setInitialTransform(fit);
      setTransform(fit);
    });

    return () => {
      simulation.stop();
      simulationRef.current = null;
    };
  }, [nodes, links]);

  function handleBackgroundPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    pointerDownAt.current = { x: e.clientX, y: e.clientY };
    didDrag.current = false;
    panOrigin.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  }

  function handleNodePointerDown(e: React.PointerEvent<SVGGElement>, id: string) {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    pointerDownAt.current = { x: e.clientX, y: e.clientY };
    didDrag.current = false;
    draggingNodeId.current = id;
    simulationRef.current?.alphaTarget(DRAG_ALPHA_TARGET).restart();
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const start = pointerDownAt.current;
    if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > DRAG_THRESHOLD_PX) {
      didDrag.current = true;
    }

    if (draggingNodeId.current) {
      const svg = svgRef.current;
      if (!svg) return;
      const { x, y } = screenToSimCoords(e.clientX, e.clientY, svg, transformRef.current);
      const node = simulationRef.current?.nodes().find((n) => n.id === draggingNodeId.current);
      if (node) {
        node.fx = x;
        node.fy = y;
      }
      return;
    }

    const origin = panOrigin.current;
    if (!origin) return;
    const x = e.clientX - origin.x;
    const y = e.clientY - origin.y;
    setTransform((t) => ({ ...t, x, y }));
  }

  function handlePointerUp() {
    if (draggingNodeId.current) {
      // Leave fx/fy set to the drop position — the node stays pinned where
      // it was released instead of drifting back under the link/charge forces.
      draggingNodeId.current = null;
      simulationRef.current?.alphaTarget(0);
    } else if (!didDrag.current && pinnedId) {
      // A plain click on empty background clears an isolated (pinned) node.
      setPinnedId(null);
    }
    panOrigin.current = null;
  }

  // A plain click on an evaluation node opens its detail page; a second
  // click on the same node within the double-click window instead toggles
  // it as "isolated" (pinned highlight). Hub nodes (industry/lead
  // source/risk) have no detail page, so they only ever pin/unpin.
  function handleNodeClick(node: SimNode) {
    if (didDrag.current) return;

    if (clickTimer.current && lastClickNodeId.current === node.id) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      lastClickNodeId.current = null;
      setPinnedId((p) => (p === node.id ? null : node.id));
      return;
    }

    lastClickNodeId.current = node.id;
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null;
      lastClickNodeId.current = null;
      if (node.kind === "evaluation") router.push(`/evaluations/${node.id}`);
      else setPinnedId((p) => (p === node.id ? null : node.id));
    }, DOUBLE_CLICK_MS);
  }

  useEffect(() => {
    return () => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
    };
  }, []);

  function zoomBy(factor: number) {
    setTransform((t) => ({ ...t, k: clampZoom(t.k * factor) }));
  }

  function resetView() {
    const simulation = simulationRef.current;
    if (simulation) {
      for (const node of simulation.nodes()) {
        node.fx = null;
        node.fy = null;
      }
      simulation.alpha(0.6).alphaTarget(0).restart();
    }
    setTransform(initialTransform);
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await containerRef.current?.requestFullscreen();
    }
  }

  const emphasis: Emphasis | null = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("tr");
    if (query) {
      const matchedIds = new Set<string>();
      for (const n of nodes) {
        if (n.title.toLocaleLowerCase("tr").includes(query)) matchedIds.add(n.id);
      }
      const connectedNodeIds = new Set<string>(matchedIds);
      const connectedLinkKeys = new Set<number>();
      links.forEach((l, i) => {
        if (matchedIds.has(l.source) || matchedIds.has(l.target)) {
          connectedLinkKeys.add(i);
          connectedNodeIds.add(l.source);
          connectedNodeIds.add(l.target);
        }
      });
      return { connectedNodeIds, connectedLinkKeys };
    }

    const focusId = pinnedId ?? hoveredId;
    if (!focusId) return null;
    const connectedNodeIds = new Set<string>([focusId]);
    const connectedLinkKeys = new Set<number>();
    links.forEach((l, i) => {
      if (l.source === focusId || l.target === focusId) {
        connectedLinkKeys.add(i);
        connectedNodeIds.add(l.source);
        connectedNodeIds.add(l.target);
      }
    });
    return { connectedNodeIds, connectedLinkKeys };
  }, [searchQuery, nodes, pinnedId, hoveredId, links]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg border border-border bg-card ${
        isFullscreen ? "h-screen" : ""
      }`}
    >
      <div className="absolute left-1/2 top-3 z-10 -translate-x-1/2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Müşteri, sektör, kaynak ara…"
          className="w-56 rounded border border-border bg-card/90 px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground backdrop-blur focus:border-primary focus:outline-none"
        />
      </div>

      <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
        <ControlButton label="Yakınlaştır" onClick={() => zoomBy(1.3)}>
          +
        </ControlButton>
        <ControlButton label="Uzaklaştır" onClick={() => zoomBy(1 / 1.3)}>
          −
        </ControlButton>
        <ControlButton label="Görünümü sıfırla" onClick={resetView}>
          ⟳
        </ControlButton>
        <ControlButton label={isFullscreen ? "Tam ekrandan çık" : "Tam ekran"} onClick={toggleFullscreen}>
          {isFullscreen ? "⤡" : "⛶"}
        </ControlButton>
      </div>

      {!positions ? (
        <div className="flex h-[560px] items-center justify-center text-sm text-muted-foreground">
          Bağlantı haritası hesaplanıyor…
        </div>
      ) : (
        <GraphCanvas
          svgRef={svgRef}
          positions={positions}
          links={links}
          transform={transform}
          isFullscreen={isFullscreen}
          emphasis={emphasis}
          theme={theme}
          onBackgroundPointerDown={handleBackgroundPointerDown}
          onNodePointerDown={handleNodePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onNodeClick={handleNodeClick}
          onNodeHover={setHoveredId}
        />
      )}

      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-x-3 gap-y-1 rounded border border-border bg-card/90 px-2.5 py-1.5 text-[11px] text-muted-foreground backdrop-blur">
        {DECISION_ORDER.map((decision) => (
          <span key={decision} className="flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: DECISION_CHART_COLORS[decision][theme] }}
              aria-hidden
            />
            {DECISION_LABELS[decision]}
          </span>
        ))}
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full border border-border" style={{ backgroundColor: HUB_COLOR }} aria-hidden />
          Sektör / Kaynak / Risk kümesi
        </span>
      </div>
    </div>
  );
}

function GraphCanvas({
  svgRef,
  positions,
  links,
  transform,
  isFullscreen,
  emphasis,
  theme,
  onBackgroundPointerDown,
  onNodePointerDown,
  onPointerMove,
  onPointerUp,
  onNodeClick,
  onNodeHover,
}: {
  svgRef: React.RefObject<SVGSVGElement | null>;
  positions: SimNode[];
  links: EvaluationGraphData["links"];
  transform: Transform;
  isFullscreen: boolean;
  emphasis: Emphasis | null;
  theme: "light" | "dark";
  onBackgroundPointerDown: (e: React.PointerEvent<SVGSVGElement>) => void;
  onNodePointerDown: (e: React.PointerEvent<SVGGElement>, id: string) => void;
  onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPointerUp: () => void;
  onNodeClick: (node: SimNode) => void;
  onNodeHover: (id: string | null) => void;
}) {
  const byId = new Map(positions.map((n) => [n.id, n]));

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className={`w-full cursor-grab touch-none select-none active:cursor-grabbing ${
        isFullscreen ? "h-screen" : "h-[560px]"
      }`}
      onPointerDown={onBackgroundPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
        {links.map((l, i) => {
          const s = byId.get(l.source);
          const t = byId.get(l.target);
          if (!s || !t) return null;
          const highlighted = emphasis?.connectedLinkKeys.has(i) ?? false;
          const dimmed = emphasis ? !highlighted : false;
          return (
            <line
              key={i}
              x1={s.x}
              y1={s.y}
              x2={t.x}
              y2={t.y}
              stroke={highlighted ? "var(--primary)" : "var(--muted-foreground)"}
              strokeOpacity={highlighted ? 0.9 : dimmed ? 0.03 : 0.35}
              strokeWidth={highlighted ? 1.5 : 1}
            />
          );
        })}
        {positions.map((n) => {
          const r = nodeRadius(n.degree);
          const connected = emphasis?.connectedNodeIds.has(n.id) ?? false;
          const dimmed = emphasis ? !connected : false;
          const showLabel = emphasis ? connected : r > 7;
          return (
            <g
              key={n.id}
              transform={`translate(${n.x} ${n.y})`}
              className="cursor-pointer"
              onPointerDown={(e) => onNodePointerDown(e, n.id)}
              onPointerEnter={() => onNodeHover(n.id)}
              onPointerLeave={() => onNodeHover(null)}
              onClick={() => onNodeClick(n)}
            >
              <circle
                r={r}
                fill={nodeColor(n, theme)}
                fillOpacity={dimmed ? 0.08 : 0.85}
                stroke={n.kind !== "evaluation" ? "var(--border)" : "none"}
                strokeWidth={n.kind !== "evaluation" ? 1 : 0}
              />
              {showLabel && (
                <text
                  x={r + 4}
                  y={4}
                  fontSize={10}
                  fontWeight={connected && emphasis ? 600 : 400}
                  fill={connected && emphasis ? "var(--primary)" : "var(--foreground)"}
                  fillOpacity={1}
                >
                  {n.title}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
