/**
 * Masumi Network Integration
 * Main export file for DecentralAI Analytics
 */

// Types
export * from './types';

// Clients
export { RegistryClient } from './RegistryClient';
export { PaymentClient } from './PaymentClient';

// Re-export for convenience
export {
  AgentType,
  type AgentDID,
  type AgentRegistration,
  type AgentProfile,
  type PaymentChannel,
  type PaymentRequest,
  type PaymentReceipt,
  type ServiceQuery,
  type TaskAssignment,
  type MasumiConfig,
  type RegistryResponse,
  type AgentCapability,
  type ReputationUpdate
} from './types';

/**
 * Factory function to create Masumi clients
 */
export function createMasumiClients(config: MasumiConfig) {
  return {
    registry: new RegistryClient(config),
    payment: new PaymentClient(config)
  };
}

/**
 * Default configuration for testnet
 */
export const DEFAULT_TESTNET_CONFIG: MasumiConfig = {
  registryUrl: process.env.MASUMI_REGISTRY_URL || 'http://localhost:8001',
  paymentUrl: process.env.MASUMI_PAYMENT_URL || 'http://localhost:8002',
  network: 'testnet',
  registryPolicyId: process.env.MASUMI_REGISTRY_POLICY_ID,
  paymentContractAddress: process.env.MASUMI_PAYMENT_CONTRACT
};

/**
 * Default configuration for mainnet
 */
export const DEFAULT_MAINNET_CONFIG: MasumiConfig = {
  registryUrl: process.env.MASUMI_REGISTRY_URL || 'https://registry.masumi.network',
  paymentUrl: process.env.MASUMI_PAYMENT_URL || 'https://payment.masumi.network',
  network: 'mainnet',
  registryPolicyId: process.env.MASUMI_REGISTRY_POLICY_ID,
  paymentContractAddress: process.env.MASUMI_PAYMENT_CONTRACT
};

import type { MasumiConfig } from './types';
import { RegistryClient } from './RegistryClient';
import { PaymentClient } from './PaymentClient';
