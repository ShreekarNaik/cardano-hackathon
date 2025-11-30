#!/bin/bash

# Real Blockchain Setup Script
# Sets up Cardano Preprod Testnet + Hydra Node

set -e

echo "=================================="
echo "Real Blockchain Setup"
echo "=================================="
echo ""
echo "This will set up:"
echo "  • Cardano Preprod Testnet Node"
echo "  • Hydra Layer 2 Node"
echo "  • Wallet with test ADA"
echo "  • Smart contract deployment"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Create directories
CARDANO_DIR="$HOME/cardano"
PREPROD_DIR="$CARDANO_DIR/preprod"
mkdir -p "$PREPROD_DIR"

echo ""
echo "Step 1: Downloading Cardano Preprod Configuration..."
cd "$PREPROD_DIR"

wget -q https://book.world.dev.cardano.org/environments/preprod/config.json
wget -q https://book.world.dev.cardano.org/environments/preprod/topology.json
wget -q https://book.world.dev.cardano.org/environments/preprod/byron-genesis.json
wget -q https://book.world.dev.cardano.org/environments/preprod/shelley-genesis.json
wget -q https://book.world.dev.cardano.org/environments/preprod/alonzo-genesis.json
wget -q https://book.world.dev.cardano.org/environments/preprod/conway-genesis.json

echo "✅ Configuration downloaded"

echo ""
echo "Step 2: Generating Wallet Keys..."

if [ ! -f payment.skey ]; then
    cardano-cli address key-gen \
        --verification-key-file payment.vkey \
        --signing-key-file payment.skey
    
    cardano-cli stake-address key-gen \
        --verification-key-file stake.vkey \
        --signing-key-file stake.skey
    
    cardano-cli address build \
        --payment-verification-key-file payment.vkey \
        --stake-verification-key-file stake.vkey \
        --out-file payment.addr \
        --testnet-magic 1
    
    echo "✅ Wallet created"
    echo ""
    echo "Your address:"
    cat payment.addr
    echo ""
    echo "⚠️  IMPORTANT: Get test ADA from faucet:"
    echo "   https://docs.cardano.org/cardano-testnet/tools/faucet/"
    echo "   Send to: $(cat payment.addr)"
else
    echo "✅ Wallet already exists"
fi

echo ""
echo "Step 3: Creating Cardano Node Start Script..."

cat > "$CARDANO_DIR/start-preprod-node.sh" << 'EOF'
#!/bin/bash
export CARDANO_NODE_SOCKET_PATH="$HOME/cardano/preprod/node.socket"

cardano-node run \
  --topology "$HOME/cardano/preprod/topology.json" \
  --database-path "$HOME/cardano/preprod/db" \
  --socket-path "$HOME/cardano/preprod/node.socket" \
  --host-addr 0.0.0.0 \
  --port 3001 \
  --config "$HOME/cardano/preprod/config.json"
EOF

chmod +x "$CARDANO_DIR/start-preprod-node.sh"
echo "✅ Start script created: $CARDANO_DIR/start-preprod-node.sh"

echo ""
echo "Step 4: Creating Hydra Node Setup..."

cat > "$CARDANO_DIR/start-hydra-node.sh" << 'EOF'
#!/bin/bash
export CARDANO_NODE_SOCKET_PATH="$HOME/cardano/preprod/node.socket"

# Generate Hydra keys if they don't exist
if [ ! -f "$HOME/cardano/preprod/hydra.sk" ]; then
    hydra-node gen-hydra-key --output-file "$HOME/cardano/preprod/hydra"
fi

hydra-node \
  --node-id hydra-node-1 \
  --api-host 0.0.0.0 \
  --api-port 4001 \
  --host 0.0.0.0 \
  --port 5001 \
  --hydra-signing-key "$HOME/cardano/preprod/hydra.sk" \
  --cardano-signing-key "$HOME/cardano/preprod/payment.skey" \
  --cardano-verification-key "$HOME/cardano/preprod/payment.vkey" \
  --testnet-magic 1 \
  --node-socket "$HOME/cardano/preprod/node.socket"
EOF

chmod +x "$CARDANO_DIR/start-hydra-node.sh"
echo "✅ Hydra start script created"

echo ""
echo "Step 5: Updating Application Configuration..."

cat > "$(dirname "$0")/../.env.blockchain" << EOF
# Real Blockchain Configuration
CARDANO_NETWORK=preprod
CARDANO_NODE_SOCKET=$HOME/cardano/preprod/node.socket
CARDANO_TESTNET_MAGIC=1

# Wallet Configuration
CARDANO_PAYMENT_SKEY=$HOME/cardano/preprod/payment.skey
CARDANO_PAYMENT_VKEY=$HOME/cardano/preprod/payment.vkey
CARDANO_PAYMENT_ADDR=$HOME/cardano/preprod/payment.addr

# Hydra Configuration
HYDRA_NODE_URL=http://localhost:4001

# Smart Contracts (update after deployment)
AGENT_REGISTRY_ADDR=
DATA_INGESTION_ADDR=
ANALYSIS_RESULTS_ADDR=
EOF

echo "✅ Configuration created: .env.blockchain"

echo ""
echo "=================================="
echo "✅ Setup Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Start Cardano Node (in tmux/screen):"
echo "   tmux new -s cardano-node"
echo "   $CARDANO_DIR/start-preprod-node.sh"
echo ""
echo "2. Wait for sync (check with):"
echo "   export CARDANO_NODE_SOCKET_PATH=$HOME/cardano/preprod/node.socket"
echo "   cardano-cli query tip --testnet-magic 1"
echo ""
echo "3. Get test ADA from faucet:"
echo "   https://docs.cardano.org/cardano-testnet/tools/faucet/"
echo "   Address: $(cat $PREPROD_DIR/payment.addr)"
echo ""
echo "4. Deploy smart contracts:"
echo "   cd packages/cardano-contracts"
echo "   ./scripts/deploy-to-preprod.sh"
echo ""
echo "5. Start Hydra Node:"
echo "   tmux new -s hydra-node"
echo "   $CARDANO_DIR/start-hydra-node.sh"
echo ""
echo "6. Update .env with real values from .env.blockchain"
echo ""
echo "=================================="
