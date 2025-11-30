/**
 * Hydra Layer 2 Integration
 * Fast state channels for agent coordination on Cardano
 */

// Types
export * from './types';

// Core components
export { HydraHeadManager } from './HydraHeadManager';

// Re-export key types
export {
  type HydraHead,
  type HydraManagerConfig,
  type HeadInitParams,
  type HeadCloseParams,
  type HydraTransaction,
  type CoordinationMessage,
  type HeadStatistics,
  HeadState,
  HeadEventType,
  CoordinationMessageType,
  RoutingStrategy
} from './types';

/**
 * Default Hydra manager configuration for testnet
 */
export const DEFAULT_HYDRA_CONFIG: HydraManagerConfig = {
  hydraNodeUrl: process.env.HYDRA_NODE_URL || 'ws://localhost:4001',
  network: 'testnet',
  autoReconnect: true,
  reconnectDelay: 5000,
  heartbeatInterval: 30000,
  maxHeads: 10
};

/**
 * Create Hydra manager with default config
 */
export function createHydraManager(
  config?: Partial<HydraManagerConfig>
): HydraHeadManager {
  return new HydraHeadManager({
    ...DEFAULT_HYDRA_CONFIG,
    ...config
  });
}

/**
 * Calculate Hydra transaction cost savings vs L1
 */
export function calculateCostSavings(l1Fee: bigint, hydraFee: bigint = BigInt(0)): {
  savingsAmount: bigint;
  savingsPercent: number;
} {
  const savings = l1Fee - hydraFee;
  const percent = Number((savings * BigInt(10000)) / l1Fee) / 100;
  
  return {
    savingsAmount: savings,
    savingsPercent: percent
  };
}

/**
 * Estimate Hydra Head capacity
 */
export function estimateHeadCapacity(
  participants: number,
  avgTxSize: number = 200 // bytes
): {
  maxTxPerSecond: number;
  maxTxPerMinute: number;
  maxTxPerHour: number;
} {
  // Hydra can handle ~1000 tx/s with minimal participants
  const baseTps = 1000;
  const participantPenalty = Math.max(1, participants / 5);
  const actualTps = Math.floor(baseTps / participantPenalty);

  return {
    maxTxPerSecond: actualTps,
    maxTxPerMinute: actualTps * 60,
    maxTxPerHour: actualTps * 3600
  };
}

import type { HydraManagerConfig } from './types';
import { HydraHeadManager } from './HydraHeadManager';
