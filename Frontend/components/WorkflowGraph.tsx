import React, { useEffect, useRef, useState, useCallback } from "react";
import { AgentNode, LogEntry } from "../types";
import ScrollingText from "./ScrollingText";
import { Bot, Maximize2 } from "lucide-react";
import { Icon } from "@iconify/react";

interface WorkflowGraphProps {
  nodes: AgentNode[];
  onNodeMove: (id: string, pos: { x: number; y: number }) => void;
  selectedNodeId: string | null;
  onNodeSelect: (id: string | null) => void;
  onNodeExpand: (id: string) => void;
}

// Physics types
type PhysicsNode = AgentNode & {
  vx: number;
  vy: number;
  fx: number;
  fy: number;
  isDragging: boolean;
  mass: number;
  width: number;
  height: number;
  parentId?: string;
};

const WorkflowGraph: React.FC<WorkflowGraphProps> = ({
  nodes: initialNodes,
  selectedNodeId,
  onNodeSelect,
  onNodeExpand,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const isSimulating = useRef(false);

  const [, forceUpdate] = useState({});

  // Physics State
  const physicsNodes = useRef<PhysicsNode[]>([]);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const lineRefs = useRef<Map<string, SVGLineElement>>(new Map());
  const interactionLineRef = useRef<SVGPathElement>(null);
  const initialized = useRef(false);

  // Canvas State
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Refs for physics loop access
  const panRef = useRef(pan);
  const scaleRef = useRef(scale);
  const selectedNodeIdRef = useRef(selectedNodeId);
  const windowSizeRef = useRef({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    panRef.current = pan;
    scaleRef.current = scale;
  }, [pan, scale]);

  useEffect(() => {
    selectedNodeIdRef.current = selectedNodeId;
    // Always start simulation on selection change to ensure lines are updated/removed immediately
    startSimulation();
  }, [selectedNodeId]);

  // Define dimensions for collision/edge calculations
  const getDims = (type: string) => {
    switch (type) {
      case "orchestrator":
        return { w: 100, h: 100, mass: 500 };
      case "sub-agent":
        return { w: 280, h: 60, mass: 20 }; // Pill shape dimensions (updated height)
      case "context":
        return { w: 320, h: 140, mass: 2 }; // Query component dimensions
      default:
        return { w: 100, h: 100, mass: 1 };
    }
  };

  // Auto-fit to viewport on mount/resize
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      windowSizeRef.current = { w, h };

      const contentW = 1300;
      const contentH = 900;

      const s = Math.min(w / contentW, h / contentH, 1) * 0.95;
      setScale(s);

      setPan({
        x: w / 2 - 500 * s,
        y: h / 2 - 500 * s,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!initialized.current && initialNodes.length > 0) {
      // Initial Setup
      physicsNodes.current = initialNodes.map((node) => {
        const dims = getDims(node.type);
        const pos =
          node.type === "orchestrator"
            ? { x: 50, y: 50 }
            : { ...node.position };
        return {
          ...node,
          position: pos,
          vx: 0,
          vy: 0,
          fx: 0,
          fy: 0,
          isDragging: false,
          mass: dims.mass,
          width: dims.w,
          height: dims.h,
        };
      });
      initialized.current = true;
      forceUpdate({}); // Trigger re-render so lines can be drawn
      startSimulation();
    } else {
      // Safe Update: Update props and add new nodes
      let needsSim = false;
      let nodesAdded = false;

      // Update existing
      physicsNodes.current.forEach((pNode) => {
        const freshNode = initialNodes.find((n) => n.id === pNode.id);
        if (freshNode) {
          // Update visual props
          if (
            pNode.status !== freshNode.status ||
            pNode.title !== freshNode.title ||
            pNode.subtitle !== freshNode.subtitle ||
            pNode.logs !== freshNode.logs
          ) {
            pNode.status = freshNode.status;
            pNode.title = freshNode.title;
            pNode.subtitle = freshNode.subtitle;
            pNode.logs = freshNode.logs;
            needsSim = true;
          }
        }
      });

      // Add new nodes
      initialNodes.forEach((node) => {
        if (!physicsNodes.current.some((p) => p.id === node.id)) {
          const dims = getDims(node.type);
          const pos =
            node.type === "orchestrator"
              ? { x: 50, y: 50 }
              : { ...node.position };
          physicsNodes.current.push({
            ...node,
            position: pos,
            vx: 0,
            vy: 0,
            fx: 0,
            fy: 0,
            isDragging: false,
            mass: dims.mass,
            width: dims.w,
            height: dims.h,
          });
          nodesAdded = true;
          needsSim = true;
        }
      });

      if (nodesAdded) forceUpdate({});
      if (needsSim) startSimulation();
    }
  }, [initialNodes]);

  const startSimulation = () => {
    if (!isSimulating.current) {
      isSimulating.current = true;
      requestRef.current = requestAnimationFrame(updatePhysics);
    }
  };

  const updatePhysics = useCallback(() => {
    const nodes = physicsNodes.current;
    const centerNode = nodes.find((n) => n.type === "orchestrator");

    // Tuning for STABILITY (No Jitter)
    const DAMPING = 0.85;
    const MAX_SPEED = 0.5;
    const MIN_ENERGY = 0.001;

    let totalEnergy = 0;

    // 1. Accumulate Forces
    nodes.forEach((node, i) => {
      if (node.isDragging || node.type === "orchestrator") return;

      let fx = 0;
      let fy = 0;

      // Interaction between nodes
      nodes.forEach((other, j) => {
        if (i === j) return;
        const dx = node.position.x - other.position.x;
        const dy = node.position.y - other.position.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq) || 0.01;

        const r1 = node.width / 20;
        const r2 = other.width / 20;

        // Min Separation
        const minSep = (r1 + r2) * 0.9;

        // 1a. Hard Collision
        if (dist < minSep) {
          const overlap = minSep - dist;
          const push = overlap * 2.0;
          fx += (dx / dist) * push;
          fy += (dy / dist) * push;
        }

        // 1b. Attraction/Repulsion Logic
        if (node.type === "context" && other.type === "context") {
          if (dist >= minSep) {
            const attractStrength = 0.03;
            fx -= (dx / dist) * attractStrength;
            fy -= (dy / dist) * attractStrength;
          }
        } else {
          if (distSq > 0.1) {
            const repulsionForce = 800 / (distSq + 50);
            fx += (dx / dist) * repulsionForce;
            fy += (dy / dist) * repulsionForce;
          }
        }
      });

      // Attraction (Springs) to Center Node
      if (centerNode && node.id !== centerNode.id) {
        const dx = centerNode.position.x - node.position.x;
        const dy = centerNode.position.y - node.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetDist = 30;
        let k = 0.05;

        if (node.type === "context") {
          targetDist = 18;
          k = 0.1;
        } else if (node.type === "sub-agent") {
          targetDist = 35; // Adjusted for wider pill
          k = 0.08;
        }

        const displacement = dist - targetDist;

        if (Math.abs(displacement) > 0.2) {
          fx += (dx / dist) * displacement * k;
          fy += (dy / dist) * displacement * k;
        }
      }

      node.fx = fx;
      node.fy = fy;
    });

    // 2. Integration
    nodes.forEach((node) => {
      if (node.isDragging || node.type === "orchestrator") {
        node.vx = 0;
        node.vy = 0;
        return;
      }

      node.vx += node.fx / node.mass;
      node.vy += node.fy / node.mass;

      node.vx *= DAMPING;
      node.vy *= DAMPING;

      const speedSq = node.vx * node.vx + node.vy * node.vy;
      if (speedSq > MAX_SPEED * MAX_SPEED) {
        const speed = Math.sqrt(speedSq);
        node.vx = (node.vx / speed) * MAX_SPEED;
        node.vy = (node.vy / speed) * MAX_SPEED;
      }

      if (speedSq < 0.0001) {
        node.vx = 0;
        node.vy = 0;
      }

      node.position.x += node.vx;
      node.position.y += node.vy;

      totalEnergy += speedSq;
    });

    // 3. Render Nodes
    nodes.forEach((node) => {
      const el = nodeRefs.current.get(node.id);
      if (el) {
        el.style.transform = `translate(${node.position.x * 10}px, ${
          node.position.y * 10
        }px) translate(-50%, -50%)`;
      }
    });

    // 4. Render Edge Lines
    if (centerNode) {
      nodes.forEach((node) => {
        if (node.type === "orchestrator") return;
        const line = lineRefs.current.get(node.id);
        if (line) {
          // Determine the parent node: use parentId if set, otherwise default to orchestrator
          let parentNode: PhysicsNode | undefined;
          if (node.parentId) {
            parentNode = nodes.find((n) => n.id === node.parentId);
          }
          if (!parentNode) {
            parentNode = centerNode;
          }
          const { x1, y1, x2, y2 } = calculateEdgeCoordinates(parentNode, node);
          line.setAttribute("x1", `${x1}`);
          line.setAttribute("y1", `${y1}`);
          line.setAttribute("x2", `${x2}`);
          line.setAttribute("y2", `${y2}`);
        }
      });
    }

    // 5. Render Interaction Line
    if (selectedNodeIdRef.current) {
      const selectedNode = nodes.find(
        (n) => n.id === selectedNodeIdRef.current
      );
      const isAgent =
        selectedNode &&
        (selectedNode.type === "orchestrator" ||
          selectedNode.type === "sub-agent");

      if (isAgent && interactionLineRef.current && selectedNode) {
        const sx = selectedNode.position.x * 10;
        const sy = selectedNode.position.y * 10;

        // Interaction Panel is fixed bottom-right: offset from window corner
        // We need to inverse project the screen coordinate to world coordinate
        // Target the center of the panel to ensure overlap
        const panelScreenX = windowSizeRef.current.w - 224; // Right - 24px - 200px (half width)
        const panelScreenY = windowSizeRef.current.h - 100; // Bottom - 24px - ~76px (half height)

        // Transform Screen -> World
        const worldTargetX =
          (panelScreenX - panRef.current.x) / scaleRef.current;
        const worldTargetY =
          (panelScreenY - panRef.current.y) / scaleRef.current;

        // Draw curved path
        const midX = (sx + worldTargetX) / 2;
        interactionLineRef.current.setAttribute(
          "d",
          `M${sx},${sy} L${worldTargetX},${worldTargetY}`
        );
        interactionLineRef.current.style.display = "block";
      } else if (interactionLineRef.current) {
        interactionLineRef.current.style.display = "none";
      }
    } else if (interactionLineRef.current) {
      interactionLineRef.current.style.display = "none";
    }

    // Always keep simulation running if dragging or energy exists
    if (totalEnergy > MIN_ENERGY || nodes.some((n) => n.isDragging)) {
      requestRef.current = requestAnimationFrame(updatePhysics);
    } else {
      isSimulating.current = false;
    }
  }, []);

  const calculateEdgeCoordinates = (
    center: PhysicsNode,
    target: PhysicsNode
  ) => {
    const cx = center.position.x * 10;
    const cy = center.position.y * 10;
    const tx = target.position.x * 10;
    const ty = target.position.y * 10;

    const angle = Math.atan2(ty - cy, tx - cx);
    const r = 48; // Orchestrator radius
    const startX = cx + Math.cos(angle) * r;
    const startY = cy + Math.sin(angle) * r;

    return { x1: startX, y1: startY, x2: tx, y2: ty };
  };

  useEffect(() => {
    startSimulation();
    return () => cancelAnimationFrame(requestRef.current);
  }, [updatePhysics]);

  // Interaction
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    const nodeEl = target.closest(".node-draggable");

    if (nodeEl) {
      const id = nodeEl.getAttribute("data-id");
      const node = physicsNodes.current.find((n) => n.id === id);
      if (node && containerRef.current) {
        onNodeSelect(id); // Select node
        node.isDragging = true;
        startSimulation();
        containerRef.current.setPointerCapture(e.pointerId);
        e.stopPropagation();
        return;
      }
    }

    // Deselect if clicking background
    onNodeSelect(null);

    setIsPanning(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const draggingNode = physicsNodes.current.find((n) => n.isDragging);
    if (draggingNode && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const worldX = (e.clientX - rect.left - pan.x) / scale;
      const worldY = (e.clientY - rect.top - pan.y) / scale;

      draggingNode.position.x = worldX / 10;
      draggingNode.position.y = worldY / 10;

      // Directly update the DOM for immediate visual feedback
      const el = nodeRefs.current.get(draggingNode.id);
      if (el) {
        el.style.transform = `translate(${draggingNode.position.x * 10}px, ${
          draggingNode.position.y * 10
        }px) translate(-50%, -50%)`;
      }

      // Update connected lines immediately
      const centerNode = physicsNodes.current.find(
        (n) => n.type === "orchestrator"
      );
      if (centerNode) {
        if (draggingNode.type === "orchestrator") {
          // Update all lines from orchestrator (nodes without parentId or with parentId = orchestrator)
          physicsNodes.current.forEach((node) => {
            if (
              node.id !== centerNode.id &&
              (!node.parentId || node.parentId === centerNode.id)
            ) {
              const line = lineRefs.current.get(node.id);
              if (line) {
                const { x1, y1, x2, y2 } = calculateEdgeCoordinates(
                  draggingNode,
                  node
                );
                line.setAttribute("x1", `${x1}`);
                line.setAttribute("y1", `${y1}`);
                line.setAttribute("x2", `${x2}`);
                line.setAttribute("y2", `${y2}`);
              }
            }
          });
        } else if (draggingNode.type === "sub-agent") {
          // Update line from this sub-agent to its parent (orchestrator)
          const line = lineRefs.current.get(draggingNode.id);
          if (line) {
            const { x1, y1, x2, y2 } = calculateEdgeCoordinates(
              centerNode,
              draggingNode
            );
            line.setAttribute("x1", `${x1}`);
            line.setAttribute("y1", `${y1}`);
            line.setAttribute("x2", `${x2}`);
            line.setAttribute("y2", `${y2}`);
          }
          // Also update lines from context nodes connected to this sub-agent
          physicsNodes.current.forEach((node) => {
            if (node.parentId === draggingNode.id) {
              const childLine = lineRefs.current.get(node.id);
              if (childLine) {
                const { x1, y1, x2, y2 } = calculateEdgeCoordinates(
                  draggingNode,
                  node
                );
                childLine.setAttribute("x1", `${x1}`);
                childLine.setAttribute("y1", `${y1}`);
                childLine.setAttribute("x2", `${x2}`);
                childLine.setAttribute("y2", `${y2}`);
              }
            }
          });
        } else {
          // Context node: update line to its parent
          const parentNode = draggingNode.parentId
            ? physicsNodes.current.find((n) => n.id === draggingNode.parentId)
            : centerNode;
          const line = lineRefs.current.get(draggingNode.id);
          if (line && parentNode) {
            const { x1, y1, x2, y2 } = calculateEdgeCoordinates(
              parentNode,
              draggingNode
            );
            line.setAttribute("x1", `${x1}`);
            line.setAttribute("y1", `${y1}`);
            line.setAttribute("x2", `${x2}`);
            line.setAttribute("y2", `${y2}`);
          }
        }
      }

      startSimulation();
      return;
    }

    if (isPanning && dragStartRef.current) {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsPanning(false);
    physicsNodes.current.forEach((n) => (n.isDragging = false));
    if (containerRef.current?.hasPointerCapture(e.pointerId)) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const renderLines = () => {
    const centerNode = physicsNodes.current.find(
      (n) => n.type === "orchestrator"
    );

    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        style={{ width: "1000px", height: "1000px" }}
      >
        {/* Node-to-Parent Lines */}
        {physicsNodes.current.map((node) => {
          if (node.type === "orchestrator") return null;

          // Determine the parent node: use parentId if set, otherwise default to orchestrator
          let parentNode: PhysicsNode | undefined;
          if (node.parentId) {
            parentNode = physicsNodes.current.find(
              (n) => n.id === node.parentId
            );
          }
          // Fall back to orchestrator if no parentId or parent not found
          if (!parentNode) {
            parentNode = centerNode;
          }
          if (!parentNode) return null;

          const { x1, y1, x2, y2 } = calculateEdgeCoordinates(parentNode, node);
          return (
            <line
              key={`line-${node.id}`}
              ref={(el) => {
                if (el) lineRefs.current.set(node.id, el);
              }}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#ffffff"
              strokeWidth={node.type === "context" ? 1.5 : 2}
              strokeDasharray={node.status === "loading" ? "5,5" : "0"}
              style={{ opacity: node.status === "loading" ? 0.6 : 1 }}
            />
          );
        })}
        {/* Interaction Panel Line (Dynamic) */}
        <path
          ref={interactionLineRef}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeDasharray="4,4"
          style={{ display: "none", opacity: 0.5 }}
        />
      </svg>
    );
  };

  const renderNode = (node: PhysicsNode) => {
    const isCenter = node.type === "orchestrator";
    const isSubAgent = node.type === "sub-agent";
    const isSelected = selectedNodeId === node.id;

    // High contrast white ring for selection
    const selectionRing = isSelected
      ? "ring-2 ring-white ring-offset-2 ring-offset-black shadow-[0_0_20px_rgba(255,255,255,0.4)]"
      : "";

    if (isCenter) {
      return (
        <div
          key={node.id}
          data-id={node.id}
          ref={(el) => {
            if (el) nodeRefs.current.set(node.id, el);
          }}
          className="absolute left-0 top-0 will-change-transform node-draggable touch-none"
          style={{
            transform: `translate(${node.position.x * 10}px, ${
              node.position.y * 10
            }px) translate(-50%, -50%)`,
          }}
        >
          <div
            className={`relative group cursor-grab active:cursor-grabbing rounded-full ${selectionRing}`}
          >
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="96"
                height="96"
                viewBox="0 0 36 36"
                fill="none"
                className="absolute inset-0 w-full h-full"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="17.75"
                  fill="#262626"
                  stroke="url(#paint0_linear_orchestrator)"
                  strokeWidth="0.5"
                ></circle>
                <defs>
                  <linearGradient
                    id="paint0_linear_orchestrator"
                    x1="32.5"
                    y1="-4.5"
                    x2="4"
                    y2="42.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.149038" stopColor="#D9D9D9"></stop>
                    <stop offset="0.576923"></stop>
                    <stop offset="0.855769" stopColor="white"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <Bot className="relative w-10 h-10 text-white/80 z-10" />
            </div>
          </div>
        </div>
      );
    } else if (isSubAgent) {
      return (
        <div
          key={node.id}
          data-id={node.id}
          ref={(el) => {
            if (el) nodeRefs.current.set(node.id, el);
          }}
          className="absolute left-0 top-0 will-change-transform node-draggable touch-none"
          style={{
            transform: `translate(${node.position.x * 10}px, ${
              node.position.y * 10
            }px) translate(-50%, -50%)`,
          }}
        >
          <div
            className={`glass-panel w-[280px] h-[60px] rounded-[30px] flex items-center pr-2 relative overflow-hidden group hover:bg-white/2 transition-colors cursor-grab active:cursor-grabbing ${selectionRing}`}
            onMouseMove={(e) => {
              const rect = (
                e.currentTarget as HTMLDivElement
              ).getBoundingClientRect();
              (e.currentTarget as HTMLDivElement).style.setProperty(
                "--mouse-x",
                `${e.clientX - rect.left}px`
              );
              (e.currentTarget as HTMLDivElement).style.setProperty(
                "--mouse-y",
                `${e.clientY - rect.top}px`
              );
            }}
          >
            {/* Hover tooltip with agent name */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-12 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {node.title}
            </div>
            {/* Text container matching template */}
            <div className="flex-1 overflow-hidden h-full relative">
              <ScrollingText logs={node.logs || []} height={60} />
            </div>

            {/* Template circle with agent icon */}
            <div className="shrink-0 relative w-[46px] h-[46px] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="46"
                viewBox="0 0 36 36"
                fill="none"
                className="absolute inset-0 w-full h-full"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="17.75"
                  fill="#262626"
                  stroke="url(#paint0_linear_18_10)"
                  strokeWidth="0.5"
                ></circle>
                <defs>
                  <linearGradient
                    id="paint0_linear_18_10"
                    x1="32.5"
                    y1="-4.5"
                    x2="4"
                    y2="42.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.149038" stopColor="#D9D9D9"></stop>
                    <stop offset="0.576923"></stop>
                    <stop offset="0.855769" stopColor="white"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <Icon
                icon={
                  (node.title || "").toLowerCase().includes("compile")
                    ? "bi:code-slash"
                    : (node.title || "").toLowerCase().includes("index")
                    ? "bi:database"
                    : (node.title || "").toLowerCase().includes("valid")
                    ? "bi:shield-check"
                    : (node.title || "").toLowerCase().includes("plan")
                    ? "bi:journal-check"
                    : "bi:robot"
                }
                width={20}
                height={20}
                className="relative text-white/80 z-10"
              />

              {node.status === "loading" && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3 z-20">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      // Context - Using Query Component Design from restyled.html
      return (
        <div
          key={node.id}
          data-id={node.id}
          ref={(el) => {
            if (el) nodeRefs.current.set(node.id, el);
          }}
          className="absolute left-0 top-0 will-change-transform node-draggable touch-none"
          style={{
            transform: `translate(${node.position.x * 10}px, ${
              node.position.y * 10
            }px) translate(-50%, -50%)`,
          }}
        >
          <div
            className={`glass-panel w-[320px] p-6 rounded-[20px] min-h-[140px] flex flex-col justify-between group cursor-grab active:cursor-grabbing hover:bg-white/2 transition-colors relative overflow-hidden ${selectionRing}`}
          >
            <div className="space-y-3 z-10">
              <p className="text-white/90 text-lg leading-snug">
                {node.subtitle || node.details || "Context"}
              </p>
            </div>
            <div className="flex items-end justify-between z-10 pt-4">
              <p className="text-white/50 text-sm">{node.title}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNodeExpand(node.id);
                }}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-all group-hover:scale-110"
              >
                <Maximize2 size={16} className="text-white" />
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500 pointer-events-none"></div>
          </div>
        </div>
      );
    }
  };

  // White dot pattern with low opacity for background texture
  const dotPattern = `data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23ffffff' fill-opacity='0.15'/%3E%3C/svg%3E`;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-black select-none ${
        isPanning ? "cursor-grabbing" : "cursor-default"
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `url("${dotPattern}")`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      ></div>

      <div
        className="absolute left-0 top-0 w-[1000px] h-[1000px] origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
        }}
      >
        {renderLines()}
        {physicsNodes.current.map(renderNode)}
      </div>
    </div>
  );
};

export default WorkflowGraph;
