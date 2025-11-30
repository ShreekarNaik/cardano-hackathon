/**
 * MAKER Orchestration Framework
 * Million-agent task decomposition with zero-error execution
 * Based on arXiv:2511.09030
 */

// Types
export * from './types';

// Core components
export { TaskDecomposer } from './TaskDecomposer';
export { VotingManager } from './VotingManager';

/**
 * MAKER Orchestration - TypeScript Interface
 * 
 * Provides TypeScript bindings for the Python MAKER orchestrator
 */

export interface Task {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: any;
}

export interface Agent {
  id: string;
  type: string;
  reputation: number;
}

export interface VotingResult {
  consensus: any;
  votes: number;
  confidence: number;
}

// Re-export key types for convenience
export {
  type MAKERTask,
  type Subtask,
  type SubtaskResult,
  type VotingRecord,
  type MAKEROrchestratorConfig,
  TaskStatus,
  SubtaskStatus
} from './types';

/**
 * Configuration for task decomposition
 */
export interface DecompositionConfig {
  totalSteps: number;
  subtasksCount: number;
  votersPerSubtask: number;
  parallelism: number;
  errorCorrectionEnabled: boolean;
  timeoutPerSubtask: number;
  minConsensusThreshold: number;
  maxDepth?: number; // Added from user's new interface
  minSubtasks?: number; // Added from user's new interface
  maxSubtasks?: number; // Added from user's new interface
  parallelExecution?: boolean; // Added from user's new interface
  votingThreshold?: number; // Added from user's new interface
}

/**
 * Default configuration for MAKER orchestration
 */
export const DEFAULT_MAKER_CONFIG: Partial<DecompositionConfig> = {
  votersPerSubtask: 3,
  parallelism: 10,
  errorCorrectionEnabled: true,
  timeoutPerSubtask: 300000, // 5 minutes
  minConsensusThreshold: 0.6
};

/**
 * Create a decomposition config with defaults
 */
export function createDecompositionConfig(
  totalSteps: number,
  subtasksCount?: number,
  overrides?: Partial<DecompositionConfig>
): DecompositionConfig {
  const defaultSubtasksCount = Math.min(
    Math.max(Math.floor(totalSteps / 100), 10),
    500
  );

  return {
    totalSteps,
    subtasksCount: subtasksCount || defaultSubtasksCount,
    votersPerSubtask: DEFAULT_MAKER_CONFIG.votersPerSubtask!,
    parallelism: DEFAULT_MAKER_CONFIG.parallelism!,
    errorCorrectionEnabled: DEFAULT_MAKER_CONFIG.errorCorrectionEnabled!,
    timeoutPerSubtask: DEFAULT_MAKER_CONFIG.timeoutPerSubtask!,
    minConsensusThreshold: DEFAULT_MAKER_CONFIG.minConsensusThreshold!,
    ...overrides
  };
}

/**
 * Calculate recommended number of subtasks for a given step count
 */
export function calculateRecommendedSubtasks(totalSteps: number): number {
  if (totalSteps < 100) return 10;
  if (totalSteps < 1000) return Math.floor(totalSteps / 100);
  if (totalSteps < 10000) return Math.floor(totalSteps / 500);
  if (totalSteps < 100000) return Math.floor(totalSteps / 1000);
  return Math.floor(totalSteps / 5000); // For 1M+ steps
}

/**
 * Calculate required number of microagents for a task
 */
export function calculateRequiredAgents(config: DecompositionConfig): number {
  return config.subtasksCount * config.votersPerSubtask;
}

/**
 * Estimate total execution time for a task
 */
export function estimateExecutionTime(
  config: DecompositionConfig
): {
  optimistic: number; // All parallel
  realistic: number; // Considering parallelism limits
  pessimistic: number; // All sequential
} {
  const subtaskTime =
    config.timeoutPerSubtask +
    5000 + // Voting
    2000; // Aggregation

  return {
    optimistic: subtaskTime * Math.ceil(config.subtasksCount / 1000), // Assume high parallelism
    realistic:
      subtaskTime * Math.ceil(config.subtasksCount / config.parallelism),
    pessimistic: subtaskTime * config.subtasksCount
  };
}
