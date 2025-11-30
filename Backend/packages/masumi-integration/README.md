# Masumi Network Integration

TypeScript integration library for Masumi Network - enabling decentralized AI agent infrastructure on Cardano.

## Overview

This package provides TypeScript clients for interacting with the Masumi Network:
- **Registry Client**: Agent registration, discovery, and reputation management
- **Payment Client**: Payment channels and transactions between agents

## Installation

```bash
npm install @decentralai/masumi-integration
```

## Quick Start

```typescript
import { createMasumiClients, DEFAULT_TESTNET_CONFIG, AgentType } from '@decentralai/masumi-integration';

// Initialize clients
const { registry, payment } = createMasumiClients(DEFAULT_TESTNET_CONFIG);

// Register an agent
const registration = await registry.registerAgent({
  agentId: 'agent-123',
  agentType: AgentType.ANALYTICS,
  name: 'Analytics Agent',
  capabilities: ['data-analysis', 'visualization'],
  publicKey: '0x...',
});

// Discover agents
const agents = await registry.discoverAgents({
  agentType: AgentType.WORKER,
  minReputation: 700,
  onlyActive: true
});

// Open payment channel
const channel = await payment.openChannel(
  'did:masumi:payer:abc',
  'did:masumi:payee:xyz',
  BigInt(1000000), // 1 ADA in lovelace
  30 // expires in 30 days
);

// Make payment
const receipt = await payment.makePayment({
  from: 'did:masumi:payer:abc',
  to: 'did:masumi:payee:xyz',
  amount: BigInt(100000), // 0.1 ADA
  purpose: 'task-completion'
});
```

## Configuration

### Testnet

```typescript
import { DEFAULT_TESTNET_CONFIG } from '@decentralai/masumi-integration';

const config = {
  ...DEFAULT_TESTNET_CONFIG,
  registryPolicyId: 'your-policy-id',
  paymentContractAddress: 'your-contract-address'
};
```

### Mainnet

```typescript
import { DEFAULT_MAINNET_CONFIG } from '@decentralai/masumi-integration';

const config = {
  ...DEFAULT_MAINNET_CONFIG,
  registryPolicyId: 'your-policy-id',
  paymentContractAddress: 'your-contract-address'
};
```

### Environment Variables

```bash
MASUMI_REGISTRY_URL=http://localhost:8001
MASUMI_PAYMENT_URL=http://localhost:8002
MASUMI_NETWORK=testnet
MASUMI_REGISTRY_POLICY_ID=e6c57104dfa95943ffab95eafe1f12ed9a8da791678bfbf765b05649
MASUMI_PAYMENT_CONTRACT=addr_test1wp7je4555s7cdqvlcgdnkj34rrpryy8wsst9yvz7e74p2ugy69qgn
```

## API Reference

### Registry Client

#### `registerAgent(registration: AgentRegistration)`
Register a new agent in the network.

#### `getAgent(agentId: string)`
Get agent profile by ID.

#### `getAgentByDID(did: string)`
Get agent profile by Decentralized Identifier.

#### `discoverAgents(query: ServiceQuery)`
Discover agents based on criteria (type, capabilities, reputation).

#### `updateReputation(update: ReputationUpdate)`
Update agent reputation (Quality Agent only).

#### `updateActivity(agentId: string)`
Update agent's last active timestamp.

#### `suspendAgent(agentId: string, reason: string, authority: string)`
Suspend an agent (governance/Quality Agent).

#### `reactivateAgent(agentId: string)`
Reactivate a suspended agent.

#### `listAgentsByType(agentType: AgentType, onlyActive?: boolean)`
List all agents of a specific type.

#### `getAgentsByCapability(capability: string, minReputation?: number)`
Find agents with a specific capability.

#### `getTopAgents(limit?: number, agentType?: AgentType)`
Get top agents by reputation.

### Payment Client

#### `openChannel(payer: string, payee: string, initialDeposit: bigint, expirationDays?: number)`
Open a new payment channel.

#### `getChannel(channelId: string)`
Get payment channel details.

#### `getAgentChannels(agentDID: string)`
Get all channels for an agent.

#### `makePayment(request: PaymentRequest)`
Make a payment through an existing channel.

#### `depositToChannel(channelId: string, amount: bigint)`
Deposit additional funds.

#### `withdrawFromChannel(channelId: string, amount: bigint)`
Withdraw funds from channel.

#### `closeChannel(channelId: string)`
Close a payment channel.

#### `getPaymentHistory(agentDID: string, limit?: number)`
Get payment history for an agent.

#### `getPayment(transactionId: string)`
Get payment details by transaction ID.

#### `getTotalBalance(agentDID: string)`
Calculate total balance across all channels.

## Types

### AgentType
```typescript
enum AgentType {
  CEO = 'CEO',
  RESEARCH = 'RESEARCH',
  CODER = 'CODER',
  ANALYTICS = 'ANALYTICS',
  QUALITY = 'QUALITY',
  OPERATIONS = 'OPERATIONS',
  WORKER = 'WORKER'
}
```

### AgentProfile
```typescript
interface AgentProfile {
  agentId: string;
  agentType: AgentType;
  name: string;
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
```

### PaymentChannel
```typescript
interface PaymentChannel {
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
```

## Integration with DecentralAI Analytics

This package is designed to work seamlessly with other DecentralAI components:

```typescript
import { CEOAgent } from '@decentralai/agent-company';
import { createMasumiClients } from '@decentralai/masumi-integration';

// Initialize CEO Agent with Masumi integration
const masumi = createMasumiClients(DEFAULT_TESTNET_CONFIG);
const ceo = new CEOAgent({ masumi });

// Agents can now register and interact via Masumi
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Watch mode
npm run dev
```

## Testing

```bash
# Unit tests
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Architecture

This package follows the Masumi Network protocol specifications and integrates with:
- Cardano Layer 1 (agent registry contracts)
- Hydra Layer 2 (fast payments)
- DecentralAI Agent Company (agent orchestration)

## Resources

- [Masumi Network GitHub](https://github.com/masumi-network)
- [Implementation Guide](../../Implementation.md)
- [Architecture Graph](../../decentralai_analytics_hierarchical_graph.json.md)

## License

MIT
