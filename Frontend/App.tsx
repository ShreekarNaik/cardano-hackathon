import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import WorkflowGraph from "./components/WorkflowGraph";
import Console from "./components/Console";
import InteractionPanel from "./components/InteractionPanel";
import ContextPopup from "./components/ContextPopup";
import AgentHistoryModal from "./components/AgentHistoryModal";
import { getInitialData, generateLogEntry } from "./services";
import { AgentNode, LogEntry } from "./types";

const { nodes: INITIAL_NODES, logs: INITIAL_LOGS } = getInitialData();

const App: React.FC = () => {
  // Start slower: stage nodes/logs over a short timeline
  const [nodes, setNodes] = useState<AgentNode[]>(() => {
    // Hide final answer initially, set agents to loading with empty logs
    const base = INITIAL_NODES.filter((n) => n.id !== "context-final-answer");
    return base.map((n) =>
      n.type === "orchestrator" || n.type === "sub-agent"
        ? { ...n, status: "loading", logs: [] }
        : n
    );
  });
  const [logs, setLogs] = useState<LogEntry[]>(() => [INITIAL_LOGS[0]]);
  const [isPaused, setIsPaused] = useState(false);
  const [jobId] = useState("0xdsdfa928374...");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [viewingAgentId, setViewingAgentId] = useState<string | null>(null);

  // Simulate incoming logs
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const newLog = generateLogEntry();
      setLogs((prev) => [...prev.slice(-49), newLog]); // Keep last 50
    }, 2500);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Dynamic Lighting Engine & Global Blur
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const panels = document.querySelectorAll(".glass-panel, .glass-popup");
      panels.forEach((panel) => {
        const rect = panel.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (panel as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
        (panel as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Set initial blur variable
    document.documentElement.style.setProperty("--glass-blur", "24px");

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Slow demo timeline: progressively show agent work/results
  useEffect(() => {
    const originalLogsById = new Map<string, string[]>(
      INITIAL_NODES.filter((n) => Array.isArray(n.logs)).map((n) => [
        n.id,
        n.logs as string[],
      ])
    );

    const timeouts: number[] = [];
    const schedule = (ms: number, fn: () => void) => {
      const id = window.setTimeout(fn, ms);
      timeouts.push(id);
    };

    const appendNodeLog = (id: string, msg?: string) => {
      if (!msg) return;
      setNodes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, logs: [...(n.logs || []), msg] } : n
        )
      );
    };

    const setNodeStatus = (id: string, status: AgentNode["status"]) => {
      setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, status } : n)));
    };

    const appendConsole = (entry: LogEntry) => {
      setLogs((prev) => [...prev, entry]);
    };

    // Console: cost, payment, hydra
    schedule(800, () => appendConsole(INITIAL_LOGS[1]));
    schedule(1400, () => appendConsole(INITIAL_LOGS[2]));
    schedule(2200, () => appendConsole(INITIAL_LOGS[3]));

    // Sub-agents start typing their first log
    const geo = originalLogsById.get("geologist-agent") || [];
    const phy = originalLogsById.get("physics-agent") || [];
    const math = originalLogsById.get("math-agent") || [];

    schedule(1600, () => appendNodeLog("geologist-agent", geo[0]));
    schedule(2200, () => appendNodeLog("physics-agent", phy[0]));
    schedule(2800, () => appendNodeLog("math-agent", math[0]));

    // Second log lines
    schedule(3200, () => appendNodeLog("geologist-agent", geo[1]));
    schedule(3800, () => appendNodeLog("physics-agent", phy[1]));
    schedule(4400, () => appendNodeLog("math-agent", math[1]));

    // Mark results as they complete + console updates
    schedule(4200, () => {
      setNodeStatus("geologist-agent", "completed");
      appendConsole(INITIAL_LOGS[4]);
    });
    schedule(5600, () => {
      setNodeStatus("physics-agent", "completed");
      appendConsole(INITIAL_LOGS[5]);
    });
    schedule(7000, () => {
      setNodeStatus("math-agent", "completed");
      appendConsole(INITIAL_LOGS[6]);
    });

    // Final answer appears; orchestrator completes
    schedule(8500, () => {
      setNodes((prev) => {
        const finalNode = INITIAL_NODES.find(
          (n) => n.id === "context-final-answer"
        );
        const withFinal = finalNode ? [...prev, finalNode] : prev;
        return withFinal.map((n) =>
          n.id === "ceo-agent" ? { ...n, status: "completed" } : n
        );
      });
      appendConsole(INITIAL_LOGS[7]);
    });

    return () => {
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, []);

  // Position updates are handled internally by the physics engine in WorkflowGraph
  // We only pass the initial nodes or semantic updates (like logs/status changes)
  const handleNodeMove = (id: string, position: { x: number; y: number }) => {
    // Optional: If we needed to persist position to backend, we would do it here.
    // For now, the visual physics engine handles the interaction.
  };

  const handleGuidanceSubmit = (text: string) => {
    // Spawn the new context node near the selected agent node
    const targetNode = selectedNode;
    const spawnPosition = targetNode
      ? {
          x: targetNode.position.x + (Math.random() - 0.5) * 10,
          y: targetNode.position.y + (Math.random() - 0.5) * 10,
        }
      : { x: 55, y: 55 };

    const newNode: AgentNode = {
      id: `ctx-${Date.now()}`,
      type: "context",
      status: "active",
      title: "Guidance",
      subtitle: text,
      position: spawnPosition,
      details: `[${new Date().toLocaleTimeString()}] User: ${text}`,
      parentId: selectedNodeId || undefined, // Connect to the selected agent
    };
    setNodes((prev) => [...prev, newNode]);

    // Add a log entry for feedback
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      level: "info",
      message: `New guidance injected: "${text.substring(0, 30)}${
        text.length > 30 ? "..." : ""
      }"`,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  // Only show interaction panel for Agents (Orchestrator/Sub-agent), NOT Context nodes
  const showInteractionPanel = selectedNode
    ? selectedNode.type === "orchestrator" || selectedNode.type === "sub-agent"
    : false;

  return (
    <div className="relative w-full h-full bg-black font-sans select-none overflow-hidden">
      {/* Floating Agent Dock */}
      <Sidebar
        nodes={nodes}
        onAgentClick={(node) => setViewingAgentId(node.id)}
      />

      {/* Main Content Area */}
      <div className="absolute inset-0 flex flex-col">
        <TopBar
          jobId={jobId}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused(!isPaused)}
        />

        {/* Main Canvas */}
        <div className="flex-1 relative z-10 overflow-hidden bg-black">
          <WorkflowGraph
            nodes={nodes}
            onNodeMove={handleNodeMove}
            selectedNodeId={selectedNodeId}
            onNodeSelect={setSelectedNodeId}
            onNodeExpand={setExpandedNodeId}
          />
        </div>
      </div>

      {/* Floating Bottom Panels - Fixed positioning */}
      <Console logs={logs} />
      {showInteractionPanel && selectedNode && (
        <InteractionPanel node={selectedNode} onSubmit={handleGuidanceSubmit} />
      )}

      {/* Modals */}
      {expandedNodeId && (
        <ContextPopup
          node={nodes.find((n) => n.id === expandedNodeId)!}
          onClose={() => setExpandedNodeId(null)}
        />
      )}

      {viewingAgentId && (
        <AgentHistoryModal
          node={nodes.find((n) => n.id === viewingAgentId)!}
          onClose={() => setViewingAgentId(null)}
        />
      )}
    </div>
  );
};

export default App;
