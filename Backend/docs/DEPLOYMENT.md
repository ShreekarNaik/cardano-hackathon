# Production Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Cardano node (for L1 interactions)
- Hydra node (for L2 scaling)
- Python 3.10+
- Node.js 18+
- pnpm

## Quick Start

```bash
# 1. Clone repository
git clone <repository-url>
cd decentralai-analytics

# 2. Install dependencies
pnpm install
cd packages/agent-company && pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your API keys and configuration

# 4. Start services
docker-compose up -d

# 5. Deploy smart contracts to testnet
cd packages/cardano-contracts
aiken build
./scripts/deploy-testnet.sh

# 6. Start application
pnpm dev
```

## Environment Variables

```bash
# API Keys
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here

# Cardano Configuration
CARDANO_NETWORK=preprod
CARDANO_NODE_SOCKET=/path/to/node.socket

# Hydra Configuration
HYDRA_NODE_URL=http://localhost:4001

# Masumi Configuration
MASUMI_API_URL=https://masumi.network/api
MASUMI_API_KEY=your_key_here

# Backend Configuration
PORT=3000
NODE_ENV=production
```

## Docker Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Testnet Deployment

### Deploy Smart Contracts

```bash
cd packages/cardano-contracts

# Build contracts
aiken build

# Deploy to preprod testnet
cardano-cli transaction build \
  --tx-in $(cardano-cli query utxo --address $(cat payment.addr) --testnet-magic 1 | tail -1 | awk '{print $1"#"$2}') \
  --tx-out $(cat script.addr)+10000000 \
  --tx-out-datum-hash-file datum.json \
  --change-address $(cat payment.addr) \
  --testnet-magic 1 \
  --out-file tx.raw

cardano-cli transaction sign \
  --tx-body-file tx.raw \
  --signing-key-file payment.skey \
  --testnet-magic 1 \
  --out-file tx.signed

cardano-cli transaction submit \
  --tx-file tx.signed \
  --testnet-magic 1
```

## Monitoring

### Health Checks

```bash
# Backend API
curl http://localhost:3000/health

# Agent Company
curl http://localhost:8000/api/status

# Hydra Layer 2
curl http://localhost:4001/snapshot/utxo
```

### Metrics

Access Prometheus metrics at:
- Backend: `http://localhost:3000/metrics`
- Agent Company: `http://localhost:8000/metrics`

## Security

### Production Checklist

- [ ] All API keys in environment variables (not code)
- [ ] HTTPS enabled for all endpoints
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] CORS properly configured
- [ ] Database credentials secured
- [ ] Smart contracts audited
- [ ] Backup strategy in place

## Troubleshooting

### Common Issues

**Issue**: Agent Company not responding
**Solution**: Check Python dependencies and API keys

**Issue**: Hydra transactions failing
**Solution**: Ensure Hydra node is running and head is open

**Issue**: Smart contract deployment fails
**Solution**: Verify Cardano node sync and wallet funds

## Support

For issues and questions:
- GitHub Issues: <repository-url>/issues
- Documentation: <docs-url>
- Community: <discord-url>
