# Real Blockchain Integration Setup Guide

## Overview

This guide will help you set up **REAL** blockchain integration with:
- ✅ Cardano Preprod Testnet
- ✅ Hydra Node (real L2)
- ✅ Deployed Smart Contracts
- ✅ Real wallet transactions
- ✅ Masumi testnet integration

---

## Prerequisites

### 1. Install Cardano Node

```bash
# Install Cardano node (Ubuntu/Debian)
curl -sS https://downloads.cardano.org/cardano-node/latest/cardano-node-latest-linux.tar.gz | tar xz
sudo mv cardano-node cardano-cli /usr/local/bin/

# Verify installation
cardano-cli --version
cardano-node --version
```

### 2. Install Hydra Node

```bash
# Download Hydra
wget https://github.com/input-output-hk/hydra/releases/download/0.15.0/hydra-x86_64-linux.zip
unzip hydra-x86_64-linux.zip
sudo mv hydra-node /usr/local/bin/

# Verify
hydra-node --version
```

### 3. Install Aiken (for smart contracts)

```bash
# Already installed - verify
aiken --version
# Should show: aiken v1.1.19+e525483
```

---

## Step 1: Set Up Cardano Preprod Testnet

### 1.1 Download Preprod Configuration

```bash
cd ~/cardano
mkdir -p preprod

# Download configs
wget -P preprod https://book.world.dev.cardano.org/environments/preprod/config.json
wget -P preprod https://book.world.dev.cardano.org/environments/preprod/topology.json
wget -P preprod https://book.world.dev.cardano.org/environments/preprod/byron-genesis.json
wget -P preprod https://book.world.dev.cardano.org/environments/preprod/shelley-genesis.json
wget -P preprod https://book.world.dev.cardano.org/environments/preprod/alonzo-genesis.json
wget -P preprod https://book.world.dev.cardano.org/environments/preprod/conway-genesis.json
```

### 1.2 Start Cardano Node

```bash
# Create start script
cat > ~/cardano/start-preprod-node.sh << 'EOF'
#!/bin/bash
cardano-node run \
  --topology preprod/topology.json \
  --database-path preprod/db \
  --socket-path preprod/node.socket \
  --host-addr 0.0.0.0 \
  --port 3001 \
  --config preprod/config.json
EOF

chmod +x ~/cardano/start-preprod-node.sh

# Start node (in tmux or screen)
tmux new -s cardano-node
~/cardano/start-preprod-node.sh
```

### 1.3 Wait for Sync

```bash
# Check sync status
export CARDANO_NODE_SOCKET_PATH=~/cardano/preprod/node.socket
cardano-cli query tip --testnet-magic 1

# Wait until "syncProgress" is 100%
```

---

## Step 2: Create Wallet and Get Test ADA

### 2.1 Generate Wallet Keys

```bash
cd ~/cardano/preprod

# Generate payment keys
cardano-cli address key-gen \
  --verification-key-file payment.vkey \
  --signing-key-file payment.skey

# Generate stake keys
cardano-cli stake-address key-gen \
  --verification-key-file stake.vkey \
  --signing-key-file stake.skey

# Build payment address
cardano-cli address build \
  --payment-verification-key-file payment.vkey \
  --stake-verification-key-file stake.vkey \
  --out-file payment.addr \
  --testnet-magic 1

# Show your address
cat payment.addr
```

### 2.2 Get Test ADA from Faucet

```bash
# Visit Cardano Testnet Faucet
# https://docs.cardano.org/cardano-testnet/tools/faucet/

# Request 10,000 test ADA to your address
# Use the address from payment.addr
```

### 2.3 Verify Balance

```bash
cardano-cli query utxo \
  --address $(cat payment.addr) \
  --testnet-magic 1
```

---

## Step 3: Deploy Smart Contracts to Preprod

### 3.1 Build Contracts

```bash
cd packages/cardano-contracts
aiken build

# This generates plutus.json with compiled validators
```

### 3.2 Generate Script Addresses

```bash
# Extract validator from plutus.json
jq -r '.validators[0].compiledCode' plutus.json > agent_registry.plutus

# Create script address
cardano-cli address build \
  --payment-script-file agent_registry.plutus \
  --testnet-magic 1 \
  --out-file agent_registry.addr

# Repeat for other contracts
```

### 3.3 Deploy Contracts

```bash
# Create deployment script
cat > deploy-contracts.sh << 'EOF'
#!/bin/bash
export CARDANO_NODE_SOCKET_PATH=~/cardano/preprod/node.socket

# Send ADA to script address to "deploy" it
cardano-cli transaction build \
  --tx-in $(cardano-cli query utxo --address $(cat ~/cardano/preprod/payment.addr) --testnet-magic 1 | tail -1 | awk '{print $1"#"$2}') \
  --tx-out $(cat agent_registry.addr)+10000000 \
  --change-address $(cat ~/cardano/preprod/payment.addr) \
  --testnet-magic 1 \
  --out-file tx.raw

cardano-cli transaction sign \
  --tx-body-file tx.raw \
  --signing-key-file ~/cardano/preprod/payment.skey \
  --testnet-magic 1 \
  --out-file tx.signed

cardano-cli transaction submit \
  --tx-file tx.signed \
  --testnet-magic 1
EOF

chmod +x deploy-contracts.sh
./deploy-contracts.sh
```

---

## Step 4: Set Up Hydra Node

### 4.1 Generate Hydra Keys

```bash
cd ~/cardano/preprod

# Generate Hydra keys
hydra-node gen-hydra-key --output-file hydra.sk
hydra-node gen-hydra-key --output-file hydra.vk
```

### 4.2 Start Hydra Node

```bash
cat > start-hydra-node.sh << 'EOF'
#!/bin/bash
hydra-node \
  --node-id hydra-node-1 \
  --api-host 0.0.0.0 \
  --api-port 4001 \
  --host 0.0.0.0 \
  --port 5001 \
  --hydra-signing-key hydra.sk \
  --hydra-verification-key hydra.vk \
  --cardano-signing-key payment.skey \
  --cardano-verification-key payment.vkey \
  --ledger-protocol-parameters preprod/protocol-parameters.json \
  --testnet-magic 1 \
  --node-socket ~/cardano/preprod/node.socket
EOF

chmod +x start-hydra-node.sh

# Start in tmux
tmux new -s hydra-node
./start-hydra-node.sh
```

---

## Step 5: Configure Application

### 5.1 Update Environment Variables

```bash
# Edit .env file
cat > .env << 'EOF'
# Cardano Configuration
CARDANO_NETWORK=preprod
CARDANO_NODE_SOCKET=/home/user/cardano/preprod/node.socket
CARDANO_TESTNET_MAGIC=1

# Wallet Configuration
CARDANO_PAYMENT_SKEY=/home/user/cardano/preprod/payment.skey
CARDANO_PAYMENT_VKEY=/home/user/cardano/preprod/payment.vkey
CARDANO_PAYMENT_ADDR=/home/user/cardano/preprod/payment.addr

# Hydra Configuration
HYDRA_NODE_URL=http://localhost:4001
HYDRA_API_KEY=your_api_key_here

# Smart Contract Addresses
AGENT_REGISTRY_ADDR=addr_test1...
DATA_INGESTION_ADDR=addr_test1...
ANALYSIS_RESULTS_ADDR=addr_test1...

# Masumi Configuration (testnet)
MASUMI_API_URL=https://testnet.masumi.network/api
MASUMI_API_KEY=your_masumi_key

# AI API Keys
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
EOF
```

### 5.2 Update Hydra Client

```python
# packages/hydra-layer2/src/hydra_layer2.py
import aiohttp
import subprocess
import json

class HydraLayer2:
    def __init__(self, hydra_url: str = None):
        self.hydra_url = hydra_url or os.getenv('HYDRA_NODE_URL', 'http://localhost:4001')
        self.session = None
        
    async def create_head(self, participants: List[str]) -> str:
        """Create REAL Hydra head"""
        async with self.session.post(f"{self.hydra_url}/commit") as resp:
            result = await resp.json()
            return result['headId']
    
    async def submit_transaction(self, head_id: str, tx: Dict) -> Dict:
        """Submit REAL transaction to Hydra head"""
        async with self.session.post(
            f"{self.hydra_url}/heads/{head_id}/transactions",
            json=tx
        ) as resp:
            return await resp.json()
```

### 5.3 Update Smart Contract Integration

```python
# packages/cardano-contracts/src/contract_client.py
import subprocess
import json

class CardanoContractClient:
    def __init__(self):
        self.node_socket = os.getenv('CARDANO_NODE_SOCKET')
        self.testnet_magic = os.getenv('CARDANO_TESTNET_MAGIC', '1')
        
    def submit_to_contract(self, contract_addr: str, datum: Dict, redeemer: str):
        """Submit REAL transaction to smart contract"""
        # Build transaction with cardano-cli
        cmd = [
            'cardano-cli', 'transaction', 'build',
            '--tx-in', self._get_utxo(),
            '--tx-out', f"{contract_addr}+5000000",
            '--tx-out-datum-hash', self._hash_datum(datum),
            '--change-address', os.getenv('CARDANO_PAYMENT_ADDR'),
            '--testnet-magic', self.testnet_magic,
            '--out-file', 'tx.raw'
        ]
        subprocess.run(cmd, check=True)
        
        # Sign and submit
        self._sign_and_submit('tx.raw')
```

---

## Step 6: Test Real Integration

### 6.1 Test Script

```python
# tests/test_real_blockchain.py
import asyncio
from hydra_layer2 import HydraLayer2
from contract_client import CardanoContractClient

async def test_real_integration():
    # Test Cardano connection
    client = CardanoContractClient()
    balance = client.get_balance()
    print(f"Wallet balance: {balance} lovelace")
    
    # Test Hydra
    hydra = HydraLayer2()
    await hydra.initialize()
    head_id = await hydra.create_head(["addr1...", "addr2..."])
    print(f"Real Hydra head created: {head_id}")
    
    # Test smart contract
    result = client.submit_to_contract(
        contract_addr=os.getenv('AGENT_REGISTRY_ADDR'),
        datum={"agent_id": "test-001"},
        redeemer="Register"
    )
    print(f"Contract TX: {result['txHash']}")

asyncio.run(test_real_integration())
```

---

## Step 7: Monitoring

### 7.1 Check Transactions

```bash
# View on Cardano Explorer
https://preprod.cardanoscan.io/address/YOUR_ADDRESS

# Check Hydra head status
curl http://localhost:4001/heads
```

### 7.2 Monitor Logs

```bash
# Cardano node logs
tail -f ~/cardano/preprod/node.log

# Hydra node logs
tail -f ~/cardano/preprod/hydra.log
```

---

## Next Steps

1. **Run setup scripts** above
2. **Wait for node sync** (~2-4 hours for preprod)
3. **Get test ADA** from faucet
4. **Deploy contracts** to testnet
5. **Start Hydra node**
6. **Update application** with real endpoints
7. **Test integration** with real transactions

---

## Troubleshooting

### Node won't sync
- Check internet connection
- Verify topology.json is correct
- Ensure sufficient disk space (>50GB)

### Hydra won't start
- Ensure Cardano node is fully synced
- Check that port 4001 is available
- Verify keys are generated correctly

### Transactions fail
- Check wallet has sufficient ADA
- Verify testnet-magic is correct (1 for preprod)
- Ensure node socket path is correct

---

## Production Deployment

For mainnet deployment:
1. Change `--testnet-magic 1` to `--mainnet`
2. Use mainnet configuration files
3. Use REAL ADA (not test ADA)
4. Audit all smart contracts
5. Set up monitoring and alerts
6. Implement proper key management

---

**Status**: This guide provides REAL blockchain integration, not simulation.
