# MAKER Orchestration Framework

Million-Agent Knows Error Repair - A revolutionary framework for decomposing tasks with 1M+ steps into manageable subtasks with zero-error execution through multi-agent voting.

Based on research paper: [arXiv:2511.09030](https://arxiv.org/abs/2511.09030)

## Overview

MAKER enables:
- **Extreme Task Decomposition**: Break down tasks with 1M+ steps into subtasks
- **Multi-Agent Voting**: 3+ agents vote on each subtask for consensus
- **Zero-Error Execution**: Automatic error detection and correction
- **Reputation-Based Quality**: Agents earn/lose reputation based on voting accuracy
- **Parallel Execution**: Run multiple subtasks simultaneously

## Key Components

### 1. TaskDecomposer
Intelligently breaks down large tasks into optimal subtasks using LLM.

### 2. VotingManager
Implements weighted voting with reputation and confidence scoring.

## Installation

```bash
npm install @decentralai/maker-orchestration
```

## Quick Start

```typescript
import {
  TaskDecomposer,
  VotingManager,
  createDecompositionConfig,
  calculateRecommendedSubtasks
} from '@decentralai/maker-orchestration';

// Initialize components
const decomposer = new TaskDecomposer(process.env.OPENAI_API_KEY);
const votingManager = new VotingManager(3, 0.6); // 3 voters, 60% consensus

// Define task
const taskDescription = 'Analyze blockchain data for anomalies across 1M transactions';
const totalSteps = 1000000;

// Create configuration
const config = createDecompositionConfig(
  totalSteps,
  calculateRecommendedSubtasks(totalSteps), // ~200 subtasks
  {
    votersPerSubtask: 5,
    parallelism: 20,
    errorCorrectionEnabled: true
  }
);

// Decompose task
const decomposition = await decomposer.decompose(taskDescription, config);
const task = decomposer.createTask(taskDescription, decomposition, config);

console.log(`Task decomposed into ${task.subtasks.length} subtasks`);
console.log(`Requires ${task.subtasks.length * config.votersPerSubtask} microagents`);
```

## Task Decomposition

### Automatic Decomposition

```typescript
const decomposition = await decomposer.decompose(
  'Process financial transactions and detect fraud patterns',
  config
);

// Validate decomposition
const validation = decomposer.validateDecomposition(decomposition);
if (!validation.valid) {
  console.error('Decomposition errors:', validation.errors);
}
```

### Manual Subtask Creation

```typescript
import { SubtaskStatus } from '@decentralai/maker-orchestration';

const subtasks = [
  {
    id: 'subtask-1',
    taskId: 'task-001',
    index: 0,
    startStep: 0,
    endStep: 999,
    description: 'Process transactions 0-999',
    dependencies: [],
    status: SubtaskStatus.PENDING,
    assignedAgents: [],
    results: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
  // ... more subtasks
];
```

## Multi-Agent Voting

### Conducting Votes

```typescript
import { SubtaskResult } from '@decentralai/maker-orchestration';

// Collect results from multiple agents
const results: SubtaskResult[] = [
  {
    agentId: 'agent-1',
    agentDID: 'did:masumi:agent:001',
    result: { anomalies: 5, confidence: 0.92 },
    confidence: 0.92,
    executionTime: 1500,
    timestamp: new Date()
  },
  {
    agentId: 'agent-2',
    agentDID: 'did:masumi:agent:002',
    result: { anomalies: 5, confidence: 0.88 },
    confidence: 0.88,
    executionTime: 1600,
    timestamp: new Date()
  },
  {
    agentId: 'agent-3',
    agentDID: 'did:masumi:agent:003',
    result: { anomalies: 6, confidence: 0.75 },
    confidence: 0.75,
    executionTime: 1800,
    timestamp: new Date()
  }
];

// Agent reputations (0-1000)
const reputations = new Map([
  ['did:masumi:agent:001', 850],
  ['did:masumi:agent:002', 800],
  ['did:masumi:agent:003', 750]
]);

// Conduct voting
const votingRecord = await votingManager.conductVoting(
  subtask,
  results,
  reputations
);

console.log('Majority result:', votingRecord.majorityResult);
console.log('Consensus:', votingRecord.consensusConfidence);

// Check consensus
if (votingManager.hasConsensus(votingRecord)) {
  console.log('✓ Strong consensus reached');
} else {
  console.log('⚠ Weak consensus - error correction needed');
}
```

### Error Detection

```typescript
const errorAnalysis = votingManager.detectErrors(votingRecord);

if (errorAnalysis.hasErrors) {
  console.log(`Error detected: ${errorAnalysis.errorType}`);
  console.log(`Confidence: ${errorAnalysis.confidence}`);
  
  // Trigger error correction
  // ... assign new agents, re-execute subtask
}
```

### Reputation Updates

```typescript
const reputationUpdates = votingManager.generateReputationUpdates(votingRecord);

for (const update of reputationUpdates) {
  console.log(
    `Agent ${update.agentDID}: ${update.wasInMajority ? '+' : ''}${update.reputationDelta}`
  );
  
  // Update in Masumi registry
  await masumiRegistry.updateReputation({
    agentId: update.agentId,
    newReputation: currentReputation + update.reputationDelta,
    reason: `MAKER voting - subtask ${update.subtaskId}`,
    updatedBy: 'did:masumi:quality:001',
    timestamp: new Date()
  });
}
```

## Configuration

### Decomposition Config

```typescript
interface DecompositionConfig {
  totalSteps: number;              // Total task steps (e.g., 1,000,000)
  subtasksCount: number;           // Number of subtasks (e.g., 200)
  votersPerSubtask: number;        // Minimum 3 voters per subtask
  parallelism: number;             // Max parallel subtasks
  errorCorrectionEnabled: boolean; // Enable automatic error correction
  timeoutPerSubtask: number;       // Timeout in milliseconds
  minConsensusThreshold: number;   // 0-1, minimum for acceptance
}
```

### Recommended Settings

**For small tasks (< 1,000 steps):**
```typescript
const config = createDecompositionConfig(500, 10, {
  votersPerSubtask: 3,
  parallelism: 5,
  timeoutPerSubtask: 60000 // 1 minute
});
```

**For medium tasks (1,000 - 100,000 steps):**
```typescript
const config = createDecompositionConfig(50000, 100, {
  votersPerSubtask: 5,
  parallelism: 20,
  timeoutPerSubtask: 180000 // 3 minutes
});
```

**For large tasks (100,000 - 1M+ steps):**
```typescript
const config = createDecompositionConfig(1000000, 200, {
  votersPerSubtask: 7,
  parallelism: 50,
  timeoutPerSubtask: 300000 // 5 minutes
});
```

## Utility Functions

### Calculate Recommended Subtasks

```typescript
import { calculateRecommendedSubtasks } from '@decentralai/maker-orchestration';

const subtasks = calculateRecommendedSubtasks(1000000); // Returns 200
```

### Calculate Required Agents

```typescript
import { calculateRequiredAgents } from '@decentralai/maker-orchestration';

const agents = calculateRequiredAgents(config);
console.log(`Need ${agents} microagents`); // e.g., 200 subtasks × 5 voters = 1000 agents
```

### Estimate Execution Time

```typescript
import { estimateExecutionTime } from '@decentralai/maker-orchestration';

const timing = estimateExecutionTime(config);
console.log(`Optimistic: ${timing.optimistic}ms`);
console.log(`Realistic: ${timing.realistic}ms`);
console.log(`Pessimistic: ${timing.pessimistic}ms`);
```

## Integration with DecentralAI Components

### With Masumi Network

```typescript
import { createMasumiClients } from '@decentralai/masumi-integration';
import { TaskDecomposer, VotingManager } from '@decentralai/maker-orchestration';

const masumi = createMasumiClients(masumiConfig);
const decomposer = new TaskDecomposer(openaiKey);
const votingManager = new VotingManager();

// Discover available worker agents
const workers = await masumi.registry.discoverAgents({
  agentType: AgentType.WORKER,
  minReputation: 700,
  onlyActive: true
});

// Assign subtasks to workers
// Execute and collect results
// Conduct voting
// Update reputations
```

### With Agent Company

```typescript
import { CEOAgent } from '@decentralai/agent-company';

const ceo = new CEOAgent({ masumiConfig, openaiKey });

// CEO can delegate large tasks to MAKER
const result = await ceo.delegateTask({
  description: 'Analyze 1M blockchain transactions',
  useMaker: true,
  makerConfig: config
});
```

## Advanced Features

### Dependency Management

```typescript
// Subtasks can have dependencies
const subtask = {
  // ... other fields
  dependencies: ['subtask-001', 'subtask-003'], // Must complete first
};

// Decomposer automatically identifies dependencies
const decomposition = await decomposer.decompose(description, config);
// Dependencies are in: decomposition.dependencies
```

### Voting Statistics

```typescript
const stats = votingManager.calculateStatistics(votingRecord);

console.log(`Total voters: ${stats.totalVoters}`);
console.log(`Majority size: ${stats.majoritySize}`);
console.log(`Minority size: ${stats.minoritySize}`);
console.log(`Consensus strength: ${stats.consensusStrength}`);
console.log(`Average reputation: ${stats.avgReputation}`);
console.log(`Average confidence: ${stats.avgConfidence}`);
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

## Architecture

MAKER follows a hierarchical execution model:

1. **Task Decomposition**: Large task → N subtasks
2. **Agent Assignment**: M voters per subtask (M ≥ 3)
3. **Parallel Execution**: Up to P subtasks in parallel
4. **Voting**: Weighted majority consensus
5. **Error Detection**: Low consensus triggers correction
6. **Reputation Updates**: Agents rewarded/penalized
7. **Result Aggregation**: Combine subtask results

## Resources

- [MAKER Paper (arXiv:2511.09030)](https://arxiv.org/abs/2511.09030)
- [Implementation Guide](../../Implementation.md)
- [Architecture Graph](../../decentralai_analytics_hierarchical_graph.json.md)
- [Masumi Integration](../masumi-integration/README.md)

## License

MIT
