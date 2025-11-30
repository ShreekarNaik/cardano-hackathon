# DS-STAR Analytics

Autonomous data science agent with self-correction capabilities. DS-STAR uses a Planner → Coder → Verifier loop to perform analysis tasks with automatic error detection and correction.

## Overview

DS-STAR (Data Science Self-correcting Task-driven Agent for Research) implements:
- **Planner Agent**: Creates structured analysis plans
- **Coder Agent**: Generates executable analysis code
- **Verifier Agent**: Validates code quality and correctness
- **Self-Correction**: Automatically fixes errors through iterative refinement

## Installation

```bash
npm install @decentralai/ds-star-analytics
```

## Quick Start

```typescript
import { createDSStarAgent } from '@decentralai/ds-star-analytics';

const agent = createDSStarAgent(process.env.OPENAI_API_KEY);

const result = await agent.analyze({
  query: 'Analyze blockchain transactions for anomalies',
  data: transactionData,
  maxIterations: 3
});

console.log(result.finalAnswer);
console.log(`Completed in ${result.iterations} iterations`);
```

## Architecture

### Self-Correction Loop

```
Query → Planner → Coder → Verifier → Execute
                      ↑                   ↓
                      └─── Correction ────┘
```

**Workflow:**
1. **Plan**: Create structured analysis steps
2. **Code**: Generate Python/R/SQL code
3. **Verify**: Check correctness and quality
4. **Execute**: Run in sandboxed environment
5. **Self-Correct**: Fix errors if needed (repeat)

## Features

- ✅ Autonomous planning and execution
- ✅ Multi-language support (Python, R, SQL)
- ✅ Automatic error correction (up to 3 iterations)
- ✅ Code verification before execution
- ✅ Sandboxed execution environment
- ✅ Comprehensive iteration tracking

## API Reference

### DSStarAgent

```typescript
const agent = new DSStarAgent({
  openaiApiKey: string,
  model?: string,           // Default: 'gpt-4'
  maxIterations?: number,   // Default: 3
  timeout?: number,         // Default: 300000 (5 min)
  enableSelfCorrection?: boolean // Default: true
});
```

### analyze()

```typescript
const result = await agent.analyze({
  query: string,
  data?: any,
  context?: Record<string, any>,
  maxIterations?: number
});
```

### Result Structure

```typescript
interface DSStarResult {
  query: string;
  plan: AnalysisPlan;
  code: GeneratedCode;
  verification: VerificationResult;
  execution: ExecutionResult;
  iterations: number;
  totalTime: number;
  finalAnswer: string;
}
```

## Examples

### Blockchain Anomaly Detection

```typescript
const result = await agent.analyze({
  query: 'Detect anomalies in 1M blockchain transactions',
  data: {
    transactions: transactionArray,
    network: 'cardano'
  },
  context: {
    threshold: 0.95,
    method: 'statistical'
  }
});

console.log(`Found ${result.execution.output.anomalies} anomalies`);
console.log(`Patterns: ${result.execution.output.patterns.join(', ')}`);
console.log(`Confidence: ${result.execution.output.confidence}`);
```

### Time Series Analysis

```typescript
const result = await agent.analyze({
  query: 'Analyze time series data for trends and seasonality',
  data: timeSeriesData,
  maxIterations: 2
});
```

### Correlation Analysis

```typescript
const result = await agent.analyze({
  query: 'Find correlations between on-chain metrics',
  data: metricsData,
  context: {
    variables: ['tvl', 'transactions', 'active_users'],
    method: 'pearson'
  }
});
```

## Integration with MAKER

DS-STAR can be used with MAKER for distributed analysis:

```typescript
import { TaskDecomposer } from '@decentralai/maker-orchestration';
import { DSStarAgent } from '@decentralai/ds-star-analytics';

const decomposer = new TaskDecomposer(openaiKey);
const dsstar = new DSStarAgent({ openaiApiKey: openaiKey });

// Decompose large analysis into subtasks
const task = await decomposer.decompose(
  'Analyze 1M transactions across multiple dimensions',
  config
);

// Each subtask analyzed by DS-STAR
for (const subtask of task.subtasks) {
  const result = await dsstar.analyze({
    query: subtask.description,
    data: subtask.data
  });
  // Store results
}
```

## Self-Correction Example

```typescript
const agent = createDSStarAgent(apiKey);

const result = await agent.analyze({
  query: 'Complex statistical analysis',
  maxIterations: 3
});

// Check iteration history
const iterations = agent.getIterations();

for (const iter of iterations) {
  console.log(`Iteration ${iter.iterationNumber}:`);
  console.log(`  Valid: ${iter.verification.isValid}`);
  console.log(`  Errors: ${iter.verification.errors.join(', ')}`);
  if (iter.execution) {
    console.log(`  Success: ${iter.execution.success}`);
  }
  if (iter.correctionReason) {
    console.log(`  Correction: ${iter.correctionReason}`);
  }
}
```

## Error Handling

```typescript
try {
  const result = await agent.analyze(request);
} catch (error) {
  if (error.message.includes('Analysis failed to complete')) {
    console.error('All iterations exhausted without success');
  }
}
```

## Production Considerations

### Sandboxed Execution

In production, code execution should be sandboxed:

```typescript
// Use Docker containers
// Use py-interpreter library
// Use isolated environments

const execution = await executeInDocker(code);
```

### Resource Limits

```typescript
const agent = new DSStarAgent({
  openaiApiKey: apiKey,
  timeout: 600000,        // 10 minutes
  maxIterations: 5
});
```

### Monitoring

```typescript
const result = await agent.analyze(request);

// Log metrics
console.log(`Total time: ${result.totalTime}ms`);
console.log(`Iterations: ${result.iterations}`);
console.log(`Success: ${result.execution.success}`);
```

## Performance

- **Planning**: ~2-5 seconds (LLM call)
- **Coding**: ~3-7 seconds (LLM call)
- **Verification**: ~2-4 seconds (LLM call)
- **Execution**: Variable (depends on analysis)
- **Total**: ~10-30 seconds per iteration

## Resources

- [DS-STAR Paper](https://arxiv.org/abs/2301.13808)
- [Implementation Guide](../../Implementation.md)
- [Architecture Graph](../../decentralai_analytics_hierarchical_graph.json.md)

## License

MIT
