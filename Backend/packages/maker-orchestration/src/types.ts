/**
 * MAKER Framework Types
 * Based on arXiv:2511.09030 - MAKER: million-agent task decomposition
 */

/**
 * Subtask in MAKER decomposition
 */
export interface Subtask {
  id: string;
  taskId: string;
  index: number;
  startStep: number;
  endStep: number;
  description: string;
  dependencies: string[]; // IDs of dependent subtasks
  status: SubtaskStatus;
  assignedAgents: string[]; // Agent DIDs
  results: SubtaskResult[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Subtask execution status
 */
export enum SubtaskStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  VOTING = 'VOTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ERROR_CORRECTION = 'ERROR_CORRECTION'
}

/**
 * Result from a single microagent
 */
export interface SubtaskResult {
  agentId: string;
  agentDID: string;
  result: any;
  confidence: number;
  executionTime: number; // milliseconds
  timestamp: Date;
  errors?: string[];
}

/**
 * Voting record for a subtask
 */
export interface VotingRecord {
  subtaskId: string;
  voterAgents: string[];
  votes: Vote[];
  majorityResult: any;
  consensusConfidence: number;
  minorityResults: any[];
  timestamp: Date;
}

/**
 * Individual vote
 */
export interface Vote {
  agentId: string;
  agentDID: string;
  result: any;
  confidence: number;
  reputation: number;
}

/**
 * Task decomposition configuration
 */
export interface DecompositionConfig {
  totalSteps: number;
  subtasksCount: number;
  votersPerSubtask: number; // Minimum 3
  parallelism: number; // Max parallel subtasks
  errorCorrectionEnabled: boolean;
  timeoutPerSubtask: number; // milliseconds
  minConsensusThreshold: number; // 0-1
}

/**
 * Main MAKER task
 */
export interface MAKERTask {
  id: string;
  description: string;
  totalSteps: number;
  config: DecompositionConfig;
  subtasks: Subtask[];
  status: TaskStatus;
  startedAt?: Date;
  completedAt?: Date;
  finalResult?: any;
  metadata?: Record<string, any>;
}

/**
 * Overall task status
 */
export enum TaskStatus {
  CREATED = 'CREATED',
  DECOMPOSING = 'DECOMPOSING',
  EXECUTING = 'EXECUTING',
  VOTING = 'VOTING',
  AGGREGATING = 'AGGREGATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

/**
 * Workflow execution state
 */
export interface WorkflowState {
  taskId: string;
  currentStep: number;
  completedSubtasks: number;
  totalSubtasks: number;
  activeSubtasks: string[];
  errorCount: number;
  retryCount: number;
}

/**
 * Error correction record
 */
export interface ErrorCorrection {
  subtaskId: string;
  originalError: string;
  correctionAttempt: number;
  correctionStrategy: string;
  newAgents: string[];
  resolved: boolean;
  timestamp: Date;
}

/**
 * Agent reputation update for MAKER
 */
export interface MAKERReputationUpdate {
  agentId: string;
  agentDID: string;
  subtaskId: string;
  wasInMajority: boolean;
  confidenceAccuracy: number;
  executionTime: number;
  reputationDelta: number;
}

/**
 * MAKER orchestrator configuration
 */
export interface MAKEROrchestratorConfig {
  openaiApiKey: string;
  openaiModel?: string;
  masumiRegistryUrl: string;
  masumiPaymentUrl: string;
  defaultVotersPerSubtask?: number;
  defaultParallelism?: number;
  defaultTimeout?: number;
  minConsensusThreshold?: number;
  paymentPerSubtask?: bigint;
}

/**
 * Task decomposition result
 */
export interface DecompositionResult {
  taskId: string;
  totalSteps: number;
  subtasks: Subtask[];
  dependencies: Map<string, string[]>;
  estimatedDuration: number; // milliseconds
}

/**
 * Aggregation result
 */
export interface AggregationResult {
  taskId: string;
  subtaskResults: Map<string, any>;
  finalResult: any;
  overallConfidence: number;
  totalExecutionTime: number;
  errorRate: number;
}

/**
 * Microagent pool
 */
export interface MicroagentPool {
  taskId: string;
  availableAgents: string[]; // Agent DIDs
  busyAgents: Map<string, string>; // Agent DID -> Subtask ID
  agentReputations: Map<string, number>;
  agentCapabilities: Map<string, string[]>;
}

/**
 * Subtask assignment
 */
export interface SubtaskAssignment {
  subtaskId: string;
  agentDID: string;
  assignedAt: Date;
  deadline: Date;
  payment?: bigint;
}
