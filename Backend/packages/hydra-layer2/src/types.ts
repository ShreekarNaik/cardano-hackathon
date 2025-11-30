/**
 * Hydra Layer 2 Types
 * Based on Hydra Head protocol specifications
 */

/**
 * Hydra Head state
 */
export enum HeadState {
  IDLE = 'IDLE',
  INITIALIZING = 'INITIALIZING',
  OPEN = 'OPEN',
  CLOSING = 'CLOSING',
  CLOSED = 'CLOSED',
  FANOUT = 'FANOUT',
  FINAL = 'FINAL'
}

/**
 * Hydra Head configuration
 */
export interface HydraHeadConfig {
  headId: string;
  participants: string[]; // Cardano verification key hashes
  contestationPeriod: number; // seconds
  network: 'testnet' | 'mainnet';
  hydraNodeUrl: string;
  hydraNodeApiKey?: string;
}

/**
 * Hydra Head information
 */
export interface HydraHead {
  headId: string;
  state: HeadState;
  participants: string[];
  utxo: Map<string, UTxO>;
  contestationDeadline?: Date;
  createdAt: Date;
  snapshotNumber: number;
}

/**
 * UTxO (Unspent Transaction Output)
 */
export interface UTxO {
  txId: string;
  outputIndex: number;
  address: string;
  value: bigint;
  datum?: string;
  datumHash?: string;
  scriptRef?: string;
}

/**
 * Hydra transaction
 */
export interface HydraTransaction {
  txId: string;
  inputs: UTxO[];
  outputs: UTxO[];
  fee: bigint;
  validityRange?: {
    notBefore?: number;
    notAfter?: number;
  };
  metadata?: Record<string, any>;
  witnesses: string[];
}

/**
 * Hydra snapshot
 */
export interface HydraSnapshot {
  snapshotNumber: number;
  utxo: Map<string, UTxO>;
  confirmedTransactions: string[];
  timestamp: Date;
  signatures: Map<string, string>; // participant -> signature
}

/**
 * Agent coordination message
 */
export interface CoordinationMessage {
  type: CoordinationMessageType;
  from: string; // Agent DID
  to?: string[]; // Target agent DIDs
  taskId?: string;
  subtaskId?: string;
  payload: any;
  timestamp: Date;
  signature?: string;
}

/**
 * Coordination message types
 */
export enum CoordinationMessageType {
  TASK_ASSIGNMENT = 'TASK_ASSIGNMENT',
  RESULT_SUBMISSION = 'RESULT_SUBMISSION',
  VOTING_REQUEST = 'VOTING_REQUEST',
  VOTE_CAST = 'VOTE_CAST',
  CONSENSUS_REACHED = 'CONSENSUS_REACHED',
  ERROR_DETECTED = 'ERROR_DETECTED',
  PAYMENT_INITIATED = 'PAYMENT_INITIATED',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED'
}

/**
 * Hydra Head lifecycle event
 */
export interface HeadLifecycleEvent {
  headId: string;
  eventType: HeadEventType;
  timestamp: Date;
  data?: any;
}

/**
 * Head event types
 */
export enum HeadEventType {
  HEAD_INITIALIZED = 'HEAD_INITIALIZED',
  HEAD_OPENED = 'HEAD_OPENED',
  HEAD_CLOSED = 'HEAD_CLOSED',
  HEAD_FINALIZED = 'HEAD_FINALIZED',
  SNAPSHOT_CONFIRMED = 'SNAPSHOT_CONFIRMED',
  TRANSACTION_SUBMITTED = 'TRANSACTION_SUBMITTED',
  TRANSACTION_CONFIRMED = 'TRANSACTION_CONFIRMED',
  PARTICIPANT_JOINED = 'PARTICIPANT_JOINED',
  PARTICIPANT_LEFT = 'PARTICIPANT_LEFT'
}

/**
 * Transaction routing strategy
 */
export enum RoutingStrategy {
  DIRECT_L1 = 'DIRECT_L1', // Submit directly to L1
  HYDRA_FAST = 'HYDRA_FAST', // Fast L2 execution
  HYBRID = 'HYBRID' // L2 execution with L1 settlement
}

/**
 * Transaction router configuration
 */
export interface TransactionRouterConfig {
  defaultStrategy: RoutingStrategy;
  hydraThreshold: bigint; // Use Hydra for txs above this value
  l1Fallback: boolean; // Fall back to L1 if Hydra fails
  maxRetries: number;
}

/**
 * Hydra Head manager configuration
 */
export interface HydraManagerConfig {
  hydraNodeUrl: string;
  hydraNodeApiKey?: string;
  network: 'testnet' | 'mainnet';
  autoReconnect: boolean;
  reconnectDelay: number; // milliseconds
  heartbeatInterval: number; // milliseconds
  maxHeads: number;
}

/**
 * Head participant
 */
export interface HeadParticipant {
  verificationKey: string;
  verificationKeyHash: string;
  agentDID?: string;
  isActive: boolean;
  joinedAt: Date;
}

/**
 * Head statistics
 */
export interface HeadStatistics {
  headId: string;
  totalTransactions: number;
  totalValue: bigint;
  averageTxTime: number; // milliseconds
  currentSnapshot: number;
  participants: number;
  uptime: number; // milliseconds
  lastActivity: Date;
}

/**
 * Hydra WebSocket message
 */
export interface HydraWSMessage {
  tag: string;
  headId?: string;
  seq?: number;
  timestamp: string;
  [key: string]: any;
}

/**
 * Head initialization parameters
 */
export interface HeadInitParams {
  participants: string[];
  contestationPeriod: number;
  initialFunds?: Map<string, bigint>;
}

/**
 * Head close parameters
 */
export interface HeadCloseParams {
  headId: string;
  reason?: string;
}

/**
 * Transaction submission result
 */
export interface TxSubmissionResult {
  success: boolean;
  txId?: string;
  error?: string;
  confirmedAt?: Date;
  route: RoutingStrategy;
  executionTime: number; // milliseconds
}
