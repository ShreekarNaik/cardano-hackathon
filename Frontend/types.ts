export interface AgentActivity {
  id: string;
  type: "thought" | "tool_call" | "tool_result" | "output" | "user";
  content: string; // The main text content or output
  timestamp: string;
  toolName?: string;
  toolArgs?: Record<string, any>;
}

export interface AgentNode {
  id: string;
  type: "orchestrator" | "sub-agent" | "context";
  status: "active" | "idle" | "loading" | "completed";
  title?: string;
  subtitle?: string; // For questions/context
  logs?: string[]; // For the live loading view
  position: { x: number; y: number }; // Percentage 0-100
  details?: string; // For the expanded conversation/details popup (legacy/context)
  history?: AgentActivity[]; // Structured history for agents
  parentId?: string; // For context nodes: the agent node this context is connected to
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
}

export interface JobMetadata {
  id: string;
  startTime: number; // Date.now()
}
