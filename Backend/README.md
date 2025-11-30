# DecentralAI Analytics

> A groundbreaking decentralized, AI-powered on-chain data analysis platform built on Cardano

**Version**: 4.0  
**Status**: Production-Ready Architecture  
**Architecture**: [View Hierarchical Graph](./decentralai_analytics_hierarchical_graph.json.md)

## 🎯 Overview

**DecentralAI Analytics** combines cutting-edge blockchain technology with autonomous AI agent companies to deliver **transparent, auditable, large-scale analytics at zero-error reliability**.

### Core Innovation Stack

This system uniquely integrates **SIX** revolutionary technologies:

1. **🔗 Cardano Layer 1** - Secure, immutable base layer for final settlement
2. **⚡ Hydra Layer 2** - Fast, cost-efficient off-chain coordination (1000+ TPS per Head)
3. **🤖 Masumi Network** - Decentralized AI agent infrastructure with identity & payments
4. **🎯 MAKER Framework** - Million-step task decomposition with zero-error execution
5. **🧠 DS-STAR Agents** - Autonomous data science with LLM-powered planning & coding
6. **🏢 AI Agent Company** - Hierarchical agent organization with CEO orchestration

### Key Performance Metrics

| Metric | Target | Technology |
|--------|--------|-----------|
| **Analysis Steps** | 1,000,000+ | MAKER decomposition |
| **Error Rate** | 0% | Multi-agent voting + Quality Agent |
| **L2 Throughput** | ~1000 TPS per Head | Hydra protocol |
| **Execution Time** | Minutes | Parallel agent execution |
| **Cost** | ~90% reduction vs L1 | Hydra off-chain processing |
| **Agents** | 6 (Company) + 300+ (Workers) | Agent Company + Masumi |

## 📁 Project Structure

```
decentralai-analytics/
├── packages/
│   ├── agent-company/          # AI Agent Company (CEO + 5 specialists)
│   ├── cardano-contracts/      # Aiken smart contracts
│   ├── hydra-layer2/          # Hydra coordination layer
│   ├── masumi-integration/    # Agent infrastructure
│   ├── maker-orchestration/   # Task decomposition & voting
│   ├── ds-star-analytics/     # Autonomous data science
│   ├── onchain-analysis/      # Data collection & indexing
│   ├── backend-api/           # REST API
│   └── frontend/              # Web dashboard
├── scripts/                   # Deployment & utility scripts
├── docs/                      # Documentation
├── tests/                     # Integration tests
└── infrastructure/            # K8s & Terraform configs
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- Aiken CLI
- Git

### Installation

```bash
# Clone repository
git clone <repository-url>
cd decentralai-analytics

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start development environment
docker-compose up -d

# Run tests
pnpm test
```

## 🏗️ Development Setup

### 1. Start Local Infrastructure

```bash
# Start all services (Cardano node, Hydra, PostgreSQL, Ogmios, Masumi)
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 2. Run Agent Company

```bash
cd packages/agent-company
pip install -r requirements.txt
python -m pytest tests/
```

### 3. Deploy Smart Contracts (Testnet)

```bash
cd packages/cardano-contracts
aiken build
npm run deploy:testnet
```

### 4. Start Backend API

```bash
cd packages/backend-api
npm install
npm run dev
```

### 5. Start Frontend

```bash
cd packages/frontend
npm install
npm run dev
```

## 🧪 Testing

### Unit Tests

```bash
npm run test:unit
```

### Integration Tests

```bash
npm run test:integration
```

### Load Testing

```bash
# Test 1M transaction analysis
npm run test:load -- --transactions=1000000
```

## 📚 Documentation

- [Implementation Guide](./Implementation.md) - Complete implementation details
- [Architecture Graph](./decentralai_analytics_hierarchical_graph.json.md) - System architecture
- [API Documentation](./docs/API.md) - REST API reference
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment
- [Testing Guide](./docs/TESTING.md) - Testing strategies

## 🔧 Technology Stack

### Blockchain & L2
- **Cardano** (Ouroboros PoS)
- **Hydra** (v1.0+, State Channels)
- **Aiken** (Smart Contract Language)
- **MeshJS** (Cardano SDK)
- **Ogmios** (Node Interface)

### AI & Agents
- **Anthropic Claude** (Sonnet 4.5 for CEO)
- **OpenAI** (GPT-4.1 for DS-STAR)
- **MAKER Framework** (arXiv:2511.09030)
- **DS-STAR** (arXiv:2509.21825)
- **Masumi Network** (Agent Infrastructure)

### Backend & Data
- **Express** (REST API)
- **TypeScript** (Type Safety)
- **PostgreSQL** (TimescaleDB)
- **Docker** (Containerization)
- **Grafana** (Monitoring)

## 🎮 Usage Examples

### Mode 1: CEO-Orchestrated (Simple Analytics)

```python
from agent_company import CEOAgent

# Initialize CEO
ceo = CEOAgent()

# Process request
result = await ceo.process_user_request(
    "Analyze the top 100 Cardano DeFi protocols by TVL"
)

print(result)
# Timeline: 30-60 seconds
# Cost: Low
```

### Mode 2: MAKER-Powered (Complex Analytics)

```python
# CEO automatically detects high complexity
result = await ceo.process_user_request(
    "Analyze all 50 million Cardano transactions from 2024 for anomaly patterns"
)

# CEO delegates to MAKER
# - Decomposes into 500 subtasks
# - 1500 worker agents (3 per subtask)
# - Multi-agent voting
# - Zero-error verification
# Timeline: 10-20 minutes
```

## 🏢 AI Agent Company

### CEO Agent (Orchestrator)
- User interface & task delegation
- Strategic planning & decision making
- MAKER integration for complex tasks
- Result aggregation & verification

### Sub-Agents
1. **Research Agent** - Web search, data gathering, market intelligence
2. **Coder Agent** - DS-STAR integration, Docker execution, autonomous coding
3. **Analytics Agent** - Statistical analysis, visualization, reporting
4. **Quality Agent** - MAKER voting, result validation, error detection
5. **Operations Agent** - Infrastructure management, monitoring, deployment

## 📊 Current Project Status

### ✅ Completed

**Phase 0: AI Agent Company Core** (CEO Agent)
- ✅ CEO Agent implementation with LLM-powered orchestration
- ✅ Request analysis and complexity detection
- ✅ Multi-agent delegation framework
- ✅ MAKER integration hooks
- ✅ Comprehensive test suite (14 passing tests)
- 📄 [Phase 0 Completion Report](./docs/PHASE_0_COMPLETION.md)

**Phase 1: Infrastructure** (Partial)
- ✅ Monorepo structure
- ✅ Docker Compose configuration
- ✅ Environment configuration
- ✅ Root package.json with scripts

### 🚧 In Progress

**Phase 0 Continuation**: Sub-Agents
- ⏳ Research Agent
- ⏳ Coder Agent
- ⏳ Analytics Agent
- ⏳ Quality Agent
- ⏳ Operations Agent

### 📋 Upcoming

See full roadmap below for detailed phases.

## 📊 Implementation Roadmap

- **Phase 0** (Week 1): AI Agent Company Setup ✅ (CEO Complete)
- **Phase 1** (Weeks 2-3): Foundation & Infrastructure 🚧 (Partial)
- **Phase 2** (Weeks 4-5): Smart Contracts & L1
- **Phase 3** (Weeks 6-7): Masumi Integration
- **Phase 4** (Weeks 8-9): MAKER Framework
- **Phase 5** (Weeks 10-11): Hydra Layer 2
- **Phase 6** (Weeks 12-13): DS-STAR Analytics
- **Phase 7** (Weeks 14-15): On-Chain Analysis
- **Phase 8** (Weeks 16-17): Backend API
- **Phase 9** (Weeks 18-19): Frontend Dashboard
- **Phase 10** (Weeks 20-21): Testing & Deployment

## 🔗 Official Resources

- [Cardano Developer Portal](https://developers.cardano.org)
- [Hydra Documentation](https://hydra.family/head-protocol/)
- [Masumi Network](https://github.com/masumi-network)
- [Aiken Language](https://aiken-lang.org)
- [MeshJS SDK](https://meshjs.dev)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

## � Support

- **Forum**: [Cardano Forum](https://forum.cardano.org)
- **Discord**: [Hydra Discord](https://discord.gg/Qq5vNTg9PT)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

---

**Built with ❤️ by the DecentralAI Analytics Team**
