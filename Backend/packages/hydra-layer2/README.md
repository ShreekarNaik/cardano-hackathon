# Hydra Layer 2 Integration

TypeScript integration for Hydra Head protocol - enabling sub-second finality and 1000x cost reduction for agent coordination on Cardano.

## Overview

Hydra is Cardano's Layer 2 scaling solution using state channels. This package provides:
- **HydraHeadManager**: Manage Hydra Head lifecycle
- **Fast Transactions**: Sub-second finality vs 20+ seconds on L1
- **Cost Savings**: ~1000x cheaper than L1 transactions
- **Agent Coordination**: Perfect for multi-agent task coordination

## Installation

```bash
npm install @decentralai/hydra-layer2
```

## Quick Start

```typescript
import { createHydraManager, HeadEventType } from '@decentralai/hydra-layer2';

// Initialize manager
const hydra = createHydraManager({
  hydraNodeUrl: 'ws://localhost:4001',
  network: 'testnet',
  maxHeads: 10
});

// Connect to Hydra node
await hydra.connect();

// Initialize a Head with participants
const head = await hydra.initHead({
  participants: [
    'vkey1abc...', // Agent 1
    'vkey2def...', // Agent 2
    'vkey3ghi...'  // Agent 3
  ],
  contestationPeriod: 60 // seconds
});

console.log(`Head ${head.headId} initialized`);

// Listen for Head events
hydra.on(HeadEventType.HEAD_OPENED, (event) => {
  console.log(`Head ${event.headId} is now OPEN`);
  console.log('Can now submit transactions!');
});

hydra.on(HeadEventType.TRANSACTION_CONFIRMED, (event) => {
  console.log('Transaction confirmed:', event.data);
});
```

## Core Features

### 1. Head Lifecycle Management

```typescript
import { HeadState } from '@decentralai/hydra-layer2';

// Initialize Head
const head = await hydra.initHead({
  participants: ['vkey1...', 'vkey2...'],
  contestationPeriod: 60
});

// Wait for Head to open
while (head.state !== HeadState.OPEN) {
  await new Promise(resolve => setTimeout(resolve, 1000));
}

// Use Head for fast transactions
// ...

// Close Head when done
await hydra.closeHead({
  headId: head.headId,
  reason: 'Task completed'
});
```

### 2. Event Monitoring

```typescript
import { HeadEventType } from '@decentralai/hydra-layer2';

// Subscribe to all events
hydra.on(HeadEventType.HEAD_INITIALIZED, (event) => {
  console.log('Head initialized:', event.headId);
});

hydra.on(HeadEventType.SNAPSHOT_CONFIRMED, (event) => {
  console.log('Snapshot confirmed:', event.data);
});

hydra.on(HeadEventType.HEAD_CLOSED, (event) => {
  console.log('Head closed:', event.headId);
});

// Unsubscribe
const listener = (event) => console.log(event);
hydra.on(HeadEventType.HEAD_OPENED, listener);
hydra.off(HeadEventType.HEAD_OPENED, listener);
```

### 3. Head Statistics

```typescript
const stats = hydra.getHeadStatistics(headId);

if (stats) {
  console.log(`Transactions: ${stats.totalTransactions}`);
  console.log(`Total Value: ${stats.totalValue}`);
  console.log(`Avg TX Time: ${stats.averageTxTime}ms`);
  console.log(`Snapshot: ${stats.currentSnapshot}`);
  console.log(`Participants: ${stats.participants}`);
  console.log(`Uptime: ${stats.uptime}ms`);
}
```

### 4. Connection Management

```typescript
// Check connection
if (hydra.isReady()) {
  console.log('✓ Connected to Hydra node');
}

// Get status
const status = hydra.getConnectionStatus();
console.log(`Connected: ${status.connected}`);
console.log(`Active Heads: ${status.activeHeads}`);
console.log(`Total Heads: ${status.totalHeads}`);

// Disconnect
await hydra.disconnect();
```

## Integration with MAKER & Masumi

### Agent Coordination in Hydra

```typescript
import { createHydraManager } from '@decentralai/hydra-layer2';
import { createMasumiClients } from '@decentralai/masumi-integration';
import { TaskDecomposer } from '@decentralai/maker-orchestration';

// Setup
const hydra = createHydraManager();
const masumi = createMasumiClients(masumiConfig);
const decomposer = new TaskDecomposer(openaiKey);

// 1. Decompose task
const task = await decomposer.decompose(description, config);

// 2. Discover agents
const agents = await masumi.registry.discoverAgents({
  agentType: AgentType.WORKER,
  minReputation: 700,
  onlyActive: true
});

// 3. Initialize Hydra Head for fast coordination
const head = await hydra.initHead({
  participants: agents.slice(0, 5).map(a => a.publicKey),
  contestationPeriod: 120
});

// 4. Assign subtasks & coordinate via Hydra
// Sub-second task assignment and result collection
// ...

// 5. Close Head when done
await hydra.closeHead({ headId: head.headId });
```

### Payment Coordination

```typescript
// Fast payments through Hydra
hydra.on(HeadEventType.HEAD_OPENED, async (event) => {
  // Head is open, can now make instant payments
  
  for (const agent of assignedAgents) {
    // Submit payment transaction to Hydra
    // Instant confirmation, no waiting for L1 blocks
    await submitPaymentInHydra(event.headId, agent, amount);
  }
});
```

## Cost Savings

### Calculate Savings

```typescript
import { calculateCostSavings } from '@decentralai/hydra-layer2';

const l1Fee = BigInt(200000); // 0.2 ADA typical L1 fee
const hydraFee = BigInt(0); // Free inside Hydra

const savings = calculateCostSavings(l1Fee, hydraFee);

console.log(`Savings: ${savings.savingsAmount} lovelace`);
console.log(`Percent: ${savings.savingsPercent}%`); // ~100%
```

### Capacity Planning

```typescript
import { estimateHeadCapacity } from '@decentralai/hydra-layer2';

const capacity = estimateHeadCapacity(5); // 5 participants

console.log(`Max TPS: ${capacity.maxTxPerSecond}`);
console.log(`Max TX/min: ${capacity.maxTxPerMinute}`);
console.log(`Max TX/hour: ${capacity.maxTxPerHour}`);

// Example output:
// Max TPS: 1000
// Max TX/min: 60,000
// Max TX/hour: 3,600,000
```

## Configuration

### Manager Config

```typescript
interface HydraManagerConfig {
  hydraNodeUrl: string;         // WebSocket URL
  hydraNodeApiKey?: string;     // Optional API key
  network: 'testnet' | 'mainnet';
  autoReconnect: boolean;       // Auto-reconnect on disconnect
  reconnectDelay: number;       // Delay before reconnect (ms)
  heartbeatInterval: number;    // Heartbeat interval (ms)
  maxHeads: number;             // Max concurrent Heads
}
```

### Example Configurations

**Development:**
```typescript
const config = {
  hydraNodeUrl: 'ws://localhost:4001',
  network: 'testnet',
  autoReconnect: true,
  reconnectDelay: 5000,
  heartbeatInterval: 30000,
  maxHeads: 5
};
```

**Production:**
```typescript
const config = {
  hydraNodeUrl: process.env.HYDRA_NODE_URL,
  hydraNodeApiKey: process.env.HYDRA_API_KEY,
  network: 'mainnet',
  autoReconnect: true,
  reconnectDelay: 10000,
  heartbeatInterval: 60000,
  maxHeads: 20
};
```

## Head States

```typescript
enum HeadState {
  IDLE = 'IDLE',                     // Not yet initialized
  INITIALIZING = 'INITIALIZING',     // Initialization in progress
  OPEN = 'OPEN',                     // Head is open, can transact
  CLOSING = 'CLOSING',               // Close initiated
  CLOSED = 'CLOSED',                 // Head closed
  FANOUT = 'FANOUT',                 // Final UTxO distribution
  FINAL = 'FINAL'                    // Fully settled on L1
}
```

## Event Types

```typescript
enum HeadEventType {
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
```

## Advanced Usage

### Multi-Head Management

```typescript
// Manage multiple Heads for different tasks
const heads = new Map();

// Task 1 - Analytics agents
heads.set('analytics', await hydra.initHead({
  participants: analyticsAgents,
  contestationPeriod: 60
}));

// Task 2 - Research agents
heads.set('research', await hydra.initHead({
  participants: researchAgents,
  contestationPeriod: 60
}));

// Get all active Heads
const activeHeads = hydra.getActiveHeads();
console.log(`Active Heads: ${activeHeads.length}`);
```

### Error Handling

```typescript
try {
  const head = await hydra.initHead(params);
} catch (error) {
  if (error.message.includes('Maximum heads limit')) {
    // Close an old Head first
    const oldHead = hydra.listHeads()[0];
    await hydra.closeHead({ headId: oldHead.headId });
    
    // Retry
    const head = await hydra.initHead(params);
  }
}
```

## Performance Characteristics

| Metric | Layer 1 | Hydra Layer 2 |
|--------|---------|---------------|
| **Finality** | 20+ seconds | < 1 second |
| **TPS** | ~10 | ~1000 |
| **Cost per TX** | 0.17 ADA | ~0 ADA |
| **Scalability** | Limited | High |

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

## Architecture

Hydra Heads work by:
1. **Initialization**: Participants lock funds on L1
2. **Operation**: Fast transactions off-chain
3. **Snapshots**: Periodic state confirmations
4. **Closure**: Final state settled back to L1

Benefits for DecentralAI:
- **Agent Coordination**: Instant task assignments
- **Voting**: Real-time multi-agent voting
- **Payments**: Instant micro-payments
- **Scalability**: 1000+ agents coordinating

## Resources

- [Hydra Documentation](https://hydra.family/head-protocol/)
- [Cardano Hydra GitHub](https://github.com/input-output-hk/hydra)
- [Implementation Guide](../../Implementation.md)
- [Architecture Graph](../../decentralai_analytics_hierarchical_graph.json.md)

## License

MIT
