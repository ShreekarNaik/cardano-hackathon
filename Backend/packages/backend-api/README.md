# DecentralAI Backend API

RESTful API server for DecentralAI Analytics platform - orchestrating AI agents, MAKER framework, Hydra L2, and Masumi Network for on-chain analytics.

## Overview

This Express/TypeScript API provides endpoints for:
- **Analysis Management**: Start, monitor, and retrieve analysis results
- **Agent Coordination**: List and manage decentralized agents
- **Agent Company**: Interact with CEO and specialized agents
- **Metrics & Monitoring**: Real-time platform metrics
- **Hydra L2**: Manage Hydra Heads for fast coordination

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```env
# Server
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# CORS
CORS_ORIGIN=http://localhost:5173

# OpenAI
OPENAI_API_KEY=sk-...

# Masumi Network
MASUMI_REGISTRY_URL=http://localhost:8080
MASUMI_PAYMENT_URL=http://localhost:8081

# Hydra
HYDRA_NODE_URL=ws://localhost:4001

# Cardano
CARDANO_NETWORK=testnet
```

## Quick Start

```bash
# Development with hot reload
npm run dev

# Build
npm run build

# Production
npm start

# Run tests
npm test
```

Server will start on `http://localhost:3000`

## API Endpoints

### Health Check

```http
GET /health
```

Returns server health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345,
  "environment": "development"
}
```

---

### Analysis Endpoints

#### Start Analysis

```http
POST /api/analysis/start
Content-Type: application/json

{
  "description": "Analyze 1M blockchain transactions for anomalies",
  "totalSteps": 1000000,
  "useMaker": true,
  "useHydra": true
}
```

**Response (202 Accepted):**
```json
{
  "analysisId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "accepted",
  "message": "Analysis task created successfully",
  "estimatedDuration": 10000
}
```

#### Get Analysis Status

```http
GET /api/analysis/:id/status
```

**Response:**
```json
{
  "analysisId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "running",
  "progress": 45,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Values:**
- `initializing`: Task is being set up
- `running`: Analysis in progress
- `completed`: Analysis finished successfully
- `failed`: Analysis encountered an error
- `cancelled`: Analysis was cancelled by user

#### Get Analysis Results

```http
GET /api/analysis/:id/results
```

**Response:**
```json
{
  "analysisId": "550e8400-e29b-41d4-a716-446655440000",
  "result": {
    "anomalies": 127,
    "patterns": ["unusual_volume", "suspicious_timing"],
    "confidence": 0.94
  },
  "metadata": {
    "description": "Analyze blockchain...",
    "totalSteps": 1000000,
    "usedMaker": true,
    "usedHydra": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "completedAt": "2024-01-01T00:05:00.000Z"
  }
}
```

#### List Analyses

```http
GET /api/analysis/list?status=completed&limit=50&offset=0
```

**Response:**
```json
{
  "analyses": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "description": "Analyze blockchain...",
      "status": "completed",
      "progress": 100,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

#### Delete Analysis

```http
DELETE /api/analysis/:id
```

---

### Agent Endpoints

#### List Agents

```http
GET /api/agents/list?agentType=WORKER&minReputation=700
```

**Response:**
```json
{
  "agents": [
    {
      "agentId": "agent-001",
      "did": "did:masumi:agent:001",
      "type": "WORKER",
      "reputation": 850,
      "isActive": true
    }
  ]
}
```

#### Get Agent Details

```http
GET /api/agents/:id
```

---

### Agent Company Endpoints

#### Chat with CEO

```http
POST /api/agent-company/chat
Content-Type: application/json

{
  "message": "Analyze recent DeFi trends on Cardano",
  "context": {}
}
```

**Response:**
```json
{
  "response": "I'll coordinate with Research and Analytics agents...",
  "taskId": "task-001",
  "assignedAgents": ["research-001", "analytics-001"]
}
```

#### Get Company Status

```http
GET /api/agent-company/status
```

**Response:**
```json
{
  "status": "active",
  "agents": {
    "ceo": { "status": "active", "tasksHandled": 42 },
    "research": { "status": "active", "tasksHandled": 128 },
    "coder": { "status": "active", "tasksHandled": 95 },
    "analytics": { "status": "active", "tasksHandled": 156 },
    "quality": { "status": "active", "tasksHandled": 73 },
    "operations": { "status": "active", "tasksHandled": 201 }
  }
}
```

#### Get Company Metrics

```http
GET /api/agent-company/metrics
```

---

### Metrics Endpoints

#### Get Dashboard Metrics

```http
GET /api/metrics/dashboard
```

**Response:**
```json
{
  "analyses": {
    "total": 1247,
    "running": 12,
    "completed": 1198,
    "failed": 37
  },
  "agents": {
    "total": 1523,
    "active": 856,
    "avgReputation": 782
  },
  "hydra": {
    "activeHeads": 8,
    "totalTransactions": 456789,
    "avgTxTime": 0.8
  },
  "maker": {
    "tasksDecomposed": 342,
    "subtasksCompleted": 68400,
    "avgConsensus": 0.87
  }
}
```

---

### Hydra L2 Endpoints

#### List Hydra Heads

```http
GET /api/hydra/heads
```

**Response:**
```json
{
  "heads": [
    {
      "headId": "head-001",
      "state": "OPEN",
      "participants": 5,
      "snapshotNumber": 1247,
      "uptime": 3600000
    }
  ]
}
```

#### Get Head Details

```http
GET /api/hydra/heads/:id
```

---

## Architecture

### Request Flow

```
Client Request
    ↓
Express Middleware (CORS, Helmet, Rate Limit)
    ↓
Route Handler
    ↓
┌─────────────────────────────────────┐
│  Integration with Core Components  │
├─────────────────────────────────────┤
│  • Agent Company (CEO)              │
│  • MAKER (Task Decomposition)       │
│  • Masumi (Agent Discovery)         │
│  • Hydra (Fast Coordination)        │
└─────────────────────────────────────┘
    ↓
Response (JSON)
```

### Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: express-validator
- **Error Handling**: Centralized error middleware
- **Logging**: Winston with file rotation

### Middleware Stack

1. Helmet (security headers)
2. CORS (cross-origin)
3. Rate limiter
4. Body parser (JSON/URL-encoded)
5. Request logger
6. Route handlers
7. 404 handler
8. Error handler

## Integration Examples

### With MAKER Framework

```typescript
import { TaskDecomposer, VotingManager } from '@decentralai/maker-orchestration';

// In route handler
const decomposer = new TaskDecomposer(process.env.OPENAI_API_KEY);
const config = createDecompositionConfig(totalSteps, 200);
const task = await decomposer.decompose(description, config);
```

### With Agent Company

```typescript
import { CEOAgent } from '@decentralai/agent-company';

const ceo = new CEOAgent({
  openaiKey: process.env.OPENAI_API_KEY,
  masumiConfig: { /* ... */ }
});

const result = await ceo.delegateTask({
  description: 'Analyze DeFi trends',
  useMaker: true
});
```

### With Hydra L2

```typescript
import { createHydraManager } from '@decentralai/hydra-layer2';

const hydra = createHydraManager({
  hydraNodeUrl: process.env.HYDRA_NODE_URL
});

await hydra.connect();
const head = await hydra.initHead({ participants, contestationPeriod: 60 });
```

## Error Handling

All errors return consistent JSON format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

**HTTP Status Codes:**
- `200`: Success
- `202`: Accepted (async operation)
- `400`: Bad Request (validation error)
- `404`: Not Found
- `500`: Internal Server Error

## Logging

Logs are written to:
- Console (colored, development)
- `logs/combined.log` (all logs)
- `logs/error.log` (errors only)

**Log Levels:**
- `error`: Error conditions
- `warn`: Warning conditions
- `info`: Informational messages (default)
- `debug`: Debug-level messages

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

## Development

```bash
# Install dependencies
npm install

# Run in dev mode (hot reload)
npm run dev

# Lint
npm run lint

# Build
npm run build

# Start production server
npm start
```

## Performance

### Benchmarks

- **Health check**: < 1ms
- **Analysis start**: < 50ms
- **Status check**: < 10ms
- **Results retrieval**: < 20ms

### Scalability

- Rate limit: 100 req/15min per IP
- Concurrent connections: Node.js default (~10k)
- Memory: ~100MB base + analysis storage

## Deployment

### Docker

```bash
docker build -t decentralai-api .
docker run -p 3000:3000 --env-file .env decentralai-api
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS origins
- [ ] Set up log rotation
- [ ] Configure rate limits
- [ ] Enable HTTPS
- [ ] Set up monitoring (PM2, New Relic, etc.)
- [ ] Configure database (replace in-memory storage)
- [ ] Set up load balancer

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Implementation Guide](../../Implementation.md)
- [Architecture Graph](../../decentralai_analytics_hierarchical_graph.json.md)

## License

MIT
