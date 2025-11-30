/**
 * Agent Service
 *
 * Handles all agent-related data operations.
 * Currently uses mock data, can be swapped for real API calls.
 */

import { AgentNode, LogEntry } from "../types";
import { MOCK_NODES, MOCK_LOGS, MOCK_LOG_MESSAGES } from "./mockData";

// Toggle for development vs production
const USE_MOCK = true;

/**
 * Fetch initial agent nodes
 */
export const fetchNodes = async (): Promise<AgentNode[]> => {
  if (USE_MOCK) {
    // Simulate network delay
    await delay(100);
    return [...MOCK_NODES];
  }

  // TODO: Replace with actual API call
  // const response = await fetch('/api/agents/nodes');
  // return response.json();
  throw new Error("API not implemented");
};

/**
 * Fetch initial logs
 */
export const fetchLogs = async (): Promise<LogEntry[]> => {
  if (USE_MOCK) {
    await delay(2000 + Math.random() * 1000); // 2–3s
    return [...MOCK_LOGS];
  }

  // TODO: Replace with actual API call
  throw new Error("API not implemented");
};

/**
 * Get a random log message (for simulating real-time logs)
 */
export const getRandomLogMessage = (): string => {
  return MOCK_LOG_MESSAGES[
    Math.floor(Math.random() * MOCK_LOG_MESSAGES.length)
  ];
};

/**
 * Generate a new log entry
 */
export const generateLogEntry = (): LogEntry => {
  return {
    id: Date.now().toString(),
    timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
    level: Math.random() > 0.8 ? "debug" : "info",
    message: getRandomLogMessage(),
  };
};

/**
 * Get initial data (nodes and logs)
 */
export const getInitialData = (): { nodes: AgentNode[]; logs: LogEntry[] } => {
  return {
    nodes: [...MOCK_NODES],
    logs: [...MOCK_LOGS],
  };
};

// Utility function for simulating network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
