import { AgentNode, LogEntry } from "../types";

// CONTEXT NODES (Query + Final Answer)
const CONTEXT_NODES: AgentNode[] = [
  {
    id: "context-query",
    type: "context",
    status: "completed",
    title: "User Query",
    subtitle: "Estimate how many grains of sand are there on Earth?",
    position: { x: 50, y: 5 },
    details: "Original question from the user.",
    logs: [],
    history: [
      {
        id: "ctx-q-1",
        type: "user",
        content: "Estimate how many grains of sand are there on Earth?",
        timestamp: "05:53:12",
      },
    ],
    parentId: "ceo-agent",
  },
  {
    id: "context-final-answer",
    type: "context",
    status: "completed",
    title: "Final Answer",
    subtitle: "7.5 x 10^18 grains of sand",
    position: { x: 50, y: 95 },
    details: "Aggregated answer recorded on-chain.",
    logs: [],
    history: [
      {
        id: "ctx-a-1",
        type: "output",
        content:
          "The estimated number of grains of sand on Earth is about 7.5 x 10^18 (7.5 quintillion).",
        timestamp: "05:53:25",
      },
    ],
    parentId: "ceo-agent",
  },
];

// SUB-AGENT LOGS FROM run.log
const GEO_LOGS = [
  "[Geologist] Processing coastline data...",
  "Computed coastline length: 356,000 km",
];

const PHY_LOGS = [
  "[Physics] Analyzing beach structure...",
  "Computed formula: Length * 50m * 10m",
];

const MATH_LOGS = [
  "[Math] Calculating granular density...",
  "Calculated: 8,000,000,000 grains/m³",
];

// MAIN AGENT + SUB-AGENTS
export const MOCK_NODES: AgentNode[] = [
  {
    id: "ceo-agent",
    type: "orchestrator",
    status: "completed",
    title: "CEO Agent",
    subtitle: "Coordinator & Aggregator",
    position: { x: 50, y: 50 },
    details: "Estimated Cost: 5 ADA",
    logs: [
      "Analyzing request...",
      "Delegating tasks to agents...",
      "Aggregating results...",
      "Final computation completed.",
    ],
    history: [
      {
        id: "ceo-1",
        type: "thought",
        content:
          "Received user query: Estimate how many grains of sand are there on Earth?",
        timestamp: "05:53:12",
      },
      {
        id: "ceo-2",
        type: "thought",
        content:
          "Assessing complexity and estimating required resources (approx. 5 ADA).",
        timestamp: "05:53:13",
      },
      {
        id: "ceo-3",
        type: "thought",
        content:
          "Initiating payment via Masumi Network and opening a Hydra Head for fast coordination.",
        timestamp: "05:53:14",
      },
      {
        id: "ceo-tc-1",
        type: "tool_call",
        toolName: "openHydraHead",
        toolArgs: {
          participants: ["CEO", "Geologist", "Physics", "Math"],
          ttl: 600,
        },
        content: "",
        timestamp: "05:53:14",
      },
      {
        id: "ceo-tr-1",
        type: "tool_result",
        content:
          "Hydra Head OPEN: session=hydra-0x9a87, participants=4, latency~30ms",
        timestamp: "05:53:17",
      },
      {
        id: "ceo-tc-2",
        type: "tool_call",
        toolName: "pay",
        toolArgs: {
          amountADA: 5,
          to: "masumi:agents-pool",
          memo: "job:grains-of-sand",
        },
        content: "",
        timestamp: "05:53:17",
      },
      {
        id: "ceo-tr-2",
        type: "tool_result",
        content: "Payment Confirmed (txHash=2c4c04c6..., slots=2)",
        timestamp: "05:53:18",
      },
      {
        id: "ceo-4",
        type: "thought",
        content:
          "Decomposing problem into sub-tasks for Geologist, Physics, and Math agents.",
        timestamp: "05:53:17",
      },
      {
        id: "ceo-5",
        type: "thought",
        content:
          "Collecting partial results from agents and checking for consistency across assumptions.",
        timestamp: "05:53:23",
      },
      {
        id: "ceo-tc-3",
        type: "tool_call",
        toolName: "aggregateResults",
        toolArgs: {
          combine: ["coastline_km", "beach_volume_model", "grains_per_m3"],
        },
        content: "",
        timestamp: "05:53:24",
      },
      {
        id: "ceo-tr-3",
        type: "tool_result",
        content:
          "Aggregation OK: derived estimate ≈ 7.5e18 grains (consistency checks passed)",
        timestamp: "05:53:25",
      },
      {
        id: "ceo-6",
        type: "thought",
        content:
          "Formulating final answer and preparing proof for Cardano Layer 1 metadata.",
        timestamp: "05:53:25",
      },
      {
        id: "ceo-7",
        type: "output",
        content:
          "Final answer: approximately 7.5 x 10^18 grains of sand on Earth, based on coastline length, beach volume, and grain density.",
        timestamp: "05:53:25",
      },
    ],
  },
  {
    id: "geologist-agent",
    type: "sub-agent",
    status: "completed",
    title: "Geologist Agent",
    subtitle: "Coastline Estimation",
    position: { x: 20, y: 40 },
    details: "Result: 356,000 km\nConfidence: 0.85",
    logs: GEO_LOGS,
    history: [
      {
        id: "geo-1",
        type: "thought",
        content:
          "Received task from CEO: estimate total coastline length relevant for sandy shores.",
        timestamp: "05:53:17",
      },
      {
        id: "geo-tc-1",
        type: "tool_call",
        toolName: "fetchCoastlineData",
        toolArgs: { region: "global", filter: "sandy-shorelines", unit: "km" },
        content: "",
        timestamp: "05:53:18",
      },
      {
        id: "geo-tr-1",
        type: "tool_result",
        content:
          "Dataset merged: NOAA + OpenCoastline; effective sandy segments extracted (resolution 1km).",
        timestamp: "05:53:18",
      },
      {
        id: "geo-2",
        type: "thought",
        content:
          "Aggregating known global coastline estimates and adjusting for beach-bearing segments.",
        timestamp: "05:53:18",
      },
      {
        id: "geo-tc-2",
        type: "tool_call",
        toolName: "sumLengths",
        toolArgs: { segments: 128734, rounding: 100 },
        content: "",
        timestamp: "05:53:19",
      },
      {
        id: "geo-tr-2",
        type: "tool_result",
        content:
          "Computed coastline length: 356,000 km (±12%) after smoothing fringing noise.",
        timestamp: "05:53:19",
      },
      {
        id: "geo-3",
        type: "thought",
        content:
          "Settling on an effective sandy coastline length of ~356,000 km.",
        timestamp: "05:53:19",
      },
      {
        id: "geo-4",
        type: "output",
        content: "Reported coastline estimate: 356,000 km (confidence ~0.85).",
        timestamp: "05:53:19",
      },
    ],
    parentId: "ceo-agent",
  },
  {
    id: "physics-agent",
    type: "sub-agent",
    status: "completed",
    title: "Physics Agent",
    subtitle: "Beach Volume Calculation",
    position: { x: 50, y: 40 },
    details: "Volume = Length * 50m * 10m\nConfidence: 0.92",
    logs: PHY_LOGS,
    history: [
      {
        id: "phy-1",
        type: "thought",
        content:
          "Received task from CEO: estimate average beach volume along the sandy coastline.",
        timestamp: "05:53:19",
      },
      {
        id: "phy-2",
        type: "thought",
        content:
          "Assuming average beach cross-section: 50 m width and 10 m effective sand depth.",
        timestamp: "05:53:20",
      },
      {
        id: "phy-tc-1",
        type: "tool_call",
        toolName: "computeBeachVolume",
        toolArgs: { coastline_km: 356000, width_m: 50, depth_m: 10 },
        content: "",
        timestamp: "05:53:20",
      },
      {
        id: "phy-tr-1",
        type: "tool_result",
        content:
          "Volume model ready: V = L(km) * 1e3 * 50 * 10 m³; returns scalar in m³.",
        timestamp: "05:53:21",
      },
      {
        id: "phy-3",
        type: "thought",
        content:
          "Deriving volume formula: Volume = coastline length * 50 m * 10 m.",
        timestamp: "05:53:21",
      },
      {
        id: "phy-4",
        type: "output",
        content:
          "Provided beach volume model back to CEO for use in the final grain count.",
        timestamp: "05:53:21",
      },
    ],
    parentId: "ceo-agent",
  },
  {
    id: "math-agent",
    type: "sub-agent",
    status: "completed",
    title: "Math Agent",
    subtitle: "Grain Density Computation",
    position: { x: 80, y: 40 },
    details: "8,000,000,000 grains/m³\nConfidence: 0.95",
    logs: MATH_LOGS,
    history: [
      {
        id: "math-1",
        type: "thought",
        content:
          "Received task from CEO: determine approximate number of grains of sand per cubic meter.",
        timestamp: "05:53:21",
      },
      {
        id: "math-2",
        type: "thought",
        content:
          "Using typical grain sizes and packing density to estimate grains per m³.",
        timestamp: "05:53:22",
      },
      {
        id: "math-tc-1",
        type: "tool_call",
        toolName: "estimateGrainDensity",
        toolArgs: { grainSize_mm: 0.5, packing: "random-close", porosity: 0.4 },
        content: "",
        timestamp: "05:53:22",
      },
      {
        id: "math-tr-1",
        type: "tool_result",
        content:
          "Estimated grains per m³ ≈ 8.0e9 using size 0.5mm and RCP model.",
        timestamp: "05:53:23",
      },
      {
        id: "math-3",
        type: "thought",
        content:
          "Arrived at estimate: ~8,000,000,000 grains per cubic meter of beach sand.",
        timestamp: "05:53:23",
      },
      {
        id: "math-4",
        type: "output",
        content:
          "Reported density estimate: 8,000,000,000 grains/m³ (high confidence).",
        timestamp: "05:53:23",
      },
    ],
    parentId: "ceo-agent",
  },
  ...CONTEXT_NODES,
];

// LOG PANEL ENTRIES (Console)
export const MOCK_LOGS: LogEntry[] = [
  {
    id: "1",
    timestamp: "05:53:12",
    level: "info",
    message:
      'Received Query: "Estimate how many grains of sand are there on Earth?"',
  },
  {
    id: "2",
    timestamp: "05:53:13",
    level: "info",
    message: "CEO Agent estimated cost: 5 ADA",
  },
  {
    id: "3",
    timestamp: "05:53:14",
    level: "info",
    message: "Payment Confirmed (txHash=2c4c04c6...)",
  },
  {
    id: "4",
    timestamp: "05:53:17",
    level: "info",
    message: "Hydra Head OPEN for agents CEO, Geologist, Physics, Math",
  },
  {
    id: "5",
    timestamp: "05:53:19",
    level: "info",
    message: "Geologist Agent Result: 356,000 km",
  },
  {
    id: "6",
    timestamp: "05:53:21",
    level: "info",
    message: "Physics Agent Result: Volume = L * 50m * 10m",
  },
  {
    id: "7",
    timestamp: "05:53:23",
    level: "info",
    message: "Math Agent Result: 8,000,000,000 grains/m³",
  },
  {
    id: "8",
    timestamp: "05:53:25",
    level: "info",
    message: "Final Answer: 7.5 x 10^18 grains of sand",
  },
];

// Live log simulator messages
export const MOCK_LOG_MESSAGES: string[] = [
  "Hydra: synchronizing states...",
  "Agent idle...",
  "Chain verification pending...",
  "Computing subtask...",
  "Aggregating results...",
];
