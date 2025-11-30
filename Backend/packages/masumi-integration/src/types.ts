/**
 * Masumi Network Types
 * Based on Masumi protocol specifications
 */

/**
 * Agent Type enum matching Cardano contract
 */
export enum AgentType {
  CEO = 'CEO',
  RESEARCH = 'RESEARCH',
  CODER = 'CODER',
  ANALYTICS = 'ANALYTICS',
  QUALITY = 'QUALITY',
  OPERATIONS = 'OPERATIONS',
  WORKER = 'WORKER'
}

/**
 * Agent identity using Decentralized Identifier (DID)
 */
export interface AgentDID {
  did: string; // e.g., "did:masumi:agent:abc123"
  publicKey: string;
  verificationMethod: string;
  created: Date;
}

/**
 * Agent registration data
 */
export interface AgentRegistration {
  agentId: string;
  agentType: AgentType;
  name: string;
  description?: string;
  capabilities: string[];
  endpoint?: string;
  publicKey: string;
  did?: string;
}

/**
 * Agent profile in Masumi registry
 */
export interface AgentProfile {
  agentId: string;
  agentType: AgentType;
  name: string;
  description?: string;
  did: string;
  publicKey: string;
  reputation: number; // 0-1000
  tasksCompleted: number;
  successfulVerifications: number;
  failedVerifications: number;
  registeredAt: Date;
  lastActive: Date;
  isActive: boolean;
  capabilities: string[];
  endpoint?: string;
  metadata?: Record<string, any>;
}

/**
 * Payment channel state
 */
export interface PaymentChannel {
  channelId: string;
  payer: string;
  payee: string;
  balance: bigint;
  deposited: bigint;
  withdrawn: bigint;
  nonce: number;
  expiresAt: Date;
  state: 'OPEN' | 'CLOSING' | 'CLOSED';
}

/**
 * Payment request
 */
export interface PaymentRequest {
  from: string; // Agent DID
  to: string; // Agent DID
  amount: bigint; // in lovelace
  purpose: string;
  metadata?: Record<string, any>;
}

/**
 * Payment receipt
 */
export interface PaymentReceipt {
  transactionId: string;
  from: string;
  to: string;
  amount: bigint;
  timestamp: Date;
  confirmed: boolean;
}

/**
 * Service discovery query
 */
export interface ServiceQuery {
  agentType?: AgentType;
  capabilities?: string[];
  minReputation?: number;
  maxResults?: number;
  onlyActive?: boolean;
}

/**
 * Task assignment
 */
export interface TaskAssignment {
  taskId: string;
  assignedTo: string; // Agent DID
  assignedBy: string; // Agent DID
  description: string;
  deadline?: Date;
  payment?: bigint;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Masumi network configuration
 */
export interface MasumiConfig {
  registryUrl: string;
  paymentUrl: string;
  network: 'testnet' | 'mainnet';
  registryPolicyId?: string;
  paymentContractAddress?: string;
}

/**
 * Registry response wrapper
 */
export interface RegistryResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

/**
 * Agent capability definition
 */
export interface AgentCapability {
  name: string;
  description: string;
  version: string;
  parameters?: Record<string, any>;
}

/**
 * Agent reputation update
 */
export interface ReputationUpdate {
  agentId: string;
  newReputation: number;
  reason: string;
  updatedBy: string; // Quality Agent DID
  timestamp: Date;
}
