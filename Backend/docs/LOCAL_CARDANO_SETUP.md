# Local Cardano Development Environment Setup

## Quick Setup with Yaci DevKit (Recommended for Development)

**Yaci DevKit** provides a complete local Cardano blockchain that:
- ✅ Runs entirely on your machine
- ✅ Instant block times (~1 second)
- ✅ Pre-funded test wallets
- ✅ No sync required
- ✅ Perfect for rapid development

### Installation

```bash
# Install via Docker (easiest)
docker pull bloxbean/yaci-devkit:latest

# Or install via npm
npm install -g @bloxbean/yaci-cli
```

### Start Local Cardano Network

```bash
# Using Docker
docker run -p 8080:8080 -p 3001:3001 -p 9090:9090 \
  -v yaci-data:/data \
  bloxbean/yaci-devkit:latest

# Or using npm
yaci-cli start
```

This starts:
- **Cardano Node** on port 3001
- **Yaci Store API** on port 8080
- **Kupo** (indexer) on port 9090

### Pre-funded Wallets

Yaci DevKit comes with pre-funded demo wallets:

**Demo Wallet 1**:
```
Address: addr_test1vqneq3v04...
Balance: 10,000,000 ADA
```

Keys are automatically available in the DevKit.

### Access Points

- **Explorer**: http://localhost:8080
- **API**: http://localhost:8080/api/v1
- **Node Socket**: localhost:3001

### Quick Test

```bash
# Check if running
curl http://localhost:8080/api/v1/epochs/latest

# Get demo wallet balance
curl http://localhost:8080/api/v1/addresses/addr_test1vqneq3v04.../utxos
```

---

## Alternative: Cardano Private Testnet (cardano-private-testnet-setup)

For more control, use the official private testnet:

```bash
# Clone the setup
git clone https://github.com/input-output-hk/cardano-private-testnet-setup
cd cardano-private-testnet-setup

# Start with Docker Compose
docker-compose up -d
```

This gives you:
- Full Cardano node
- Faucet with unlimited test ADA
- Block producer
- All running locally

---

## Comparison

| Feature | Yaci DevKit | Private Testnet | Preprod Testnet |
|---------|-------------|-----------------|-----------------|
| Setup Time | 2 minutes | 10 minutes | 2-4 hours |
| Sync Required | No | No | Yes |
| Block Time | ~1 second | ~20 seconds | ~20 seconds |
| Test ADA | Unlimited | Unlimited | Limited (faucet) |
| Internet Required | No | No | Yes |
| Best For | Development | Testing | Pre-production |

---

## Recommendation for You

**Use Yaci DevKit** because:
1. ✅ Fastest setup (2 minutes)
2. ✅ No blockchain sync
3. ✅ Instant transactions
4. ✅ Perfect for rapid development
5. ✅ Can switch to testnet later

---

## Next Steps

I'll set up Yaci DevKit for you now with Docker!
